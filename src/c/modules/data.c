#include <pebble.h>
#include "c/modules/data.h"
#include "c/user_interface/menu_window.h"
#include "c/user_interface/action_window.h"
#include "c/modules/comm.h"
#include "c/stateful.h"

TileArray *tile_array = NULL;
IconArray *icon_array = NULL;
GBitmap *default_icon = NULL;

//! Initialise a tile_array object, this struct is used to store an arbitrary number of tiles
//! and associated metadata
//! @param size The initial number of tiles to allocate pointers for
static void data_tile_array_init(uint8_t size) {
  tile_array = malloc(sizeof(TileArray));
  tile_array->tiles = malloc(size * sizeof(Tile*));
  tile_array->used = 0;
  tile_array->size = size;
  tile_array->default_idx = 0;
  tile_array->open_default = false;
}

//! Append a pre-built tile to tile_array->tiles, expanding the pointer array if required
//! @param tile A pointer to a pre-constructed Tile object
static void data_tile_array_add_tile(Tile *tile) {
  if (!tile_array) { 
    free(tile);
    return; 
  }
  if(tile_array->used >= MAX_TILES) {
    #if DEBUG > 1
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Hit MAX_TILES(%d), skipping tile", MAX_TILES);
    #endif
    free(tile);
    return;
  }

  // Grow tile_array if size has been reached
  if (tile_array->size < MAX_TILES && tile_array->used == tile_array->size) {
    #if DEBUG > 1
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Resizing tile_array from %d to %d", tile_array->size, tile_array->size * 2);
    #endif
    tile_array->size = MIN(MAX_TILES, tile_array->size *2);
    tile_array->tiles = realloc(tile_array->tiles, tile_array->size * sizeof(Tile*));
  }
  
  tile_array->tiles[tile_array->used++] = tile;
}

//! Free tile_array object, including all nested pointers 
void data_tile_array_free() {
  if (!tile_array) { return; }
  for(uint8_t i=0; i < tile_array->used; i++) {
    for(uint8_t j=0; j < ARRAY_LENGTH((*tile_array->tiles[i]).texts); j++) {
      if ((*tile_array->tiles[i]).texts[j]) { free((*tile_array->tiles[i]).texts[j]); }
      if ((*tile_array->tiles[i]).icon_key[j]) { free((*tile_array->tiles[i]).icon_key[j]); }
    }
    free(tile_array->tiles[i]);
  }
  free(tile_array->tiles);
  free(tile_array);
  tile_array = NULL;
}

//! Extract tiles and associated metadata from a raw uint8_t array, pack this information
//! into the tile_array and additionally store tiles in persistant storage if they will fit
//! @param data A uint8_t array containing tile_array metadata, one or more Tile objects and
//! optionally an array of icon_keys
//! @param data_size The length of of data
void data_tile_array_pack_tiles(uint8_t *data, int data_size){
    data_tile_array_free();
    data_tile_array_init(4);

    Tile *tile;
    int ptr = 0;
    uint8_t tile_count = data[ptr++];
    tile_array->default_idx = data[ptr++];
    if (tile_count < MAX_PERSIST_TILES) { persist_write_int(PERSIST_DEFAULT_IDX, tile_array->default_idx); }
    tile_array->open_default = data[ptr++];
    if (tile_count < MAX_PERSIST_TILES) { persist_write_bool(PERSIST_OPEN_DEFAULT, tile_array->open_default); }
    uint8_t i = 0;

    // Creates and inserts a Tile objects into tile_array
    while (i < tile_count) {
      int tile_start = ptr;
      tile = (Tile*) malloc(sizeof(Tile));
      uint8_t text_size = 0;
      uint8_t key_size = 0;
      tile->color = PBL_IF_COLOR_ELSE((GColor) data[ptr], GColorBlack); ptr++;
      tile->highlight = PBL_IF_COLOR_ELSE((GColor) data[ptr], GColorWhite); ptr++;
      
      for(uint8_t i=0; i < ARRAY_LENGTH(tile->texts); i++) {
        text_size = data[ptr++];
        tile->texts[i] = (char*) malloc(text_size * sizeof(char));
        strncpy(tile->texts[i], (char*) &data[ptr], text_size);
        ptr += text_size;
      }

      for(uint8_t i=0; i < ARRAY_LENGTH(tile->icon_key); i++) {
        key_size = data[ptr++];
        tile->icon_key[i] = (char*) malloc(key_size * sizeof(char));
        strncpy(tile->icon_key[i], (char*) &data[ptr], key_size);
        ptr += key_size;
      }
      if (tile_count < MAX_PERSIST_TILES) { persist_write_data(PERSIST_TILE_START + i, &data[tile_start], ptr - tile_start); }
      data_tile_array_add_tile(tile); 
      i++;
    }

    // Fires data_icon_array_search for any passed icon_keys for faster icon retrieval
    // (this is usually performed when an icon is first used in the app)
    while (ptr < data_size) {
      uint8_t str_size = data[ptr++];
      char *tmp_str = (char*) malloc(str_size * sizeof(char));
      strncpy(tmp_str, (char*) &data[ptr], str_size);
      data_icon_array_search(tmp_str);
      free(tmp_str);
      ptr += str_size;
    }

    menu_window_push();

    #if DEBUG > 1 
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Completed tile assignment");
    #endif

  }


//! Initialise an icon_array object, this struct is a FIFO that can store up to ICON_ARRAY_SIZE
//! icons in memory at a given time, if additional icons are written after the max 
//! size is reached, then the oldest icon will be replaced with the new icon
void data_icon_array_init(uint8_t size) {
  icon_array = malloc(sizeof(IconArray));
  icon_array->ptr = 0;
  icon_array->size = size;
  
  icon_array->icons = malloc(size * sizeof(Icon*));
  for(uint8_t i=0; i < size; i++) {
    icon_array->icons[i] = malloc(sizeof(Icon));
    (*icon_array->icons[i]).icon = NULL;
    (*icon_array->icons[i]).key = NULL;
  }
  default_icon = gbitmap_create_with_resource(RESOURCE_ID_ICON_DEFAULT);
}

//! Free icon_array and all nested objects
void data_icon_array_free() {
  if (!icon_array) { return; }
  for(uint8_t i=0; i < icon_array->size; i++) {
      gbitmap_destroy((*icon_array->icons[i]).icon);
      free((*icon_array->icons[i]).key);
      free(icon_array->icons[i]);
  }
  free(icon_array->icons);
  free(icon_array);
  gbitmap_destroy(default_icon);
}

//! Extract an icon and associated metadata from a raw uint8_t array, pack this information
//! into icon_array at a provided index and call window icon refresh's to display the new icon
//! @param data A uint8_t array containing a lookup key, icon data (either a resource id or 
//! raw png data) and an index at which to insert this information into the icon_array 
void data_icon_array_add_icon(uint8_t *data) {
  if (!icon_array) { return; }
  int ptr = 0;
  uint8_t index = data[ptr++];
  Icon *icon = icon_array->icons[index];

  uint8_t key_size = data[ptr++];
  if (!icon->key) { 
    icon->key = (char*) malloc(key_size * sizeof(char));
    strncpy(icon->key, (char*) &data[ptr], key_size);
  }
  ptr += key_size;

  uint16_t icon_size = *(uint16_t*) &data[ptr];
  if (heap_bytes_free() < icon_size) { return; }
  ptr +=2;
  if (icon->icon) { gbitmap_destroy(icon->icon); icon->icon = NULL; }
  if (icon_size == 1) {
    icon->icon = gbitmap_create_with_resource(data[ptr]);
    if(!persist_exists(PERSIST_ICON_START + index)) {
      persist_write_data(PERSIST_ICON_START + index, data, icon_size + ptr + 1);
    }
  } else {
    icon->icon = gbitmap_create_from_png_data(&data[ptr], icon_size);
  }

  #if DEBUG > 1
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Created icon with key %s at index %d:", icon->key, index);
  #endif
  menu_window_refresh_icons();
  action_window_refresh_icons();
}

//! Searches icon_array for an icon matching a passed key, when no match is found locally
//! a dummy entry is created in icon_array with a temporary icon, a request is then
//! sent to the pebblekit environment to find and send the requested icon, which will
//! replace the dummy icon in icon_array
//! @param key A unique lookup key associated with a specific icon
//! @return An icon from a slot in icon_array
GBitmap *data_icon_array_search(char* key){
  if (!icon_array || strlen(key) == 0) { return NULL; }
  // Search for icon locally and return the icon if found
  for (int i=0; i < icon_array->size; i++) {
    Icon *icon = icon_array->icons[i];
    if (icon->key && strcmp(key, icon->key) == 0) {
      return icon->icon;
    }
  }
  #if DEBUG > 1
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Couldnt find %s locally, asking JS environment", key);
  #endif 
  Icon *icon = icon_array->icons[icon_array->ptr];

  // Build a temporary icon to return to caller and send a request to pebblekit to replace with real icon
  free(icon->key);
  icon->key = NULL;
  icon->key = (char*) malloc(strlen(key) + 1 * sizeof(char));
  strcpy(icon->key, key);

  if (icon->icon) { gbitmap_destroy(icon->icon); }
  icon->icon = NULL;
  icon->icon = gbitmap_create_with_resource(RESOURCE_ID_ICON_DEFAULT);

  comm_icon_request(key, icon_array->ptr);
  icon_array->ptr = (icon_array->ptr + 1) % icon_array->size;
  return icon->icon;
}

//! Clears down all persistant storage keys
void data_clear_persist() {
  persist_delete(PERSIST_OPEN_DEFAULT);
  persist_delete(PERSIST_DEFAULT_IDX);
  persist_delete(PERSIST_COLOR);
  uint8_t i = PERSIST_TILE_START;
  while (i < PERSIST_TILE_START + MAX_PERSIST_TILES) {
    persist_delete(i);
    i++;
  }
  i = PERSIST_ICON_START;
  while (i < PERSIST_ICON_START + ICON_ARRAY_SIZE) {
    persist_delete(i);
    i++;
  }
}
//! Attempts to retrieve tile_array and icon_array information from persistant storage.
//! Due to size limitations only a finite number of tiles can be stored and retrieved this way
//! (MAX_PERSIST_TILES). Additionally icon_array entries that contain raw PNG data are too large
//! for this method and can only be obtained via pebblekit calls.
//! @return Retrieval success / failure
bool data_retrieve_persist() {
  if (!persist_exists(PERSIST_TILE_START)) { return false; }
  data_tile_array_init(4);

  Tile *tile;
  tile_array->default_idx = (uint8_t) persist_read_int(PERSIST_DEFAULT_IDX);
  tile_array->open_default = persist_read_bool(PERSIST_OPEN_DEFAULT);
  uint8_t *buffer = (uint8_t*) malloc(sizeof(uint8_t) * PERSIST_DATA_MAX_LENGTH);
  uint8_t i = 0;
  while (persist_read_data(PERSIST_TILE_START + i, buffer, PERSIST_DATA_MAX_LENGTH) != E_DOES_NOT_EXIST) {
    #if DEBUG > 1 
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Found tile at persist key %d", 2 + i);
    #endif
    int ptr = 0;
    tile = (Tile*) malloc(sizeof(Tile));
    uint8_t text_size = 0;
    uint8_t key_size = 0;
    tile->color = PBL_IF_COLOR_ELSE((GColor) buffer[ptr], GColorBlack); ptr++;
    tile->highlight = PBL_IF_COLOR_ELSE((GColor) buffer[ptr], GColorWhite); ptr++;
    
    for(uint8_t i=0; i < ARRAY_LENGTH(tile->texts); i++) {
      text_size = buffer[ptr++];
      tile->texts[i] = (char*) malloc(text_size * sizeof(char));
      strncpy(tile->texts[i], (char*) &buffer[ptr], text_size);
      ptr += text_size;
    }

    for(uint8_t i=0; i < ARRAY_LENGTH(tile->icon_key); i++) {
      key_size = buffer[ptr++];
      tile->icon_key[i] = (char*) malloc(key_size * sizeof(char));
      strncpy(tile->icon_key[i], (char*) &buffer[ptr], key_size);
      ptr += key_size;
    }

    data_tile_array_add_tile(tile); 
    i++;
  }


  if (i > 0) {
    uint8_t icon_index = PERSIST_ICON_START;
    while (icon_index < PERSIST_ICON_START + ICON_ARRAY_SIZE) {
      if (!persist_exists(icon_index)) { 
        icon_index++;
        continue; 
      }

      persist_read_data(icon_index, buffer, PERSIST_DATA_MAX_LENGTH);
      data_icon_array_add_icon(buffer);
      icon_array->ptr = (icon_array->ptr + 1) % icon_array->size;
      icon_index++;
    }

    // Pushing nested windows to stack too quickly causes undocumented behaviour in the SDK. 
    // Using app_timer_register delays enough to work around this. 
    app_timer_register(0, menu_window_push, NULL);

    #if DEBUG > 1 
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Completed data retrieval");
    #endif
    free(buffer);
    return true;
  } else {
    #if DEBUG > 1 
    APP_LOG(APP_LOG_LEVEL_DEBUG, "No data retrieved");
    #endif
    free(buffer);
    return false;
  }
}
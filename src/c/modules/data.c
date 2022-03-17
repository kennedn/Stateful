#include <pebble.h>
#include "c/modules/data.h"
#include "c/user_interface/menu_window.h"
#include "c/user_interface/action_window.h"
#include "c/modules/comm.h"
#include "c/stateful.h"

TileArray *tile_array = NULL;
IconArray *icon_array = NULL;

bool data_retrieve_persist_icon();


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
    debug(3, "Hit MAX_TILES(%d), skipping tile", MAX_TILES);
    free(tile);
    return;
  }

  // Grow tile_array if size has been reached
  if (tile_array->size < MAX_TILES && tile_array->used == tile_array->size) {
    debug(3, "Resizing tile_array from %d to %d", tile_array->size, tile_array->size * 2);
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
      tile->mask = 0;
      
      for(uint8_t i=0; i < ARRAY_LENGTH(tile->texts); i++) {
        text_size = data[ptr++];
        tile->texts[i] = (char*) malloc(text_size * sizeof(char));
        strncpy(tile->texts[i], (char*) &data[ptr], text_size);
        ptr += text_size;
        tile->mask |= (text_size > 1) << i;
      }

      for(uint8_t i=0; i < ARRAY_LENGTH(tile->icon_key); i++) {
        key_size = data[ptr++];
        if (key_size > 1) {
          tile->icon_key[i] = (char*) malloc(key_size * sizeof(char));
          strncpy(tile->icon_key[i], (char*) &data[ptr], key_size);
        } else {
          tile->icon_key[i] = (char*) malloc(DEFAULT_ICON_KEY_SIZE * sizeof(char));
          strncpy(tile->icon_key[i], (char*) DEFAULT_ICON_KEY, DEFAULT_ICON_KEY_SIZE);
        }
        ptr += key_size;
        tile->mask &= ~((key_size <= 1) << i);
      }
      if (tile_count < MAX_PERSIST_TILES) { persist_write_data(PERSIST_TILE_START + i, &data[tile_start], ptr - tile_start); }
      data_tile_array_add_tile(tile); 
      i++;
    }
    persist_write_data(PERSIST_COLOR, &(tile_array->tiles[tile_array->default_idx]->color), sizeof(GColor8));
    // Fires data_icon_array_search for any passed icon_keys for faster icon retrieval
    // (this is usually performed when an icon is first used in the app)

    data_retrieve_persist_icon();
    while (ptr < data_size) {
      uint8_t str_size = data[ptr++];
      char *tmp_str = (char*) malloc(str_size * sizeof(char));
      strncpy(tmp_str, (char*) &data[ptr], str_size);
      data_icon_array_search(tmp_str);
      free(tmp_str);
      tmp_str = NULL;
      ptr += str_size;
    }

    menu_window_push();
    debug(3, "Completed tile assignment, free bytes: %dB", heap_bytes_free());
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
}

//! Free icon_array and all nested objects
void data_icon_array_free() {
  if (!icon_array) { return; }
  for(uint8_t i=0; i < icon_array->size; i++) {
      if ((*icon_array->icons[i]).icon != indicator_icons[ICON_DEFAULT]) {gbitmap_destroy((*icon_array->icons[i]).icon);}
      free((*icon_array->icons[i]).key);
      free(icon_array->icons[i]);
  }
  free(icon_array->icons);
  free(icon_array);
  icon_array = NULL;
}

//! Extract an icon and associated metadata from a raw uint8_t array, pack this information
//! into icon_array at a provided index and call window icon refresh's to display the new icon
//! @param data A uint8_t array containing a lookup key, icon data (either a resource id or 
//! raw png data) and an index at which to insert this information into the icon_array 
//! @param index An explicit index, if > 0 this is used instead of the bundled index in icon data
void data_icon_array_add_icon(uint8_t *data, int8_t index) {
  if (!icon_array) { return; }
  int ptr = 0;
  if (index < 0) {index = data[ptr];}
  ptr++;
  Icon *icon = icon_array->icons[index];

  uint8_t key_size = data[ptr++];
  free(icon->key);
  icon->key = (char*) malloc(key_size * sizeof(char));
  strncpy(icon->key, (char*) &data[ptr], key_size);
  ptr += key_size;

  uint16_t icon_size = *(uint16_t*) &data[ptr];
  if (heap_bytes_free() < icon_size) { return; }
  ptr +=2;
  if (icon->icon) { gbitmap_destroy(icon->icon); }
  if (icon_size == 1) {
    icon->icon = gbitmap_create_with_resource(data[ptr]);
    if (!icon->icon) {
      debug(3, "gbitmap creation failed for key %s, setting back to default", icon->key);
      icon->icon = NULL;
    }
    if(!persist_exists(PERSIST_ICON_START + index)) {
      persist_write_data(PERSIST_ICON_START + index, data, icon_size + ptr + 1);
    }
  } else {
    icon->icon = gbitmap_create_from_png_data(&data[ptr], icon_size);
  }

  debug(3, "Created icon with key %s at index %d, free bytes: %dB", icon->key, index, heap_bytes_free());
  menu_window_refresh_icons();
  action_window_refresh_icons();
}

//! Searches icon_array for an icon matching a passed key, when no match is found locally
//! a dummy entry is created in icon_array with a temporary icon, a request is then
//! sent to the pebblekit environment to find and send the requested icon, which will
//! replace the dummy icon in icon_array
//! @param key A unique lookup key associated with a specific icon
//! @return An icon from a slot in icon_array
GBitmap *data_icon_array_search(char *key){
  if (!icon_array || !key || strlen(key) == 0) { return NULL; }
  if (strcmp(key, DEFAULT_ICON_KEY) == 0) {
    return indicator_icons[ICON_DEFAULT];
  }
  // Search for icon locally and return the icon if found
  for (int i=0; i < icon_array->size; i++) {
    Icon *icon = icon_array->icons[i];
    if (icon->key && strcmp(key, icon->key) == 0) {
      return icon->icon;
    }
  }
  debug(3, "Couldnt find %s locally, JS will slot icon data in at position %d", key, icon_array->ptr);
  Icon *icon = icon_array->icons[icon_array->ptr];

  // Build a temporary icon to return to caller and send a request to pebblekit to replace with real icon
  free(icon->key);
  icon->key = (char*) malloc(strlen(key) + 1 * sizeof(char));
  strcpy(icon->key, key);

  if (icon->icon) { gbitmap_destroy(icon->icon); }
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

bool data_retrieve_persist_icon() {
  if (!persist_exists(PERSIST_ICON_START)) { return false;}
  uint8_t icon_index = PERSIST_ICON_START;
  uint8_t *buffer = (uint8_t*) malloc(sizeof(uint8_t) * PERSIST_DATA_MAX_LENGTH);
  while (icon_index < PERSIST_ICON_START + ICON_ARRAY_SIZE) {
    if (!persist_exists(icon_index)) { 
      icon_index++;
      continue; 
    }

    persist_read_data(icon_index, buffer, PERSIST_DATA_MAX_LENGTH);
    data_icon_array_add_icon(buffer, icon_array->ptr);
    icon_array->ptr = (icon_array->ptr + 1) % icon_array->size;
    icon_index++;
  }
  free(buffer);
  return true;
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
    debug(3, "Found tile at persist key %d", PERSIST_TILE_START + i);
    int ptr = 0;
    tile = (Tile*) malloc(sizeof(Tile));
    uint8_t text_size = 0;
    uint8_t key_size = 0;
    tile->color = PBL_IF_COLOR_ELSE((GColor) buffer[ptr], GColorBlack); ptr++;
    tile->highlight = PBL_IF_COLOR_ELSE((GColor) buffer[ptr], GColorWhite); ptr++;
    tile->mask = 0;
    
    for(uint8_t i=0; i < ARRAY_LENGTH(tile->texts); i++) {
      text_size = buffer[ptr++];
      tile->texts[i] = (char*) malloc(text_size * sizeof(char));
      strncpy(tile->texts[i], (char*) &buffer[ptr], text_size);
      ptr += text_size;
      tile->mask |= (text_size > 1) << i;
    }

    for(uint8_t i=0; i < ARRAY_LENGTH(tile->icon_key); i++) {
      key_size = buffer[ptr++];
      if (key_size > 1) {
        tile->icon_key[i] = (char*) malloc(key_size * sizeof(char));
        strncpy(tile->icon_key[i], (char*) &buffer[ptr], key_size);
      } else {
        tile->icon_key[i] = (char*) malloc(DEFAULT_ICON_KEY_SIZE * sizeof(char));
        strncpy(tile->icon_key[i], (char*) DEFAULT_ICON_KEY, DEFAULT_ICON_KEY_SIZE);
      }
      ptr += key_size;
      tile->mask &= ~((key_size <= 1) << i);
    }

    data_tile_array_add_tile(tile); 
    i++;
  }


  if (i > 0) {
    data_retrieve_persist_icon();
    menu_window_push();

    free(buffer);
    debug(3, "Completed persist retrieve, free bytes: %dB", heap_bytes_free());
    return true;
  } else {
    free(buffer);
    debug(3, "No data retrieved");
    return false;
  }
}

void data_free(bool init_icon) {
  data_tile_array_free();
  data_icon_array_free();
  if (init_icon) {data_icon_array_init(ICON_ARRAY_SIZE);}
}

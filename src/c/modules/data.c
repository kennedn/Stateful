#include <pebble.h>
#include "c/modules/data.h"
#include "c/user_interface/menu_window.h"
#include "c/user_interface/action_window.h"
#include "c/modules/comm.h"
#include "c/stateful.h"

TileArray *tile_array = NULL;
IconArray *icon_array = NULL;
GBitmap *default_icon = NULL;

static void data_tile_array_init(uint8_t size) {
  tile_array = malloc(sizeof(TileArray));
  tile_array->tiles = malloc(size * sizeof(Tile*));
  tile_array->used = 0;
  tile_array->size = size;
  tile_array->default_idx = 0;
  tile_array->open_default = false;
}

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

  if (tile_array->size < MAX_TILES && tile_array->used == tile_array->size) {
    #if DEBUG > 1
      APP_LOG(APP_LOG_LEVEL_DEBUG, "Resizing tile_array from %d to %d", tile_array->size, tile_array->size * 2);
    #endif
    tile_array->size = MIN(MAX_TILES, tile_array->size *2);
    tile_array->tiles = realloc(tile_array->tiles, tile_array->size * sizeof(Tile*));
  }
  
  tile_array->tiles[tile_array->used++] = tile;
}

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

void data_tile_array_pack_tiles(uint8_t *data, int data_size){
    data_tile_array_free();
    data_tile_array_init(4);

    Tile *tile;
    int ptr = 0;
    uint8_t tile_count = data[ptr++];
    tile_array->default_idx = data[ptr++];
    tile_array->open_default = data[ptr++];
    uint8_t i = 0;
    while (i < tile_count) {
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
      data_tile_array_add_tile(tile); 
      i++;
    }
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

void data_icon_array_add_icon(uint8_t *data) {
  if (!icon_array) { return; }
  int ptr = 0;
  uint8_t index = data[ptr++];
  Icon *icon = icon_array->icons[index];

  uint16_t icon_size = *(uint16_t*) &data[ptr];
  if (heap_bytes_free() < icon_size) { return; }
  ptr +=2;
  if (icon->icon) { gbitmap_destroy(icon->icon); }
  icon->icon = NULL;
  icon->icon = (icon_size == 1) ? gbitmap_create_with_resource(data[ptr]) : gbitmap_create_from_png_data(&data[ptr], icon_size);

  #if DEBUG > 1
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Created icon at index %d", index);
  #endif
  menu_window_refresh_icons();
  action_window_refresh_icons();
}

GBitmap *data_icon_array_search(char* key){
  if (!icon_array || strlen(key) == 0) { return NULL; }
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
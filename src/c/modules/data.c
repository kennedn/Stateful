#include <pebble.h>
#include "c/modules/data.h"
#include "c/user_interface/menu_window.h"
#include "c/user_interface/action_window.h"
#include "c/modules/comm.h"
#include "c/stateful.h"

TileArray *tileArray = NULL;
IconArray *iconArray = NULL;
GBitmap *defaultIcon = NULL;

static void data_tile_array_init(uint8_t size) {
  tileArray = malloc(sizeof(TileArray));
  tileArray->tiles = malloc(size * sizeof(Tile));
  tileArray->used = 0;
  tileArray->size = size;
  tileArray->default_idx = 0;
  tileArray->open_default = false;
}

static void data_tile_array_add_tile(Tile *tile) {
  if (!tileArray) { return; }
  if (tileArray->used == tileArray->size) {
    tileArray->size *=2;
    tileArray->tiles = realloc(tileArray->tiles, tileArray->size * sizeof(Tile));
  }
  tileArray->tiles[tileArray->used++] = *tile;
}

void data_tile_array_free() {
  if (!tileArray) { return; }
  for(uint8_t i=0; i < tileArray->used; i++) {
    for(uint8_t j=0; j < ARRAY_LENGTH(tileArray->tiles[i].texts); j++) {
      free(tileArray->tiles[i].texts[j]);
      free(tileArray->tiles[i].icon_key[j]);
    }
  }

  free(tileArray->tiles);
  tileArray->tiles = NULL;
  free(tileArray);
  tileArray = NULL;
}

void data_tile_array_pack_tiles(uint8_t *data, int data_size){
    data_tile_array_free();
    data_tile_array_init(1);

    Tile *tile;
    int ptr = 0;
    int tile_counter = 0;
    uint8_t tile_count = data[ptr++];
    tileArray->default_idx = data[ptr++];
    tileArray->open_default = data[ptr++];
    uint8_t i = 0;
    while (i < tile_count) {
      tile = (Tile*) malloc(sizeof(Tile));
      uint8_t text_size = 0;
      uint8_t key_size = 0;
      tile->id = (uint8_t) data[ptr++];
      tile->color = PBL_IF_COLOR_ELSE((GColor) data[ptr], GColorBlack); ptr++;
      tile->highlight = PBL_IF_COLOR_ELSE((GColor) data[ptr], GColorWhite); ptr++;
      
      for(uint8_t i=0; i < ARRAY_LENGTH(tile->texts); i++) {
        text_size = data[ptr++];
        tile->texts[i] = (char*) malloc(text_size * sizeof(char*));
        strncpy(tile->texts[i], (char*) &data[ptr], text_size);
        ptr += text_size;
      }

      for(uint8_t i=0; i < ARRAY_LENGTH(tile->icon_key); i++) {
        key_size = data[ptr++];
        tile->icon_key[i] = (char*) malloc(key_size * sizeof(char*));
        strncpy(tile->icon_key[i], (char*) &data[ptr], key_size);
        ptr += key_size;
      }
      #ifdef DEBUG 
      APP_LOG(APP_LOG_LEVEL_DEBUG, "Tile size: %d", ptr - tile_counter);
      #endif
      tile_counter = ptr;
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

    #ifdef DEBUG 
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Completed tile assignment");
    #endif

  }
  
void data_icon_array_init(uint8_t size) {
  iconArray = malloc(sizeof(IconArray));
  iconArray->ptr = 0;
  iconArray->size = size;
  
  iconArray->icons = malloc(size * sizeof(Icon));
  for(uint8_t i=0; i < iconArray->size; i++) {
    iconArray->icons[i].icon = NULL;
    iconArray->icons[i].key = NULL;
  }
  defaultIcon = gbitmap_create_with_resource(RESOURCE_ID_ICON_DEFAULT);
}

void data_icon_array_free() {
  if (!iconArray) { return; }
  for(uint8_t i=0; i < iconArray->size; i++) {
      gbitmap_destroy(iconArray->icons[i].icon);
      free(iconArray->icons[i].key);
  }
  free(iconArray->icons);
  free(iconArray);
  gbitmap_destroy(defaultIcon);
}

void data_icon_array_add_icon(uint8_t *data) {
  if (!iconArray) { return; }
  int ptr = 0;
  uint8_t index = data[ptr++];
  Icon *icon = &iconArray->icons[index];

  uint16_t icon_size = *(uint16_t*) &data[ptr];
  if (heap_bytes_free() < icon_size) { return; }
  ptr +=2;
  if (icon->icon) { gbitmap_destroy(icon->icon); }
  icon->icon = NULL;
  icon->icon = (icon_size == 1) ? gbitmap_create_with_resource(data[ptr]) : gbitmap_create_from_png_data(&data[ptr], icon_size);

  #ifdef DEBUG
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Created icon at index %d", index);
  #endif
  menu_window_refresh_icons();
  action_window_refresh_icons();
}

GBitmap *data_icon_array_search(char* key){
  if (!iconArray || strlen(key) == 0) { return NULL; }
  for (int i=0; i < iconArray->size; i++) {
    Icon *icon = &iconArray->icons[i];
    if (icon->key && strcmp(key, icon->key) == 0) {
      return icon->icon;
    }
  }
  #ifdef DEBUG
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Couldnt find %s locally, asking JS environment", key);
  #endif 
  Icon *icon = &iconArray->icons[iconArray->ptr];

  free(icon->key);
  icon->key = NULL;
  icon->key = (char*) malloc(strlen(key) * sizeof(char));
  strcpy(icon->key, key);

  if (icon->icon) { gbitmap_destroy(icon->icon); }
  icon->icon = NULL;
  icon->icon = gbitmap_create_with_resource(RESOURCE_ID_ICON_DEFAULT);

  comm_icon_request(key, iconArray->ptr);
  iconArray->ptr = (iconArray->ptr + 1) % iconArray->size;
  return icon->icon;
}
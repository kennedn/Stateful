#include <pebble.h>
#include "c/modules/data.h"
#include "c/user_interface/menu_window.h"
#include "c/user_interface/action_window.h"
#include "c/modules/comm.h"
#define MIN(a,b) (((a)<(b))?(a):(b))

static void data_tile_array_init(uint8_t size) {
  tileArray = malloc(sizeof(TileArray));
  tileArray->tiles = malloc(size * sizeof(Tile));
  tileArray->used = 0;
  tileArray->size = size;
  tileArray->default_idx = 0;
  tileArray->open_default = false;
}

static void data_tile_array_add_tile(Tile *tile) {
  if (tileArray->used == tileArray->size) {
    tileArray->size *=2;
    tileArray->tiles = realloc(tileArray->tiles, tileArray->size * sizeof(Tile));
  }
  tileArray->tiles[tileArray->used++] = *tile;
}

void data_tile_array_free() {
  for(uint8_t i=0; i < tileArray->used; i++) {
    for(uint8_t j=0; j < ARRAY_LENGTH(tileArray->tiles[i].texts); j++) {
      free(tileArray->tiles[i].texts[j]);
    }
  }

  free(tileArray->tiles);
  free(tileArray);
}


void data_tile_array_pack_tiles(uint8_t *data, int data_size){
    data_tile_array_init(1);
    Tile *tile;
    int ptr = 0;
    tileArray->default_idx = data[ptr++];
    tileArray->open_default = data[ptr++];
    while (ptr < data_size) {
    APP_LOG(APP_LOG_LEVEL_DEBUG, "ptr: %d, size: %d", ptr, data_size);
      tile = (Tile*) malloc(sizeof(Tile));
      uint8_t text_size = 0;
      uint8_t key_size = 0;
      tile->id = (uint8_t) data[ptr++];
      tile->color = (GColor) data[ptr++];
      tile->highlight = (GColor) data[ptr++];
      
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

      data_tile_array_add_tile(tile);
    }

    for (int i=0; i < tileArray->used; i++) {
      APP_LOG(APP_LOG_LEVEL_DEBUG, "id:"BIN_PATTERN, BIN(tileArray->tiles[i].id));
    }
    menu_window_push();
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Completed tile assignment");

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
}

void data_icon_array_free() {
  for(uint8_t i=0; i < iconArray->size; i++) {
      free(iconArray->icons[i].key);
      free(iconArray->icons[i].icon);
  }
  free(iconArray->icons);
  free(iconArray);
}

void data_icon_array_add_icon(uint8_t *data) {
  int ptr = 0;
  uint8_t index = data[ptr++];
  Icon *icon = &iconArray->icons[index];

  uint16_t icon_size = *(uint16_t*) &data[ptr];
  ptr +=2;
  free(icon->icon);
  icon->icon = NULL;
  icon->icon = (icon_size == 1) ? gbitmap_create_with_resource(data[ptr]) : gbitmap_create_from_png_data(&data[ptr], icon_size);

  APP_LOG(APP_LOG_LEVEL_DEBUG, "Created icon at index %d", index);
  menu_window_refresh_icons();
  action_window_refresh_icons();
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Free bytes: %d", heap_bytes_free());
}

GBitmap *data_icon_array_search(char* key){
  for (int i=0; i < iconArray->size; i++) {
    Icon *icon = &iconArray->icons[i];
    if (icon->key && strcmp(key, icon->key) == 0) {
      return icon->icon;
    }
  }
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Couldnt find %s locally, asking JS environment", key);
  Icon *icon = &iconArray->icons[iconArray->ptr];

  free(icon->key);
  icon->key = NULL;
  icon->key = (char*) malloc(strlen(key) * sizeof(char*));
  strcpy(icon->key, key);

  free(icon->icon);
  icon->icon = NULL;
  icon->icon = gbitmap_create_with_resource(RESOURCE_ID_ICON_DEFAULT);

  comm_icon_request(key, iconArray->ptr);
  iconArray->ptr = (iconArray->ptr + 1) % iconArray->size;
  return icon->icon;
}
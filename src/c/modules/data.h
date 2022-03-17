#pragma once

typedef struct __attribute__((__packed__)) {
  GColor color;
  GColor highlight;
  char *texts[7];
  char *icon_key[7];
  uint8_t mask;
} Tile;

typedef struct __attribute__((__packed__)) {
  Tile **tiles;
  uint8_t used;
  uint8_t size;
  uint8_t default_idx;
  bool open_default;
} TileArray;

typedef struct __attribute__((__packed__)) {
  char *key;
  GBitmap *icon;
} Icon;

typedef struct __attribute__((__packed__)) {
  Icon **icons;
  uint8_t ptr;
  uint8_t size;
} IconArray;

extern TileArray *tile_array;
extern IconArray *icon_array;

void data_icon_array_add_icon(uint8_t *data, int8_t index);
GBitmap *data_icon_array_search(char* key);
void data_icon_array_free();
void data_icon_array_init(uint8_t size);
void data_tile_array_pack_tiles(uint8_t *data, int data_size);
void data_tile_array_free();

void data_clear_persist();
bool data_retrieve_persist();
void data_free(bool init_icon);
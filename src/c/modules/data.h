#pragma once
#define BIN_PATTERN "%c%c%c%c%c%c%c%c:%d"
#define BIN(byte)  \
  (byte & 0x80 ? '1' : '0'), \
  (byte & 0x40 ? '1' : '0'), \
  (byte & 0x20 ? '1' : '0'), \
  (byte & 0x10 ? '1' : '0'), \
  (byte & 0x08 ? '1' : '0'), \
  (byte & 0x04 ? '1' : '0'), \
  (byte & 0x02 ? '1' : '0'), \
  (byte & 0x01 ? '1' : '0'), \
  byte 


#define UP 0
#define UP_HOLD 1
#define MID 2
#define MID_HOLD 3
#define DOWN 4
#define DOWN_HOLD 5

typedef struct __attribute__((__packed__)) {
  GColor color;
  GColor highlight;
  char* texts[7];
  char* icon_key[7];
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

TileArray *tile_array;
IconArray *icon_array;
GBitmap *default_icon;

void data_icon_array_add_icon(uint8_t *data);
GBitmap *data_icon_array_search(char* key);
void data_icon_array_free();
void data_icon_array_init(uint8_t size);
void data_tile_array_pack_tiles(uint8_t *data, int data_size);
void data_tile_array_free();

void data_tile_array_clear_persist();
bool data_tile_array_retrieve_tiles();
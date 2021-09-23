#include <pebble.h>
#ifndef HEADER_FILE
#define HEADER_FILE
#include "c/modules/data.h"
#endif

void data_array_init(uint8_t size) {
  tileArray = malloc(sizeof(TileArray));
  tileArray->tiles = malloc(size * sizeof(Tile));
  tileArray->used = 0;
  tileArray->size = size;
}

void data_array_add_tile(Tile *tile) {
  if (tileArray->used == tileArray->size) {
    tileArray->size *=2;
    tileArray->tiles = realloc(tileArray->tiles, tileArray->size * sizeof(Tile));
  }

  tileArray->tiles[tileArray->used++] = *tile;
}

void data_array_free() {
  free(tileArray->tiles);
  tileArray->tiles = NULL;
  tileArray->used = tileArray->size = 0;
}

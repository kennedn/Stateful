#pragma once
#include <pebble.h>
GFont ubuntu18;
VibePattern short_vibe; 
VibePattern long_vibe; 

#define DEBUG 2
#define RETRY_READY_TIMEOUT 500
#define LONG_LOAD_TIMEOUT 6000
#define SHORT_VIBE() if(!quiet_time_is_active()) { vibes_enqueue_custom_pattern(short_vibe); }
#define LONG_VIBE() if(!quiet_time_is_active()) { vibes_enqueue_custom_pattern(long_vibe); }
#define MIN(a,b) (((a)<(b))?(a):(b))
#define MAX(a,b) (((a)>(b))?(a):(b))

#ifdef PBL_APLITE
#define ICON_ARRAY_SIZE 4
#define MAX_TILES 16
#else
#define ICON_ARRAY_SIZE 10
#define MAX_TILES 64
#endif
#define MAX_PERSIST_TILES 16

// Persistant keys
#define PERSIST_TILE_START 100
#define PERSIST_ICON_START 200
#define PERSIST_COLOR 1
#define PERSIST_DEFAULT_IDX 2
#define PERSIST_OPEN_DEFAULT 3


enum transferType {
  TRANSFER_TYPE_ICON = 0,
  TRANSFER_TYPE_TILE = 1,
  TRANSFER_TYPE_XHR = 2,
  TRANSFER_TYPE_COLOR = 3,
  TRANSFER_TYPE_ERROR = 4,
  TRANSFER_TYPE_ACK = 5,
  TRANSFER_TYPE_READY = 6,
  TRANSFER_TYPE_NO_CLAY = 7,
  TRANSFER_TYPE_REFRESH = 8
};

void pebblekit_connection_callback(bool connected); 
GColor8 text_color_legible_over(GColor8 bg_color);

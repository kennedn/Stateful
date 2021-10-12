#pragma once
#include <pebble.h>
GFont ubuntu18;

#define DEBUG 2
#define ICON_ARRAY_SIZE 10
#ifdef PBL_APLITE
#define ICON_ARRAY_SIZE 4
#endif
#define MAX_TILES 64


#define RETRY_READY_TIMEOUT 5000

#define SHORT_VIBE() vibes_enqueue_custom_pattern(short_vibe);
#define LONG_VIBE() vibes_enqueue_custom_pattern(long_vibe);
inline char * BOOL(bool b) {
  return b ? "true" : "false";
}
#define MIN(a,b) (((a)<(b))?(a):(b))
VibePattern short_vibe; 
VibePattern long_vibe; 

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
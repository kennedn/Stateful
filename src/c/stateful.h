#pragma once
#include <pebble.h>

#define DEBUG 3
#define debug(level, ...) \
  do { if (level <= DEBUG) APP_LOG(APP_LOG_LEVEL_DEBUG, __VA_ARGS__); } while (0)

// Data structure sizes
#ifdef PBL_APLITE
#define ICON_ARRAY_SIZE 11
#define MAX_TILES 16
#else
#define ICON_ARRAY_SIZE 16
#define MAX_TILES 64
#endif

#define MAX_PERSIST_TILES 16
#define DEFAULT_ICON_KEY "c4ca4238"
#define DEFAULT_ICON_KEY_SIZE 9

extern GFont ubuntu18;
extern VibePattern short_vibe; 
extern VibePattern long_vibe; 
extern VibePattern overflow_vibe; 

#define RETRY_READY_TIMEOUT 500
#define LONG_LOAD_TIMEOUT 6000
#define SHORT_VIBE() if(!quiet_time_is_active()) { vibes_enqueue_custom_pattern(short_vibe); }
#define LONG_VIBE() if(!quiet_time_is_active()) { vibes_enqueue_custom_pattern(long_vibe); }
#define OVERFLOW_VIBE() if(!quiet_time_is_active()) { vibes_enqueue_custom_pattern(overflow_vibe); }
#define MIN(a,b) (((a)<(b))?(a):(b))
#define MAX(a,b) (((a)>(b))?(a):(b))

// Persistant keys
#define PERSIST_TILE_START 100
#define PERSIST_ICON_START 200
#define PERSIST_COLOR 1
#define PERSIST_DEFAULT_IDX 2
#define PERSIST_OPEN_DEFAULT 3
#define PERSIST_ORIGIN_HASH 5

typedef enum {
  TRANSFER_TYPE_ICON = 0,
  TRANSFER_TYPE_TILE = 1,
  TRANSFER_TYPE_XHR = 2,
  TRANSFER_TYPE_COLOR = 3,
  TRANSFER_TYPE_ERROR = 4,
  TRANSFER_TYPE_ACK = 5,
  TRANSFER_TYPE_READY = 6,
  TRANSFER_TYPE_NO_CLAY = 7,
  TRANSFER_TYPE_REFRESH = 8
} TransferType;

bool text_color_legible_over_bg(const GColor8 *bg_color, GColor8 *text_color);

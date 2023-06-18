#pragma once
#include <pebble.h>
void comm_init();

void comm_deinit();

void comm_tile_request();
void comm_refresh_request();
void comm_icon_request(char* icon_key, uint8_t icon_index);
void comm_xhr_request(uint8_t tile_index, uint8_t button_index, uint8_t consecutive_clicks);

#ifdef PBL_PLATFORM_APLITE
    #define INBOX_SIZE 256
#else
    #define INBOX_SIZE 8200
#endif

#define OUTBOX_SIZE 64
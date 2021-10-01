#pragma once
#include <pebble.h>
void comm_init();

void comm_deinit();

void comm_icon_request(char* iconKey, uint8_t iconIndex);
void comm_tile_request();
void comm_xhr_request(void *context, uint8_t id, uint8_t button);
void comm_callback_start();

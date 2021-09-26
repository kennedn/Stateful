#pragma once
#include <pebble.h>
void comm_init();

void comm_deinit();

void comm_icon_request(char* iconKey, uint8_t iconIndex);
void comm_data_request(uint8_t transferType);
void comm_xhr_request(void *context, uint8_t id, uint8_t button);

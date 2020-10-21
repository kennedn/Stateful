#pragma once

#include <pebble.h>

void comm_init();

void comm_deinit();

void outbox(void *context, uint8_t id, uint8_t button);

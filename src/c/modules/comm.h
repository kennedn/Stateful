#pragma once
#include <pebble.h>
#ifndef HEADER_FILE
#define HEADER_FILE
#include "c/modules/data.h"
#endif
Tile tile;
void comm_init();

void comm_deinit();

void outbox(void *context, uint8_t id, uint8_t button);

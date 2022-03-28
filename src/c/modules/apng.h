#pragma once
#include <pebble.h>

void apng_start_animation();
void apng_stop_animation();
void apng_set_data(uint32_t resource_id, void (*callback_function)(GBitmap *icon));
void apng_init();
void apng_deinit();
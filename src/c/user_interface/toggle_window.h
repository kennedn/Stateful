#pragma once

#include <pebble.h>
void toggle_window_push();
void toggle_window_set_image_data(uint8_t **data, int size);
void toggle_window_set_tile_data(uint8_t **data, int size);
void toggle_window_set_color(uint8_t color);

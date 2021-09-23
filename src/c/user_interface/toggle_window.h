#pragma once

#ifndef HEADER_FILE
#define HEADER_FILE
#include "c/modules/data.h"
#endif
#include <pebble.h>
void toggle_window_push(Tile *currentTile);
void toggle_window_set_color(int type);
void toggle_window_inset_highlight(ButtonId button_id);
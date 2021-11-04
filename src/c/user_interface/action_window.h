#pragma once
#include <pebble.h>
#include "c/modules/data.h"

typedef enum {
  COLOR_ACTION_GOOD = 0,
  COLOR_ACTION_BAD = 1,
  COLOR_ACTION_ERROR = 2,
  COLOR_ACTION_VIBRATE_INIT = 3,
  COLOR_ACTION_VIBRATE_RESPONSE = 4,
  COLOR_ACTION_RESET_ONLY = 5
} ColorAction;

void action_window_push(Tile *current_tile, uint8_t index);
void action_window_pop();
void action_window_set_color(ColorAction action);
void action_window_inset_highlight(ButtonId button_id);
void action_window_refresh_icons();
extern uint8_t action_bar_tile_index;
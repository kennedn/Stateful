#pragma once
#include <pebble.h>
#include "c/modules/data.h"
void action_window_push(Tile *currentTile);
void action_window_pop();
void action_window_set_color(int type);
void action_window_inset_highlight(ButtonId button_id);
void action_window_refresh_icons();
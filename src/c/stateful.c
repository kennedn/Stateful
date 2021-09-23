#include <pebble.h>
#include "c/user_interface/toggle_window.h"
#include "c/modules/comm.h"
#ifndef HEADER_FILE
#define HEADER_FILE
#define DEBUG 1
#include "c/modules/data.h"
#endif
static Window *s_menu_window;
static MenuLayer *s_menu_layer;

static uint16_t get_num_rows_callback(MenuLayer *menu_layer, uint16_t section_index, void *context) {
  if (tileArray) {
  return tileArray->used;
  } else {
    return 0;
  }
}

static void draw_row_callback(GContext *ctx, const Layer *cell_layer, MenuIndex *cell_index, void *context) {
  if (tileArray->used > 0) {
    menu_cell_basic_draw(ctx, cell_layer, tileArray->tiles[cell_index->row].texts[6], NULL,tileArray->tiles[cell_index->row].icons[6]);
  }
}

static void select_callback(struct MenuLayer *menu_layer, MenuIndex *cell_index, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Entered select_callback");
  if (tileArray->used > 0) {
    toggle_window_push(&(tileArray->tiles[cell_index->row]));
  }
}

static void selection_changed_callback(struct MenuLayer *menu_layer, MenuIndex cell_index, MenuIndex cell_old_index, void *context) {
  if (tileArray->used > 0) {
    menu_layer_set_highlight_colors(menu_layer, tileArray->tiles[cell_index.row].color, GColorWhite);
    menu_layer_set_normal_colors(menu_layer,tileArray->tiles[cell_index.row].highlight, GColorWhite);
  }
}

static int16_t get_cell_height_callback(struct MenuLayer *menu_layer, MenuIndex *cell_index, void *context) {
  return PBL_IF_ROUND_ELSE(
    menu_layer_is_index_selected(menu_layer, cell_index) ?
      MENU_CELL_ROUND_FOCUSED_SHORT_CELL_HEIGHT : MENU_CELL_ROUND_UNFOCUSED_TALL_CELL_HEIGHT,
    36);
}


static void window_load(Window *window) {
  return;
}

static void window_unload(Window *window) {
  menu_layer_destroy(s_menu_layer);
}

void stateful_reinit_list() {
  Layer *window_layer = window_get_root_layer(s_menu_window);
  GRect bounds = layer_get_bounds(window_layer);

  s_menu_layer = menu_layer_create(bounds);
  menu_layer_set_click_config_onto_window(s_menu_layer, s_menu_window);
  //menu_layer_set_selected_index(s_menu_layer, (MenuIndex) {.section = 0, .row = 0}, MenuRowAlignTop, true);
  if (tileArray->used > 0) {
    menu_layer_set_highlight_colors(s_menu_layer, tileArray->tiles[0].color, GColorWhite);
    menu_layer_set_normal_colors(s_menu_layer,tileArray->tiles[0].highlight, GColorWhite);
  }
  menu_layer_set_callbacks(s_menu_layer, NULL, (MenuLayerCallbacks) {
      .get_num_rows = get_num_rows_callback,
      .draw_row = draw_row_callback,
      .get_cell_height = get_cell_height_callback,
      .select_click = select_callback,
      .selection_changed = selection_changed_callback,
  });
  layer_add_child(window_layer, menu_layer_get_layer(s_menu_layer));
  layer_mark_dirty(menu_layer_get_layer(s_menu_layer));
  toggle_window_push(&(tileArray->tiles[0]));
}

static void init() {
  comm_init();
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Free bytes: %d", heap_bytes_free());
  s_menu_window = window_create();
  window_set_window_handlers(s_menu_window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload
  });
  window_stack_push(s_menu_window, true);
  //toggle_window_push();
}

static void deinit() { 
 comm_deinit();
}

int main() {
  init();
  app_event_loop();
  deinit();
}

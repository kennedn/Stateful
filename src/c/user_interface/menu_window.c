#include <pebble.h>
#include "c/user_interface/action_window.h"
#include "c/modules/comm.h"
#define CELL_HEIGHT 36;

static Window *s_action_window;
static MenuLayer *s_menu_layer;

static bool is_row_onscreen(MenuLayer *menu_layer, const Layer *cell_layer, MenuIndex *cell_index) {
  GRect frame = layer_get_bounds(menu_layer_get_layer(menu_layer));
  GRect cell_frame = layer_get_frame(cell_layer);
  GPoint offset = scroll_layer_get_content_offset(menu_layer_get_scroll_layer(menu_layer));
  // MenuIndex selected_cell = menu_layer_get_selected_index(menu_layer);
  // int16_t offset = selected_cell.row * CELL_HEIGHT;
  int16_t cell_top =  cell_frame.origin.y - offset.y;
  int16_t cell_bottom = cell_frame.origin.y + cell_frame.size.h - offset.y;
  int16_t window_top = frame.origin.y;
  int16_t window_bottom = frame.origin.y + frame.size.h;
  APP_LOG(APP_LOG_LEVEL_DEBUG, "index: %d, offset: %d, cell_top: %d, cell_bottom: %d, window_top: %d, window_bottom: %d",
          cell_index->row, offset.y,  cell_top, cell_bottom, window_top, window_bottom);
  if (cell_bottom > window_top && cell_top < window_bottom) {
    return true;
  } 
  return false;
}

static uint16_t get_num_rows_callback(MenuLayer *menu_layer, uint16_t section_index, void *context) {
  if (tileArray) {
  return tileArray->used;
  } else {
    return 0;
  }
}

static void draw_row_callback(GContext *ctx, const Layer *cell_layer, MenuIndex *cell_index, void *context) {
  if (tileArray) {
    Tile *tile = &tileArray->tiles[cell_index->row];
    menu_cell_basic_draw(ctx, cell_layer, tile->texts[6], NULL,data_icon_array_search(tile->icon_key[6]));
  }
}

static void select_callback(struct MenuLayer *menu_layer, MenuIndex *cell_index, void *context) {
  if (tileArray) {
    action_window_push(&(tileArray->tiles[cell_index->row]));
  }
}

static void selection_changed_callback(struct MenuLayer *menu_layer, MenuIndex cell_index, MenuIndex cell_old_index, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Free bytes: %d", heap_bytes_free());
  if (tileArray) {
    Tile *tile = &tileArray->tiles[cell_index.row];
    menu_layer_set_highlight_colors(menu_layer, tile->color, GColorWhite);
    menu_layer_set_normal_colors(menu_layer, tile->highlight, GColorWhite);
    layer_mark_dirty(menu_layer_get_layer(menu_layer));
  }
}

static int16_t get_cell_height_callback(struct MenuLayer *menu_layer, MenuIndex *cell_index, void *context) {
  // return PBL_IF_ROUND_ELSE(
  //   menu_layer_is_index_selected(menu_layer, cell_index) ?
  //     MENU_CELL_ROUND_FOCUSED_SHORT_CELL_HEIGHT : MENU_CELL_ROUND_UNFOCUSED_TALL_CELL_HEIGHT,
  //   36);
  return CELL_HEIGHT;
}


static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(s_action_window);
  GRect bounds = layer_get_bounds(window_layer);

  s_menu_layer = menu_layer_create(bounds);
  menu_layer_set_click_config_onto_window(s_menu_layer, s_action_window);
  //menu_layer_set_selected_index(s_menu_layer, (MenuIndex) {.section = 0, .row = 0}, MenuRowAlignTop, true);
  menu_layer_set_callbacks(s_menu_layer, NULL, (MenuLayerCallbacks) {
      .get_num_rows = get_num_rows_callback,
      .draw_row = draw_row_callback,
      .get_cell_height = get_cell_height_callback,
      .select_click = select_callback,
      .selection_changed = selection_changed_callback,
  });

  Layer *menu_layer_root = menu_layer_get_layer(s_menu_layer);

  if (tileArray) {
    Tile *default_tile = &(tileArray->tiles[tileArray->default_idx]);
    persist_write_data(0, &(default_tile->color), sizeof(GColor8));
    menu_layer_set_highlight_colors(s_menu_layer, default_tile->color, GColorWhite);
    menu_layer_set_normal_colors(s_menu_layer, default_tile->highlight, GColorWhite);
    menu_layer_set_selected_index(s_menu_layer, (MenuIndex) {.section = 0, .row = tileArray->default_idx}, MenuRowAlignCenter, false);
    if (tileArray->open_default) { action_window_push(default_tile); }
  }

  layer_add_child(window_layer, menu_layer_root);
}

static void window_unload(Window *window) {
  menu_layer_destroy(s_menu_layer);
}

static void window_appear(Window *window) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Free bytes: %d", heap_bytes_free());
}

void menu_window_refresh_icons() {
  if (window_stack_get_top_window() == s_action_window) {
    layer_mark_dirty(menu_layer_get_layer(s_menu_layer));
  }
}

void menu_window_push() {
  s_action_window = window_create();
  window_set_background_color(s_action_window, GColorBlack);
  window_set_window_handlers(s_action_window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
    .appear = window_appear
  });
  window_stack_push(s_action_window, true);
}


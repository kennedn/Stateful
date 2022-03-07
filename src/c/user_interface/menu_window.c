#include <pebble.h>
#include "c/user_interface/action_window.h"
#include "c/modules/comm.h"
#include "c/stateful.h"
#include "c/user_interface/loading_window.h"
#define CELL_HEIGHT ((const int16_t) 40)

static Window *s_menu_window;
static MenuLayer *s_menu_layer;

//! Refreshes all icons if current window is visible, used when icon_array is modified
void menu_window_refresh_icons() {
  if (s_menu_layer && window_stack_get_top_window() == s_menu_window) {
    layer_mark_dirty(menu_layer_get_layer(s_menu_layer));
  }
}

static uint16_t get_num_rows_callback(MenuLayer *menu_layer, uint16_t section_index, void *context) {
  if (tile_array) {
  return tile_array->used;
  } else {
    return 0;
  }
}

static int16_t get_cell_height_callback(struct MenuLayer *menu_layer, MenuIndex *cell_index, void *context) {
    return PBL_IF_ROUND_ELSE(menu_layer_is_index_selected(menu_layer, cell_index) ?
                             MENU_CELL_ROUND_FOCUSED_SHORT_CELL_HEIGHT : MENU_CELL_ROUND_UNFOCUSED_TALL_CELL_HEIGHT,
                             CELL_HEIGHT);
}

//! Custom row draw callback, closely simulates menu_cell_basic_draw but allows for custom font
//! @param ctx The destination graphics context to draw into
//! @param cell_layer The cell's layer, containing the geometry of the cell
//! @param cell_index The MenuIndex of the cell that needs to be drawn
//! @param callback_context The callback context
static void draw_row_callback(GContext *ctx, const Layer *cell_layer, MenuIndex *cell_index, void *context) {
  if (tile_array) {
    Tile *tile = tile_array->tiles[cell_index->row];
    GBitmap *icon = data_icon_array_search(tile->icon_key[6]);
    GRect icon_bounds = gbitmap_get_bounds(icon);
    GRect bounds =  layer_get_bounds(cell_layer);
    bounds.origin.x = PBL_IF_RECT_ELSE(bounds.origin.x, CELL_HEIGHT / 2);
    bounds.size.w = CELL_HEIGHT;
    bounds.size.w *= 0.8f;
    grect_align(&icon_bounds, &bounds, GAlignCenter, true);
    graphics_context_set_compositing_mode(ctx, GCompOpSet);
    graphics_draw_bitmap_in_rect(ctx, data_icon_array_search(tile->icon_key[6]), icon_bounds);
    bounds =  layer_get_bounds(cell_layer);
    bounds.origin.x = PBL_IF_RECT_ELSE(CELL_HEIGHT *.9, CELL_HEIGHT * 1.5);
    bounds.size.w = bounds.size.w - CELL_HEIGHT; 
    GSize text_size = GSize(0, 24);
    GRect text_rect = GRect(bounds.origin.x, (bounds.size.h - text_size.h) /2, bounds.size.w, text_size.h);

    graphics_draw_text(ctx, tile->texts[6], ubuntu18, text_rect, GTextOverflowModeTrailingEllipsis, GTextAlignmentLeft, NULL);

  }
}

//! Drives colour changes based on current selected tile
//! @param menu_layer The \ref MenuLayer for which the selection event occurred
//! @param new_index The MenuIndex of the new item that is selected now
//! @param old_index The MenuIndex of the old item that was selected before
//! @param callback_context The callback context
static void selection_changed_callback(struct MenuLayer *menu_layer, MenuIndex cell_index, MenuIndex cell_old_index, void *context) {
  if (tile_array) {
    Tile *tile = tile_array->tiles[cell_index.row];
    GColor8 text_color;
    text_color_legible_over_bg(&(tile->color), &text_color);
    menu_layer_set_highlight_colors(s_menu_layer, tile->color, text_color);
    text_color_legible_over_bg(&(tile->highlight), &text_color);
    menu_layer_set_normal_colors(s_menu_layer, tile->highlight, text_color);
    layer_mark_dirty(menu_layer_get_layer(menu_layer));
  }
}


//! Creates a new action window if open_default is set in tile_array
//! @param data A pointer to any passed user data
static void open_default(void *data) {
  if (tile_array && tile_array->open_default) { 
    Tile *default_tile = tile_array->tiles[tile_array->default_idx];
    action_window_push(default_tile, tile_array->default_idx); 
   } 
}


//! Selection button callback, creates a new action window based on current row
//! @param recognizer The click recognizer that detected a "click" pattern
//! @param context Pointer to application specified data
static void select_callback(ClickRecognizerRef ref, void *ctx) {
  if (tile_array) {
    uint8_t selected_row = menu_layer_get_selected_index(s_menu_layer).row;
    action_window_push(tile_array->tiles[selected_row], selected_row);
  }
}

//! Up button callback, Moves up one row in the menu list, wraps around to bottom of list
//! @param recognizer The click recognizer that detected a "click" pattern
//! @param context Pointer to application specified data
static void up_callback(ClickRecognizerRef ref, void *ctx){
  if (!tile_array) { return; }
  if (menu_layer_get_selected_index(s_menu_layer).row == 0) {
    menu_layer_set_selected_index(s_menu_layer,(MenuIndex) {.row = tile_array->used - 1, .section = 0}, MenuRowAlignCenter, true);
  } else {
    menu_layer_set_selected_next(s_menu_layer, true, MenuRowAlignCenter, true);
  }
}

//! Down button callback, Moves down one row in the menu list, wraps around to top of list
//! @param recognizer The click recognizer that detected a "click" pattern
//! @param context Pointer to application specified data
static void down_callback(ClickRecognizerRef ref, void *ctx){
  if (!tile_array) { return; }
  if (menu_layer_get_selected_index(s_menu_layer).row == tile_array->used - 1) {
    menu_layer_set_selected_index(s_menu_layer,(MenuIndex) {.row = 0, .section = 0}, MenuRowAlignCenter, true);
  } else {
    menu_layer_set_selected_next(s_menu_layer, false, MenuRowAlignCenter, true);
  }
}


static void click_config_handler(void *ctx) {
  // scroll_layer_set_click_config_onto_window(menu_layer_get_scroll_layer(s_menu_layer), s_menu_window);
  window_single_repeating_click_subscribe(BUTTON_ID_UP, 200, up_callback);
  window_single_repeating_click_subscribe(BUTTON_ID_DOWN, 200, down_callback);
  window_single_click_subscribe(BUTTON_ID_SELECT, select_callback);
}

static void menu_window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(s_menu_window);
  GRect bounds = layer_get_bounds(window_layer);

  s_menu_layer = menu_layer_create(bounds);
  menu_layer_pad_bottom_enable(s_menu_layer, false);
  window_set_click_config_provider(s_menu_window, (ClickConfigProvider) click_config_handler);
  menu_layer_set_callbacks(s_menu_layer, NULL, (MenuLayerCallbacks) {
      .get_num_rows = get_num_rows_callback,
      .draw_row = draw_row_callback,
      .get_cell_height = get_cell_height_callback,
      .selection_changed = selection_changed_callback,
  });

  Layer *menu_layer_root = menu_layer_get_layer(s_menu_layer);
  if (tile_array) {
    Tile *default_tile = tile_array->tiles[tile_array->default_idx];
    persist_write_data(PERSIST_COLOR, &(default_tile->color), sizeof(GColor8));
    GColor8 text_color;
    text_color_legible_over_bg(&(default_tile->color), &text_color);
    menu_layer_set_highlight_colors(s_menu_layer, default_tile->color, text_color);
    text_color_legible_over_bg(&(default_tile->highlight), &text_color);
    menu_layer_set_normal_colors(s_menu_layer, default_tile->highlight, text_color);
    menu_layer_set_selected_index(s_menu_layer, (MenuIndex) {.section = 0, .row = tile_array->default_idx}, MenuRowAlignCenter, false);
    layer_add_child(window_layer, menu_layer_root);
    // Pushing nested windows to stack too quickly causes undocumented behaviour in the SDK. 
    // Using app_timer_register delays enough to work around this. 
    app_timer_register(0, open_default, NULL); 
  }

}

static void menu_window_unload(Window *window) {
  if (s_menu_window) {
    menu_layer_destroy(s_menu_layer);
    s_menu_layer = NULL;
    window_destroy(s_menu_window);
    s_menu_window = NULL;
  }
}

void menu_window_push() {
  if (!s_menu_window) {
    s_menu_window = window_create();
    window_set_background_color(s_menu_window, GColorBlack);
    window_set_window_handlers(s_menu_window, (WindowHandlers) {
      .load = menu_window_load,
      .unload = menu_window_unload,
    });
    window_stack_push(s_menu_window, true);
  }
}


#include <pebble.h>
#include "c/user_interface/action_window.h"
#include "c/modules/comm.h"
#include "c/stateful.h"
#include "c/user_interface/loading_window.h"
#define CELL_HEIGHT ((const int16_t) 36)

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
  if (tileArray) {
    Tile *tile = tileArray->tiles[cell_index->row];
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


static void selection_changed_callback(struct MenuLayer *menu_layer, MenuIndex cell_index, MenuIndex cell_old_index, void *context) {
  if (tileArray) {
    Tile *tile = tileArray->tiles[cell_index.row];
    menu_layer_set_highlight_colors(s_menu_layer, tile->color, GColorWhite);
    menu_layer_set_normal_colors(s_menu_layer, tile->highlight,PBL_IF_COLOR_ELSE(GColorWhite, GColorBlack));
    layer_mark_dirty(menu_layer_get_layer(menu_layer));
  }
}

static int16_t get_cell_height_callback(struct MenuLayer *menu_layer, MenuIndex *cell_index, void *context) {
    return PBL_IF_ROUND_ELSE(menu_layer_is_index_selected(menu_layer, cell_index) ?
                             MENU_CELL_ROUND_FOCUSED_SHORT_CELL_HEIGHT : MENU_CELL_ROUND_UNFOCUSED_TALL_CELL_HEIGHT,
                             CELL_HEIGHT);
}

static void open_default(void *data) {
  if (tileArray && tileArray->open_default) { 
    Tile *default_tile = tileArray->tiles[tileArray->default_idx];
    action_window_push(default_tile, tileArray->default_idx); 
   } 
}

static void select_callback(ClickRecognizerRef ref, void *ctx) {
  if (tileArray) {
    uint8_t selected_row = menu_layer_get_selected_index(s_menu_layer).row;
    action_window_push(tileArray->tiles[selected_row], selected_row);
  }
}

static void up_callback(ClickRecognizerRef ref, void *ctx){
  if (!tileArray) { return; }
  if (menu_layer_get_selected_index(s_menu_layer).row == 0) {
    menu_layer_set_selected_index(s_menu_layer,(MenuIndex) {.row = tileArray->used - 1, .section = 0},MenuRowAlignCenter, true);
  } else {
    menu_layer_set_selected_next(s_menu_layer, true, MenuRowAlignCenter, true);
  }
}

static void down_callback(ClickRecognizerRef ref, void *ctx){
  if (!tileArray) { return; }
  if (menu_layer_get_selected_index(s_menu_layer).row == tileArray->used - 1) {
    menu_layer_set_selected_index(s_menu_layer,(MenuIndex) {.row = 0, .section = 0},MenuRowAlignCenter, true);
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
  // menu_layer_set_click_config_onto_window(s_menu_layer, s_menu_window);
  window_set_click_config_provider(s_menu_window, (ClickConfigProvider) click_config_handler);
  //menu_layer_set_selected_index(s_menu_layer, (MenuIndex) {.section = 0, .row = 0}, MenuRowAlignTop, true);
  menu_layer_set_callbacks(s_menu_layer, NULL, (MenuLayerCallbacks) {
      .get_num_rows = get_num_rows_callback,
      .draw_row = draw_row_callback,
      .get_cell_height = get_cell_height_callback,
      .selection_changed = selection_changed_callback,
  });

  Layer *menu_layer_root = menu_layer_get_layer(s_menu_layer);

  if (tileArray) {
    Tile *default_tile = tileArray->tiles[tileArray->default_idx];
    persist_write_data(0, &(default_tile->color), sizeof(GColor8));
    menu_layer_set_highlight_colors(s_menu_layer, default_tile->color, GColorWhite);
    menu_layer_set_normal_colors(s_menu_layer, default_tile->highlight,PBL_IF_COLOR_ELSE(GColorWhite, GColorBlack));
    menu_layer_set_selected_index(s_menu_layer, (MenuIndex) {.section = 0, .row = tileArray->default_idx}, MenuRowAlignCenter, false);
    layer_add_child(window_layer, menu_layer_root);
    // workaround to delay secondary tile window push as SDK does not set up callbacks correctly if window is init'd directly
    app_timer_register(0, open_default, NULL); 
  }

}

static void menu_window_unload(Window *window) {
  if (s_menu_window) {
    menu_layer_destroy(s_menu_layer);
    window_destroy(s_menu_window);
    s_menu_window = NULL;
  }
}

void menu_window_refresh_icons() {
  if (window_stack_get_top_window() == s_menu_window) {
    layer_mark_dirty(menu_layer_get_layer(s_menu_layer));
  }
}
void menu_window_pop() {
  window_stack_remove(s_menu_window, false);
  menu_window_unload(s_menu_window);
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


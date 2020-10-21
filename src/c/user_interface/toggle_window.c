#include <pebble.h>

#include "c/user_interface/toggle_window.h"
#ifndef HEADER_FILE
#define HEADER_FILE
#include "c/modules/data.h"
#include "c/modules/comm.h"
#endif
static Window *window;

static int window_width, window_height;

Layer *bg_layer, *heading_layer, *sidebar_layer, *icon_layer;

static uint8_t x_pad, y_pad;

GFont ubuntu18, ubuntu10;
GBitmap *icon;
GColor colors[2][2];
char title[32];
int color;


typedef enum {
    GOOD,
    BAD
} Colorset;

typedef enum {
    MAIN,
    HIGHLIGHT
} Color;

static void bg_layer_callback(Layer *layer, GContext *ctx) {
    GRect bounds = layer_get_bounds(layer);
    graphics_context_set_fill_color(ctx, colors[color][0]);
    graphics_fill_rect(ctx, bounds, 0, 0);

    #if DEBUG == 1
        graphics_context_set_stroke_color(ctx, colors[!color][0]);
        graphics_draw_rect(ctx, bounds);
    #endif
}
static void sidebar_layer_callback(Layer *layer, GContext *ctx) {
    GRect bounds = layer_get_bounds(layer);
    graphics_context_set_fill_color(ctx, colors[color][HIGHLIGHT]);

    graphics_fill_rect(ctx, bounds, 0, 0);

    // Draw 3 dots in a vertical row with a dots worth of spacing in between each
    graphics_context_set_fill_color(ctx, GColorWhite);
    for(int i=-1; i <= 1; i++) {
        uint8_t size = bounds.size.w / 2;
        graphics_fill_rect(ctx, GRect(bounds.size.w / 4, bounds.size.h / 2 + size * i * 2, size, size), 0, 0);
    }

    #if DEBUG == 1
        graphics_context_set_stroke_color(ctx, colors[!color][0]);
        //graphics_draw_rect(ctx, bounds);
    #endif
}
static void heading_layer_callback(Layer *layer, GContext *ctx) {
    GRect bounds = layer_get_bounds(layer);
    uint8_t stroke_width = 1;
    graphics_context_set_stroke_width(ctx, stroke_width);
    graphics_context_set_stroke_color(ctx, GColorWhite);
    graphics_context_set_fill_color(ctx, GColorWhite);

    graphics_draw_line(ctx, GPoint(0, bounds.size.h - stroke_width), GPoint(bounds.size.w, bounds.size.h - stroke_width));


    graphics_draw_text(ctx, title, ubuntu18,\
                       GRect(x_pad / 2, 0, bounds.size.w, bounds.size.h),\
                       GTextOverflowModeTrailingEllipsis, GTextAlignmentLeft, NULL);
    graphics_draw_text(ctx, "1/5", ubuntu10,\
                       GRect(0, y_pad / 2, bounds.size.w - x_pad / 2, bounds.size.h),\
                       GTextOverflowModeTrailingEllipsis, GTextAlignmentRight, NULL);

    #if DEBUG == 1
        graphics_context_set_stroke_color(ctx, colors[!color][0]);
        graphics_draw_rect(ctx, bounds);
    #endif
}
static void icon_layer_callback(Layer *layer, GContext *ctx) {
    GRect bounds = layer_get_bounds(layer);
    GRect icon_bounds = gbitmap_get_bounds(icon);

    grect_align(&icon_bounds, &bounds, GAlignCenter, true);
    graphics_context_set_compositing_mode(ctx, GCompOpSet);

    graphics_draw_bitmap_in_rect(ctx, icon, icon_bounds);

    #if DEBUG == 1
        graphics_context_set_stroke_color(ctx, colors[!color][0]);
        graphics_draw_rect(ctx, icon_bounds);
        graphics_draw_rect(ctx, bounds);
    #endif
}

static void up_click_callback(ClickRecognizerRef recognizer, void *ctx) {
    outbox(ctx, 0, 0);
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Up clicked!");
}
static void select_click_callback(ClickRecognizerRef recognizer, void *ctx) {
    outbox(ctx, 0, 1);
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Up clicked!");
}
static void down_click_callback(ClickRecognizerRef recognizer, void *ctx) {
    outbox(ctx, 0, 2);
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Down clicked!");
}

static void click_config_provider(Window *window) {
    window_single_click_subscribe(BUTTON_ID_UP, up_click_callback);
    window_single_click_subscribe(BUTTON_ID_SELECT, select_click_callback);
    window_single_click_subscribe(BUTTON_ID_DOWN, down_click_callback);
}


static void window_load(Window *window) {

    window_set_background_color(window, GColorBlack);
    Layer * window_layer = window_get_root_layer(window);
    
    GRect bounds = layer_get_bounds(window_layer);
    window_width = bounds.size.w;
    window_height = bounds.size.h;


    x_pad = window_width / 20;  // 5%
    y_pad = window_height / 12; // 8%
    
    bg_layer = layer_create(bounds);
    heading_layer = layer_create(GRect(x_pad, y_pad, window_width - x_pad * 3, 25));
    sidebar_layer = layer_create(GRect(window_width - x_pad, 0, x_pad, window_height));
    icon_layer = layer_create(GRect(x_pad, y_pad * 2, window_width - x_pad * 3, window_height - y_pad * 2));


    layer_set_update_proc(bg_layer, bg_layer_callback);
    layer_set_update_proc(heading_layer, heading_layer_callback);
    layer_set_update_proc(sidebar_layer, sidebar_layer_callback);
    layer_set_update_proc(icon_layer, icon_layer_callback);


    // bitmap_layer_set_alignment(icon_layer, GAlignCenter);
    // bitmap_layer_set_compositing_mode(icon_layer, GCompOpSet);
    // bitmap_layer_set_bitmap(icon_layer, icon);

    layer_add_child(window_layer, bg_layer);
    layer_add_child(window_layer, heading_layer);
    layer_add_child(window_layer, sidebar_layer);
    layer_add_child(window_layer, icon_layer);

}

static void window_unload(Window *window) {

    fonts_unload_custom_font(ubuntu18);
    fonts_unload_custom_font(ubuntu10);

    free(icon);

    app_message_deregister_callbacks();

    window_destroy(window);
}


void toggle_window_push(void) {
    window = window_create();
    window_set_window_handlers(window, (WindowHandlers) {
        .load = window_load,
        .unload = window_unload,
    });
    window_set_click_config_provider(window, (ClickConfigProvider)click_config_provider);


    //app_message_register_inbox_received(inbox);
    //app_message_open(128,128);

    ubuntu18 = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_UBUNTU_BOLD_18));
    ubuntu10 = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_UBUNTU_BOLD_10));
    icon = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_DEFAULT);

    // colors[GOOD][MAIN] = GColorIslamicGreen;
    // colors[GOOD][HIGHLIGHT] = GColorMayGreen;
    // colors[BAD][MAIN] = GColorFolly;
    // colors[BAD][HIGHLIGHT] = GColorSunsetOrange;
    colors[GOOD][MAIN] = GColorBlack;
    colors[GOOD][HIGHLIGHT] = GColorBlack;
    colors[BAD][MAIN] = GColorBlack;
    colors[BAD][HIGHLIGHT] = GColorBlack;
    color = 0; //!persist_read_int(ENDPOINT_STATE);

    window_stack_push(window, true);

}


// static void window_load(Window *window) {
//   Layer *root_layer = window_get_root_layer(window);
//   GRect bounds = GRect(0,0,75,75);//layer_get_bounds(root_layer);

//   s_bitmap_layer = bitmap_layer_create(bounds);
//   Layer *bitmap_root_layer = bitmap_layer_get_layer(s_bitmap_layer);
//   bitmap_layer_set_compositing_mode(s_bitmap_layer, GCompOpSet);

//   loading_layer_load(bitmap_root_layer);
//   start_loading_animation();

//   layer_add_child(root_layer, bitmap_layer_get_layer(s_bitmap_layer));
// // }

// static void window_unload(Window *window) {
//   bitmap_layer_destroy(s_bitmap_layer);
//   loading_layer_unload();
//   if(s_bitmap) {
//     gbitmap_destroy(s_bitmap);
//   }
//   layer_destroy(heading_layer);
//   window_destroy(window);
// }

// void toggle_window_push() {
//   s_window = window_create();
//   window_set_background_color(s_window, GColorIslamicGreen);
//   window_set_window_handlers(s_window, (WindowHandlers) {
//     .load = window_load,
//     .unload = window_unload,
//   });
//   window_stack_push(s_window, true);
// }

void toggle_window_set_image_data(uint8_t **data, int size) {
  //stop_loading_animation();
  if(icon) {
    gbitmap_destroy(icon);
  }

  // Create new GBitmap from downloaded PNG data
  icon = gbitmap_create_from_png_data(*data, size);

  if(icon) {
    //bitmap_layer_set_bitmap(s_bitmap_layer, s_bitmap);
    layer_mark_dirty(icon_layer);
  } else {
    APP_LOG(APP_LOG_LEVEL_ERROR, "Error creating GBitmap from PNG data!");
  }
}

void toggle_window_set_tile_data(uint8_t **data, int size)  {
  Tile *tile = (Tile*) *data;
  strncpy(title, tile->title, sizeof(title));
  layer_mark_dirty(heading_layer);
  colors[GOOD][MAIN] = (GColor8)tile->color_good;
  colors[GOOD][HIGHLIGHT] = (GColor8)tile->color_good_hi;
  colors[BAD][MAIN] = (GColor8)tile->color_bad;
  colors[BAD][HIGHLIGHT] = (GColor8)tile->color_bad_hi;
  layer_mark_dirty(bg_layer);
}
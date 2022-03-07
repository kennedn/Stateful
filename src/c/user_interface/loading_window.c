#include <pebble.h>
#include "c/user_interface/loading_window.h"
#include "c/modules/comm.h"
#include "c/modules/apng.h"
#include "c/stateful.h"

static BitmapLayer *s_loading_bitmap_layer;
static AppTimer *s_timeout_timer, *s_text_timer;
static Window *s_window;
static TextLayer *s_text_layer;
static uint8_t s_text_counter;
static char *s_custom_text;
static GColor8 s_bg_color, s_text_color;

//! apng module callback, assigns animation data to bitmap layer every frame
//! @param icon A bitmap image representing a frame in an ongoing animation
static void loading_layer_set_icon(GBitmap *icon) {
    bitmap_layer_set_bitmap(s_loading_bitmap_layer, icon);
    layer_mark_dirty(bitmap_layer_get_layer(s_loading_bitmap_layer));
}

//! apng helper function, stop currently playing animation and hide bitmap layer
static void loading_window_stop_animation() {
  apng_stop_animation();
  #ifdef PBL_COLOR
  if (s_loading_bitmap_layer) { layer_set_hidden(bitmap_layer_get_layer(s_loading_bitmap_layer), true); }
  #endif
}

//! Fallback function where apng is not supported (B/W), drives a simple text based animation
static void text_callback(void *data) {
  switch(s_text_counter) {
    case 0:
      text_layer_set_text(s_text_layer, "Loading");
      break;
    case 1:
      text_layer_set_text(s_text_layer, "Loading.");
      break;
    case 2:
      text_layer_set_text(s_text_layer, "Loading..");
      break;
    case 3:
      text_layer_set_text(s_text_layer, "Loading...");
      break;

  }
  layer_mark_dirty(text_layer_get_layer(s_text_layer));
  s_text_counter = (s_text_counter + 1 ) % 4;
  s_text_timer = app_timer_register(150, text_callback, NULL);
}

//! Builds a text layer and optionally kicks off a text_animation
//! @param text A string to display
//! @param window_layer The parent window to attach to
//! @param bounds The location to draw the text layer
//! @param hidden The visibility state of the layer
//! @param text_animation Start a text based animation
static void setup_text_layer(char *text, Layer* window_layer, GRect bounds, bool hidden, bool text_animation) {
    GSize text_size = graphics_text_layout_get_content_size(text, ubuntu18, bounds, GTextOverflowModeWordWrap, GTextAlignmentLeft);
    GRect text_bounds = GRect(bounds.origin.x + ((bounds.size.w - text_size.w) / 2), bounds.origin.y + ((bounds.size.h - text_size.h) / 2),
                              text_size.w, bounds.size.h);
    s_text_layer = text_layer_create(text_bounds);
    text_layer_set_text_color(s_text_layer, s_text_color);
    text_layer_set_background_color(s_text_layer, PBL_IF_BW_ELSE(GColorBlack, GColorClear));
    text_layer_set_overflow_mode(s_text_layer, GTextOverflowModeWordWrap);
    text_layer_set_font(s_text_layer, ubuntu18);
    text_layer_set_text(s_text_layer, text);
    text_layer_set_text_alignment(s_text_layer,GTextAlignmentLeft);
    Layer * text_layer_root = text_layer_get_layer(s_text_layer);
    layer_set_hidden(text_layer_root, hidden);
    layer_add_child(window_layer, text_layer_root);

    if (text_animation) { s_text_timer = app_timer_register(150, text_callback, NULL); }
}

//! Callback function that unhides text layer
//! @param data Any user provided data
static void text_layer_unhide(void *data) {
  s_timeout_timer = NULL;
  layer_set_hidden(text_layer_get_layer(s_text_layer), false);
}

//! Builds and displays a loading animation and/or a text based message
static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);
  s_loading_bitmap_layer = NULL;
  s_text_layer = NULL;
  s_text_timer = NULL;
  s_timeout_timer = NULL;
  s_text_counter = 0;
  bool bg_exceeds_threshold = text_color_legible_over_bg(&s_bg_color, &s_text_color);
  if (s_custom_text) {
    setup_text_layer(s_custom_text, window_layer, bounds, false, false);
    return;
  }
  #ifdef PBL_BW
    setup_text_layer("Loading...", window_layer, bounds, false, true);
    return;
  #endif 

  s_loading_bitmap_layer = bitmap_layer_create(bounds);
  bitmap_layer_set_alignment(s_loading_bitmap_layer, GAlignCenter);
  bitmap_layer_set_compositing_mode(s_loading_bitmap_layer, GCompOpSet);
  layer_add_child(window_layer, bitmap_layer_get_layer(s_loading_bitmap_layer));
  apng_set_data((bg_exceeds_threshold) ? RESOURCE_ID_LOADING_ANIMATION_BLACK : RESOURCE_ID_LOADING_ANIMATION, &loading_layer_set_icon);
  apng_start_animation();
  bounds.origin.y = bounds.size.h *.7;
  bounds.size.h = bounds.size.h *.25;
  char *texts[] = {"hmm...", "um...", "maybe...", "(;-_-)", "(¬_¬)"};
  setup_text_layer(texts[rand() % ARRAY_LENGTH(texts)], window_layer, bounds, true, false); 
  s_timeout_timer = app_timer_register(LONG_LOAD_TIMEOUT, text_layer_unhide, NULL);

}

void window_unload(Window *window) {
  if(s_window) {
    apng_stop_animation();
    if (s_text_layer) { text_layer_destroy(s_text_layer); }
    if (s_loading_bitmap_layer) { bitmap_layer_destroy(s_loading_bitmap_layer); }
    if (s_timeout_timer) { app_timer_cancel(s_timeout_timer); s_timeout_timer = NULL;}
    if (s_text_timer) { app_timer_cancel(s_text_timer); s_text_timer = NULL;}
    loading_window_stop_animation();
    window_destroy(s_window);
    s_window = NULL;
    s_custom_text = NULL;
  }
}

static void window_disappear(Window *window) {
  if(s_window) {
    window_stack_remove(window, false);
  }
}

void loading_window_push(char *text) {
  if(!s_window) {
    s_custom_text = text;
    s_window = window_create();
    s_bg_color = GColorBlack;
    #ifdef PBL_COLOR
      srand(time(0));
      if(persist_read_data(PERSIST_COLOR, &s_bg_color, sizeof(GColor8)) == E_DOES_NOT_EXIST) {
        GColor8 colors[] = {GColorCobaltBlue, GColorIslamicGreen, GColorImperialPurple, GColorFolly, GColorChromeYellow};
        s_bg_color = colors[rand() % ARRAY_LENGTH(colors)]; 
      }
    #endif
    window_set_background_color(s_window, s_bg_color);
    window_set_window_handlers(s_window, (WindowHandlers) {
      .load = window_load,
      .disappear = window_disappear,
      .unload = window_unload
    });
    window_stack_push(s_window, true);
  }
}




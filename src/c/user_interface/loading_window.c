#include <pebble.h>
#include "c/user_interface/loading_window.h"
#include "c/modules/comm.h"
#include "c/modules/apng.h"
#include "c/stateful.h"

static BitmapLayer *loading_bitmap_layer;
static AppTimer *timeout_timer, *text_timer;
static Window *s_window;
static TextLayer *s_text_layer;
static uint8_t text_counter = 0;
static char *custom_text = NULL;

GColor8 bg_color;

static void loading_layer_set_icon(GBitmap *icon) {
    bitmap_layer_set_bitmap(loading_bitmap_layer, icon);
    layer_mark_dirty(bitmap_layer_get_layer(loading_bitmap_layer));
}


static void loading_window_stop_animation() {
  apng_stop_animation();
  #ifdef PBL_COLOR
  if (loading_bitmap_layer) { layer_set_hidden(bitmap_layer_get_layer(loading_bitmap_layer), true); }
  #endif
}

static void text_callback(void *data) {
  switch(text_counter) {
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
  text_counter = (text_counter + 1 ) % 4;
  text_timer = app_timer_register(150, text_callback, NULL);
}

static void setup_text_layer(char *text, Layer* window_layer, GRect bounds, bool custom, bool loading) {
    GSize text_size = graphics_text_layout_get_content_size(text, ubuntu18, bounds, GTextOverflowModeWordWrap, GTextAlignmentLeft);
    GRect text_bounds = GRect(bounds.origin.x + ((bounds.size.w - text_size.w) / 2), bounds.origin.y + ((bounds.size.h - text_size.h) / 2),
                              text_size.w, bounds.size.h);
    s_text_layer = text_layer_create(text_bounds);
    text_layer_set_text_color(s_text_layer, text_color_legible_over(bg_color));
    text_layer_set_background_color(s_text_layer, PBL_IF_BW_ELSE(GColorBlack, GColorClear));
    text_layer_set_overflow_mode(s_text_layer, GTextOverflowModeWordWrap);
    text_layer_set_font(s_text_layer, ubuntu18);
    text_layer_set_text(s_text_layer, text);
    text_layer_set_text_alignment(s_text_layer,GTextAlignmentLeft);
    Layer * text_layer_root = text_layer_get_layer(s_text_layer);
    layer_set_hidden(text_layer_root, true);
    layer_add_child(window_layer, text_layer_root);

    if (custom) {
      layer_set_hidden(text_layer_root, false);
    }

    if (loading) {
      layer_set_hidden(text_layer_root, false);
      text_timer = app_timer_register(150, text_callback, NULL);
    }

}

static void timeout_timer_callback(void *data) {
  timeout_timer = NULL;
  layer_set_hidden(text_layer_get_layer(s_text_layer), false);
}

static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);
  loading_bitmap_layer = NULL;
  s_text_layer = NULL;
  text_timer = NULL;
  timeout_timer = NULL;
  if (custom_text) {
    setup_text_layer(custom_text, window_layer, bounds, true, false);
    return;
  }
  #ifdef PBL_BW
    setup_text_layer("Loading...", window_layer, bounds, false, true);

    return;
  #endif 


  loading_bitmap_layer = bitmap_layer_create(bounds);
  bitmap_layer_set_alignment(loading_bitmap_layer, GAlignCenter);
  bitmap_layer_set_compositing_mode(loading_bitmap_layer, GCompOpSet);
  layer_add_child(window_layer, bitmap_layer_get_layer(loading_bitmap_layer));
  apng_set_data(RESOURCE_ID_LOADING_ANIMATION, &loading_layer_set_icon);
  apng_start_animation();
  bounds.origin.y = bounds.size.h *.7;
  bounds.size.h = bounds.size.h *.25;
  char *texts[] = {"hmm...", "um...", "maybe...", "(;-_-)", "(¬_¬)"};
  setup_text_layer(texts[rand() % ARRAY_LENGTH(texts)], window_layer, bounds, false, false); 
  timeout_timer = app_timer_register(LONG_LOAD_TIMEOUT, timeout_timer_callback, NULL);

}


void window_unload(Window *window) {
  if(s_window) {
    apng_stop_animation();
    if (s_text_layer) { text_layer_destroy(s_text_layer); }
    if (loading_bitmap_layer) { bitmap_layer_destroy(loading_bitmap_layer); }
    if (timeout_timer) { app_timer_cancel(timeout_timer); timeout_timer = NULL;}
    if (text_timer) { app_timer_cancel(text_timer); text_timer = NULL;}
    loading_window_stop_animation();
    window_destroy(s_window);
    s_window = NULL;
    custom_text = NULL;
  }
}

static void window_disappear(Window *window) {
  if(s_window) {
    window_stack_remove(window, false);
  }
}

void loading_window_pop() {
  window_disappear(s_window);
}

void loading_window_push(char *text) {
  if(!s_window) {
    custom_text = text;
    s_window = window_create();
    bg_color = GColorBlack;
    #ifdef PBL_COLOR
      srand(time(0));
      if(persist_read_data(PERSIST_COLOR, &bg_color, sizeof(GColor8)) == E_DOES_NOT_EXIST) {
        GColor8 colors[] = {GColorCobaltBlue, GColorIslamicGreen, GColorImperialPurple, GColorFolly, GColorChromeYellow};
        bg_color = colors[rand() % ARRAY_LENGTH(colors)]; 
      }
    #endif
    window_set_background_color(s_window, bg_color);
    window_set_window_handlers(s_window, (WindowHandlers) {
      .load = window_load,
      .disappear = window_disappear,
      .unload = window_unload
    });
    window_stack_push(s_window, true);
  }
}




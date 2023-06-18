#include <pebble.h>
#include "c/user_interface/loading_window.h"
#include "c/modules/comm.h"
#include "c/stateful.h"

static AppTimer *s_timeout_timer, *s_text_timer;
static Window *s_window;
static Layer *s_window_layer;
static GRect s_window_bounds;
static TextLayer *s_text_layer;
static uint8_t s_text_counter;
static char *s_custom_text;
static GColor8 s_bg_color, s_text_color;
static uint32_t s_anim_time;


//! Drives a simple text based animation
//! @param data Null pointer
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
  s_text_timer = app_timer_register(s_anim_time, text_callback, NULL);
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
    if (s_text_layer) {
      text_layer_destroy(s_text_layer);
    }
    s_text_layer = text_layer_create(text_bounds);
    text_layer_set_text_color(s_text_layer, s_text_color);
    text_layer_set_background_color(s_text_layer, PBL_IF_BW_ELSE(GColorBlack, GColorClear));
    text_layer_set_overflow_mode(s_text_layer, GTextOverflowModeWordWrap);
    text_layer_set_font(s_text_layer, ubuntu18);
    text_layer_set_text(s_text_layer, text);
    text_layer_set_text_alignment(s_text_layer,(text_animation) ? GTextAlignmentLeft : GTextAlignmentCenter);
    Layer * text_layer_root = text_layer_get_layer(s_text_layer);

    if (text_animation) { 
      s_text_timer = app_timer_register(0, text_callback, NULL); } 
    else {
      if(s_text_timer) {app_timer_cancel(s_text_timer); s_text_timer = NULL;}
    }

    layer_set_hidden(text_layer_root, hidden);
    layer_add_child(window_layer, text_layer_root);
}

//! Callback for all button clicks, allows user to re-attempt phone communication
//! @param recognizer The click recognizer that detected a "click" pattern
//! @param context Pointer to application specified data 
static void normal_click_callback(ClickRecognizerRef recognizer, void *ctx) {
  comm_init();
}


static void click_config_provider(void *ctx) {
  window_single_click_subscribe(BUTTON_ID_UP, normal_click_callback);
  window_single_click_subscribe(BUTTON_ID_SELECT, normal_click_callback);
  window_single_click_subscribe(BUTTON_ID_DOWN, normal_click_callback);
}


//! Callback function that unhides text layer
//! @param data Any user provided data
static void long_load(void *data) {
  s_timeout_timer = NULL;
  setup_text_layer("Phone not responding", s_window_layer, s_window_bounds, true, false); 
  layer_set_hidden(text_layer_get_layer(s_text_layer), false);
  window_set_click_config_provider(s_window, click_config_provider);
}

//! Builds and displays a loading animation and/or a text based message
static void window_load(Window *window) {
  window_set_click_config_provider(s_window, NULL);

  s_window_layer = window_get_root_layer(window);
  s_window_bounds = layer_get_bounds(s_window_layer);
  s_text_layer = NULL;
  s_text_timer = NULL;
  s_timeout_timer = NULL;
  s_text_counter = 0;
  text_color_legible_over_bg(&s_bg_color, &s_text_color);
  if (s_custom_text) {
    setup_text_layer(s_custom_text, s_window_layer, s_window_bounds, false, false);
    return;
  }
  setup_text_layer("Loading...", s_window_layer, s_window_bounds, false, true);
  s_timeout_timer = app_timer_register(LONG_LOAD_TIMEOUT, long_load, NULL);
}

void window_unload(Window *window) {
  if(s_window) {
    if (s_text_layer) { text_layer_destroy(s_text_layer); }
    if (s_timeout_timer) { app_timer_cancel(s_timeout_timer); s_timeout_timer = NULL;}
    if (s_text_timer) { app_timer_cancel(s_text_timer); s_text_timer = NULL;}
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
    s_anim_time = 200;
    s_window = window_create();
    s_bg_color = GColorBlack;
    #ifdef PBL_COLOR
      srand(time(0));
      if(persist_read_data(PERSIST_COLOR, &s_bg_color, sizeof(GColor8)) == E_DOES_NOT_EXIST) {
        GColor8 colors[] = {GColorCobaltBlue, GColorIslamicGreen, GColorImperialPurple, GColorFolly, GColorChromeYellow};
        s_bg_color = colors[rand() % ARRAY_LENGTH(colors)]; 
        persist_write_data(PERSIST_COLOR, &s_bg_color, sizeof(GColor8));
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




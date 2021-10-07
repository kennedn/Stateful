#include <pebble.h>
#include "c/user_interface/loading_window.h"
#include "c/modules/comm.h"
#include "c/stateful.h"

static GBitmap *loading_bitmap;
static BitmapLayer *loading_bitmap_layer;
static GBitmapSequence *loading_sequence;
static AppTimer *loading_timer, *timeout_timer, *text_timer;
static Window *s_window;
static TextLayer *s_text_layer;
static void loading_window_start_animation();
static uint8_t text_counter = 0;

static void timer_handler(void *context) {
  uint32_t next_delay;

  // Advance to the next APNG frame
  if(gbitmap_sequence_update_bitmap_next_frame(loading_sequence, loading_bitmap, &next_delay)) {
    bitmap_layer_set_bitmap(loading_bitmap_layer, loading_bitmap);
    layer_mark_dirty(bitmap_layer_get_layer(loading_bitmap_layer));

    // Timer for that delay
    loading_timer = app_timer_register(next_delay, timer_handler, NULL);
  } else {
    // Start again
    loading_window_start_animation();
  }
}

static void loading_window_start_animation() {
  // Make bitmap layer visible
  layer_set_hidden(bitmap_layer_get_layer(loading_bitmap_layer), false);
  
  // Free old data
  if(loading_sequence) {
    gbitmap_sequence_destroy(loading_sequence);
    loading_sequence = NULL;
  }
  if(loading_bitmap) {
    gbitmap_destroy(loading_bitmap);
    loading_bitmap = NULL;
  }

  // Create sequence
  loading_sequence = gbitmap_sequence_create_with_resource(RESOURCE_ID_LOADING_ANIMATION);

  // Create GBitmap
  loading_bitmap = gbitmap_create_blank(gbitmap_sequence_get_bitmap_size(loading_sequence), GBitmapFormat8Bit);

  // Begin animation
  loading_timer = app_timer_register(1, timer_handler, NULL);
}

static void loading_window_stop_animation() {
  if (loading_timer) { app_timer_cancel(loading_timer); }
  loading_timer = NULL;
  #ifdef PBL_COLOR
  if (loading_bitmap_layer) { layer_set_hidden(bitmap_layer_get_layer(loading_bitmap_layer), true); }
  #endif
}

static void text_callback(void *data) {
  switch(text_counter) {
    case 0:
      text_layer_set_text(s_text_layer, "Phone not ready");
      break;
    case 1:
      text_layer_set_text(s_text_layer, "Phone not ready.");
      break;
    case 2:
      text_layer_set_text(s_text_layer, "Phone not ready..");
      break;
    case 3:
      text_layer_set_text(s_text_layer, "Phone not ready...");
      break;

  }
  layer_mark_dirty(text_layer_get_layer(s_text_layer));
  text_counter = (text_counter + 1 ) % 4;
  text_timer = app_timer_register(150, text_callback, NULL);
}

static void setup_text_layer(char *text, Layer* window_layer, GRect bounds, bool loading) {
    GSize text_size = graphics_text_layout_get_content_size(text, ubuntu18, bounds, GTextOverflowModeWordWrap, GTextAlignmentLeft);
    // GSize text_size = GSize(bounds.size.w, 48);
    // text_size.h = 24;
    GRect text_bounds = GRect(bounds.origin.x + ((bounds.size.w - text_size.w) / 2), bounds.origin.y + ((bounds.size.h - text_size.h) / 2),
                              bounds.size.w, bounds.size.h);
    s_text_layer = text_layer_create(text_bounds);
    text_layer_set_text_color(s_text_layer, GColorWhite);
    text_layer_set_background_color(s_text_layer, PBL_IF_BW_ELSE(GColorBlack, GColorClear));
    text_layer_set_overflow_mode(s_text_layer, GTextOverflowModeWordWrap);
    text_layer_set_font(s_text_layer, ubuntu18);
    text_layer_set_text(s_text_layer, text);
    text_layer_set_text_alignment(s_text_layer,GTextAlignmentLeft);
    Layer * text_layer_root = text_layer_get_layer(s_text_layer);
    layer_set_hidden(text_layer_root, true);
    layer_add_child(window_layer, text_layer_root);

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
  loading_bitmap = NULL;
  s_text_layer = NULL;
  loading_timer = NULL;
  text_timer = NULL;
  timeout_timer = NULL;
  #ifdef PBL_BW
    setup_text_layer("Loading...", window_layer, bounds, true);
    return;
  #endif 

  loading_bitmap_layer = bitmap_layer_create(bounds);
  bitmap_layer_set_alignment(loading_bitmap_layer, GAlignCenter);
  bitmap_layer_set_compositing_mode(loading_bitmap_layer, GCompOpSet);
  layer_add_child(window_layer, bitmap_layer_get_layer(loading_bitmap_layer));
  loading_window_start_animation();
  bounds.origin.y = bounds.size.h *.7;
  bounds.size.h = bounds.size.h *.25;
  char *texts[] = {"hmm...", "um...", "maybe...", "(;-_-)", "(¬_¬)"};
  setup_text_layer(texts[rand() % ARRAY_LENGTH(texts)], window_layer, bounds, false); 
  timeout_timer = app_timer_register(RETRY_READY_TIMEOUT, timeout_timer_callback, NULL);

}


void window_unload(Window *window) {
  if(s_window) {
    if (s_text_layer) { text_layer_destroy(s_text_layer); }
    if (loading_bitmap_layer) { bitmap_layer_destroy(loading_bitmap_layer); }
    if (loading_bitmap) { gbitmap_destroy(loading_bitmap); }
    if (timeout_timer) { app_timer_cancel(timeout_timer); timeout_timer = NULL;}
    if (text_timer) { app_timer_cancel(text_timer); text_timer = NULL;}
    loading_window_stop_animation();
    window_destroy(s_window);
    s_window = NULL;
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

void loading_window_push() {
  if(!s_window) {
    srand(time(0));
    s_window = window_create();
    GColor8 color = GColorBlack;
    #ifdef PBL_COLOR
      if(persist_read_data(0, &color, sizeof(GColor8)) == E_DOES_NOT_EXIST) {
        GColor8 colors[] = {GColorCobaltBlue, GColorIslamicGreen, GColorImperialPurple, GColorFolly, GColorChromeYellow};
        color = colors[rand() % ARRAY_LENGTH(colors)]; 
      }
    #endif
    window_set_background_color(s_window, color);
    window_set_window_handlers(s_window, (WindowHandlers) {
      .load = window_load,
      .disappear = window_disappear,
      .unload = window_unload
    });
    window_stack_push(s_window, true);
  }
}




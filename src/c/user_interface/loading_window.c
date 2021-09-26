#include <pebble.h>
#include "c/user_interface/loading_window.h"

static GBitmap *loading_bitmap;
static BitmapLayer *loading_bitmap_layer;
static GBitmapSequence *loading_sequence;
static AppTimer *loading_timer;
static Window *s_window;
static void loading_window_start_animation();


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
  app_timer_cancel(loading_timer);
  loading_timer = NULL;
  layer_set_hidden(bitmap_layer_get_layer(loading_bitmap_layer), true);
}


static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  loading_bitmap_layer = bitmap_layer_create(bounds);
  bitmap_layer_set_alignment(loading_bitmap_layer, GAlignCenter);
  bitmap_layer_set_compositing_mode(loading_bitmap_layer, GCompOpSet);
  layer_add_child(window_layer, bitmap_layer_get_layer(loading_bitmap_layer));
  loading_window_start_animation();
}

void window_unload() {
  bitmap_layer_destroy(loading_bitmap_layer);
  free(loading_bitmap);
}

static void window_disappear(Window *window) {
  window_stack_remove(window, false);
  loading_window_stop_animation();
}

void loading_window_push() {
  if(!s_window) {
    s_window = window_create();
    GColor8 color;
    if(persist_read_data(0, &color, sizeof(GColor8)) == E_DOES_NOT_EXIST) {
      srand(time(0));
      GColor8 colors[] = {GColorCobaltBlue, GColorIslamicGreen, GColorImperialPurple, GColorFolly, GColorChromeYellow};
      color = colors[rand() % ARRAY_LENGTH(colors)]; 
    }
    window_set_background_color(s_window, PBL_IF_COLOR_ELSE(color, GColorWhite));
    window_set_window_handlers(s_window, (WindowHandlers) {
      .load = window_load,
      .disappear = window_disappear,
      .unload = window_unload
    });
  }
  window_stack_push(s_window, true);
}




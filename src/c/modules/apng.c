#include <pebble.h>

static GBitmap *s_loading_bitmap;
static GBitmapSequence *s_loading_sequence;
static AppTimer *s_loading_timer;
static uint32_t s_resource_id;

static void (*s_callback_function)(GBitmap *icon);

void apng_start_animation();

static void timer_handler(void *context) {
  uint32_t next_delay;

  // Advance to the next APNG frame
  if(gbitmap_sequence_update_bitmap_next_frame(s_loading_sequence, s_loading_bitmap, &next_delay)) {
    // Pass icon to callback function
    s_callback_function(s_loading_bitmap);

    // Timer for that delay
    s_loading_timer = app_timer_register(next_delay, timer_handler, NULL);
  } else {
    // Start again
    apng_start_animation();
  }
}

void apng_start_animation() {
  #ifdef PBL_COLOR
  if(s_loading_timer) { return; }

  // Free old data
  if(s_loading_sequence) {
    gbitmap_sequence_destroy(s_loading_sequence);
    s_loading_sequence = NULL;
  }
  if(s_loading_bitmap) {
    gbitmap_destroy(s_loading_bitmap);
    s_loading_bitmap = NULL;
  }

  // Create sequence
  s_loading_sequence = gbitmap_sequence_create_with_resource(s_resource_id);

  // Create GBitmap
  s_loading_bitmap = gbitmap_create_blank(gbitmap_sequence_get_bitmap_size(s_loading_sequence), GBitmapFormat8Bit);

  // Begin animation
  s_loading_timer = app_timer_register(1, timer_handler, NULL);
  #endif
}

void apng_stop_animation() {
  #ifdef PBL_COLOR
  if (s_loading_timer) { app_timer_cancel(s_loading_timer); }
  s_loading_timer = NULL;
  #endif
}

void apng_set_data(uint32_t resource_id, void (*callback_function)(GBitmap *icon)) {
  #ifdef PBL_COLOR
  apng_stop_animation();
  if (resource_id != s_resource_id) { s_resource_id = resource_id; }
  s_callback_function = callback_function;
  #endif
}

void apng_init() {
  #ifdef PBL_COLOR
  s_resource_id = -1;
  s_callback_function = NULL;
  s_loading_sequence = NULL;
  s_loading_bitmap = NULL;
  s_loading_timer = NULL;
  #endif
}

void apng_deinit() {
  #ifdef PBL_COLOR
  apng_stop_animation();
  s_resource_id = -1;
  s_callback_function = NULL;
  if (s_loading_sequence) { gbitmap_sequence_destroy(s_loading_sequence); s_loading_sequence = NULL; }
  if (s_loading_bitmap) { gbitmap_destroy(s_loading_bitmap); s_loading_bitmap = NULL;}
  #endif
}


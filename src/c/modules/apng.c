#include <pebble.h>

static GBitmap *s_loading_bitmap;
static GBitmapSequence *s_loading_sequence;
static AppTimer *s_loading_timer;
static uint32_t s_resource_id;

static void (*s_callback_function)(GBitmap *icon);

void apng_start_animation();

//! Loops through each frame of animation, passing the current frame to a callback function
//! @param context Pointer to application specified data
static void timer_handler(void *context) {
  s_loading_timer = NULL;
  uint32_t next_delay;

  if(gbitmap_sequence_update_bitmap_next_frame(s_loading_sequence, s_loading_bitmap, &next_delay)) {
    s_callback_function(s_loading_bitmap);
    s_loading_timer = app_timer_register(next_delay, timer_handler, NULL);
  } else {
    apng_start_animation();
  }
}

//! Tears down and recreates all animation elements, starts timer to loop through frames
void apng_start_animation() {
  #ifdef PBL_COLOR
  if(s_loading_timer) { return; }

  if(s_loading_sequence) {
    gbitmap_sequence_destroy(s_loading_sequence);
    s_loading_sequence = NULL;
  }
  if(s_loading_bitmap) {
    gbitmap_destroy(s_loading_bitmap);
    s_loading_bitmap = NULL;
  }

  s_loading_sequence = gbitmap_sequence_create_with_resource(s_resource_id);
  s_loading_bitmap = gbitmap_create_blank(gbitmap_sequence_get_bitmap_size(s_loading_sequence), GBitmapFormat8Bit);
  s_loading_timer = app_timer_register(0, timer_handler, NULL);
  #endif
}

//! Cancels any inflight timers
void apng_stop_animation() {
  #ifdef PBL_COLOR
  if (s_loading_timer) { app_timer_cancel(s_loading_timer); }
  s_loading_timer = NULL;
  #endif
}

//! Configures the animation resource and callback function to be used during animation
//! @param resource_id The id of an apng file
//! @param callback_function A callback function to routinly pass frames to
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


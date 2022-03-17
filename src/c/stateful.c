#include <pebble.h>
#include "c/user_interface/loading_window.h"
#include "c/modules/comm.h"
#include "c/modules/data.h"
#include "c/modules/apng.h"
#include "c/stateful.h"
GBitmap *indicator_icons[5];

VibePattern short_vibe = { 
    .durations = (uint32_t []) {50},
    .num_segments = 1,};
VibePattern long_vibe = { 
    .durations = (uint32_t []) {40,40,40},
    .num_segments = 3,};
VibePattern overflow_vibe = { 
    .durations = (uint32_t []) {40,100,40},
    .num_segments = 3,};

GFont ubuntu18;

//! Returns a color that is legible over the provided bg_color
//! @param bg_color color to test for legibility
//! @param text_color A legable color, either white or a darkened derivative of bg_color
//! @return Boolean representing whether luminance threshold was exceeded
bool text_color_legible_over_bg(const GColor8 *bg_color, GColor8 *text_color) {
  // constants taken from https://www.w3.org/TR/AERT/#color-contrast
  uint16_t luminance = (uint16_t)((0.299 * bg_color->r + 0.587 * bg_color->g + 0.114 * bg_color->b) * 100);
  bool exceeds_threshold = (luminance >= 200);
  if(!text_color) {
    return exceeds_threshold;
  }
  #ifdef PBL_COLOR
  GColor8 derivative = (GColor8) {.a = 3,
                                  .r = MAX(0, bg_color->r - 2),
                                  .g = MAX(0, bg_color->g - 2),
                                  .b = MAX(0, bg_color->b - 2)};
  *text_color = (exceeds_threshold) ? derivative : GColorWhite;
  #else
  *text_color = (exceeds_threshold) ? GColorBlack : GColorWhite;
  #endif
  return exceeds_threshold;
}


static void init() {
  uint8_t crash_count = (uint8_t) persist_read_int(PERSIST_CRASH_COUNT);
  if (crash_count > 2) {
    data_clear_persist();
  }
  debug(2, "Crash count: %d", crash_count);
  persist_write_int(PERSIST_CRASH_COUNT, crash_count + 1);

  ubuntu18 = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_UBUNTU_BOLD_18));
  // On aplite, the limited memory can become too segmented to be able to create icons later on, so do it now.
  indicator_icons[ICON_TICK] = gbitmap_create_with_resource(RESOURCE_ID_ICON_TICK);
  indicator_icons[ICON_CROSS] = gbitmap_create_with_resource(RESOURCE_ID_ICON_CROSS);
  indicator_icons[ICON_QUESTION] = gbitmap_create_with_resource(RESOURCE_ID_ICON_QUESTION);
  indicator_icons[ICON_OVERFLOW] = gbitmap_create_with_resource(RESOURCE_ID_ICON_OVERFLOW);
  indicator_icons[ICON_DEFAULT] = gbitmap_create_with_resource(RESOURCE_ID_ICON_DEFAULT);
  apng_init();
  comm_init();
}

static void deinit() { 

  fonts_unload_custom_font(ubuntu18);
  for (uint8_t i=0; i < ARRAY_LENGTH(indicator_icons); i++) {
      gbitmap_destroy(indicator_icons[i]);
      indicator_icons[i] = NULL;
  }
  comm_deinit();
  apng_deinit();
  persist_delete(PERSIST_CRASH_COUNT);
}

int main() {
  init();
  app_event_loop();
  deinit();
}

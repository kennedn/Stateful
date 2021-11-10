#include <pebble.h>
#include "c/user_interface/loading_window.h"
#include "c/modules/comm.h"
#include "c/modules/data.h"
#include "c/modules/apng.h"
#include "c/stateful.h"


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
//! @return A legable color, either white or a darkened derivative of bg_color
GColor8 text_color_legible_over(GColor8 bg_color) {
  // constants taken from https://www.w3.org/TR/AERT/#color-contrast
  uint16_t luminance = (uint16_t)((0.299 * bg_color.r + 0.587 * bg_color.g + 0.114 * bg_color.b) * 100);
  #ifdef PBL_COLOR
  GColor8 derivative = (GColor8) {.a = 3,
                                  .r = MAX(0, bg_color.r - 2),
                                  .g = MAX(0, bg_color.g - 2),
                                  .b = MAX(0, bg_color.b - 2)};
  return (luminance < 200) ? GColorWhite : derivative;
  #else
  return (luminance < 200) ? GColorWhite : GColorBlack;
  #endif
}


static void init() {
  ubuntu18 = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_UBUNTU_BOLD_18));
  apng_init();
  comm_init();
}

static void deinit() { 
  fonts_unload_custom_font(ubuntu18);
  comm_deinit();
  apng_deinit();
}

int main() {
  init();
  app_event_loop();
  deinit();
}

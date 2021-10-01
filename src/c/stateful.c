#include <pebble.h>
#include "c/user_interface/loading_window.h"
#include "c/user_interface/action_window.h"
#include "c/user_interface/menu_window.h"
#include "c/modules/comm.h"
#include "c/modules/data.h"
#include "c/stateful.h"

VibePattern short_vibe = { 
    .durations = (uint32_t []) {50},
    .num_segments = 1,};

VibePattern long_vibe = { 
    .durations = (uint32_t []) {100},
    .num_segments = 1,};

// static void loading_window(void *data) {
//   loading_window_push();
// }

void pebblekit_connection_callback(bool connected) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Connected: %s", (connected) ? "true" : "false");
  loading_window_pop();
  action_window_pop();
  menu_window_pop();
  loading_window_push();
}

static void init() {
  ubuntu18 = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_UBUNTU_BOLD_18));
  ubuntu10 = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_UBUNTU_BOLD_10));
  connection_service_subscribe((ConnectionHandlers) {
    .pebblekit_connection_handler = pebblekit_connection_callback
  });
  pebblekit_connection_callback(connection_service_peek_pebblekit_connection());
  comm_init();
}

static void deinit() { 
  connection_service_unsubscribe();
  fonts_unload_custom_font(ubuntu18);
  fonts_unload_custom_font(ubuntu10);
  comm_deinit();
}

int main() {
  init();
  app_event_loop();
  deinit();
}

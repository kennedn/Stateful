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

// called whenever connection state changes (for some reason var passed to this callback is always true)
void pebblekit_connection_callback(bool connected) {
  #if DEBUG > 0
  APP_LOG(APP_LOG_LEVEL_DEBUG, "Connection state changed");
  #endif
  loading_window_pop();
  action_window_pop();
  menu_window_pop();
  loading_window_push(NULL);
  comm_callback_start();
}

static void init() {
  ubuntu18 = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_UBUNTU_BOLD_18));
  comm_init();
  connection_service_subscribe((ConnectionHandlers) {
    .pebblekit_connection_handler = pebblekit_connection_callback
  });
  pebblekit_connection_callback(true);
}

static void deinit() { 
  connection_service_unsubscribe();
  fonts_unload_custom_font(ubuntu18);
  comm_deinit();
}

int main() {
  init();
  app_event_loop();
  deinit();
}

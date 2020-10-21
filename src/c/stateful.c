#include <pebble.h>
#include "c/user_interface/toggle_window.h"
#include "c/modules/comm.h"

static void init() {
  comm_init();
  toggle_window_push();
}

static void deinit() { 
 comm_deinit();
}

int main() {
  init();
  app_event_loop();
  deinit();
}

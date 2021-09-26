#include <pebble.h>
#include "c/user_interface/loading_window.h"
#include "c/modules/comm.h"
#include "c/modules/data.h"


static void window_load(Window *window) {
}

static void window_unload(Window *window) {
}

static void init() {
  comm_init();
  loading_window_push();
}

static void deinit() { 
 comm_deinit();
}

int main() {
  init();
  app_event_loop();
  deinit();
}

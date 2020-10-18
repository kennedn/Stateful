#include <pebble.h>
#include "c/user_interface/toggle_window.h"
#include "c/modules/comm.h"
#define DEBUG 0

//persistant storage var
#define ENDPOINT_STATE 100

Window *window;
static int window_width, window_height;

Layer *bg_layer, *heading_layer, *sidebar_layer, *icon_layer;

static uint8_t x_pad, y_pad;

GFont ubuntu18, ubuntu10;
GBitmap *icon;
GColor colors[2][2];
int color;


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

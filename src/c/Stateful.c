#include <pebble.h>
#define DEBUG 0
#define SHORT_VIBE() vibes_enqueue_custom_pattern(short_vibe);
//persistant storage var
#define ENDPOINT_STATE 100

typedef enum {
	GOOD,
	BAD
} Colorset;

typedef enum {
	MAIN,
	HIGHLIGHT
} Color;

Window *window;
static int window_width, window_height;

Layer *bg_layer, *heading_layer, *sidebar_layer, *icon_layer;

static uint8_t x_pad, y_pad;

GFont ubuntu18, ubuntu10;
GBitmap *icon;
GColor colors[2][2];
int color;

VibePattern short_vibe = { 
	.durations = (uint32_t []) {50},
	.num_segments = 1,};

// Called when a message is received from the JavaScript side
static void inbox(DictionaryIterator *received, void *context) {
    SHORT_VIBE();

	Tuple *tuple;
    
	tuple = dict_find(received, MESSAGE_KEY_status);
	if(tuple) {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "tuple: %s, literal: %s, comparison %d", tuple->value->cstring, "Success", strcmp(tuple->value->cstring, "Success"));
        if (strcmp(tuple->value->cstring, "Success") == 0) {
			uint32_t state = ! persist_read_int(ENDPOINT_STATE);
			color = state;
			persist_write_int(ENDPOINT_STATE, state);
		}
        layer_mark_dirty(bg_layer);
        layer_mark_dirty(sidebar_layer);
	} 
	else {
        APP_LOG(APP_LOG_LEVEL_DEBUG, "ERROR!");
    }
}


// Make a request for the national debt number
static void outbox(void *context, uint8_t endpoint, uint8_t param) {
    DictionaryIterator *iter;
	
	uint32_t result = app_message_outbox_begin(&iter);
    if (result == APP_MSG_OK) {
	    dict_write_uint8(iter, MESSAGE_KEY_endpoint, endpoint);  // Gotta have a payload
        dict_write_uint8(iter, MESSAGE_KEY_param, param);
	    dict_write_end(iter);
        app_message_outbox_send();
    }
}

static void bg_layer_callback(Layer *layer, GContext *ctx) {
	GRect bounds = layer_get_bounds(layer);
	graphics_context_set_fill_color(ctx, colors[color][0]);
	graphics_fill_rect(ctx, bounds, 0, 0);

	#if DEBUG == 1
		graphics_context_set_stroke_color(ctx, colors[!color][0]);
		graphics_draw_rect(ctx, bounds);
	#endif
}
static void sidebar_layer_callback(Layer *layer, GContext *ctx) {
	GRect bounds = layer_get_bounds(layer);
	graphics_context_set_fill_color(ctx, colors[color][HIGHLIGHT]);

	graphics_fill_rect(ctx, bounds, 0, 0);

	// Draw 3 dots in a vertical row with a dots worth of spacing in between each
	graphics_context_set_fill_color(ctx, GColorWhite);
	for(int i=-1; i <= 1; i++) {
		uint8_t size = bounds.size.w / 2;
		graphics_fill_rect(ctx, GRect(bounds.size.w / 4, bounds.size.h / 2 + size * i * 2, size, size), 0, 0);
	}

	#if DEBUG == 1
		graphics_context_set_stroke_color(ctx, colors[!color][0]);
		//graphics_draw_rect(ctx, bounds);
	#endif
}
static void heading_layer_callback(Layer *layer, GContext *ctx) {
	GRect bounds = layer_get_bounds(layer);
	uint8_t stroke_width = 1;
	graphics_context_set_stroke_width(ctx, stroke_width);
	graphics_context_set_stroke_color(ctx, GColorWhite);
	graphics_context_set_fill_color(ctx, GColorWhite);

	graphics_draw_line(ctx, GPoint(0, bounds.size.h - stroke_width), GPoint(bounds.size.w, bounds.size.h - stroke_width));


	graphics_draw_text(ctx, "Bulb", ubuntu18,\
					   GRect(x_pad / 2, 0, bounds.size.w, bounds.size.h),\
					   GTextOverflowModeTrailingEllipsis, GTextAlignmentLeft, NULL);
	graphics_draw_text(ctx, "1/5", ubuntu10,\
					   GRect(0, y_pad / 2, bounds.size.w - x_pad / 2, bounds.size.h),\
					   GTextOverflowModeTrailingEllipsis, GTextAlignmentRight, NULL);

	#if DEBUG == 1
		graphics_context_set_stroke_color(ctx, colors[!color][0]);
		graphics_draw_rect(ctx, bounds);
	#endif
}
static void icon_layer_callback(Layer *layer, GContext *ctx) {
	GRect bounds = layer_get_bounds(layer);
	GRect icon_bounds = gbitmap_get_bounds(icon);

	grect_align(&icon_bounds, &bounds, GAlignCenter, true);
	graphics_context_set_compositing_mode(ctx, GCompOpSet);

	graphics_draw_bitmap_in_rect(ctx, icon, icon_bounds);

	#if DEBUG == 1
		graphics_context_set_stroke_color(ctx, colors[!color][0]);
		graphics_draw_rect(ctx, icon_bounds);
		graphics_draw_rect(ctx, bounds);
	#endif
}

static void up_click_callback(ClickRecognizerRef recognizer, void *ctx) {
	APP_LOG(APP_LOG_LEVEL_DEBUG, "Up clicked!");

}
static void select_click_callback(ClickRecognizerRef recognizer, void *ctx) {
	outbox(ctx, 2, persist_read_int(ENDPOINT_STATE));
}
static void down_click_callback(ClickRecognizerRef recognizer, void *ctx) {
	APP_LOG(APP_LOG_LEVEL_DEBUG, "Down clicked!");
}

static void click_config_provider(Window *window) {
	window_single_click_subscribe(BUTTON_ID_UP, up_click_callback);
	window_single_click_subscribe(BUTTON_ID_SELECT, select_click_callback);
	window_single_click_subscribe(BUTTON_ID_DOWN, down_click_callback);
}


static void window_load(Window *window) {

	window_set_background_color(window, GColorBlack);
	Layer * window_layer = window_get_root_layer(window);
	
	GRect bounds = layer_get_bounds(window_layer);
	window_width = bounds.size.w;
	window_height = bounds.size.h;


	x_pad = window_width / 20; 	// 5%
	y_pad = window_height / 12; // 8%
	
	bg_layer = layer_create(bounds);
	heading_layer = layer_create(GRect(x_pad, y_pad, window_width - x_pad * 3, 25));
	sidebar_layer = layer_create(GRect(window_width - x_pad, 0, x_pad, window_height));
	icon_layer = layer_create(GRect(x_pad, y_pad * 2, window_width - x_pad * 3, window_height - y_pad * 2));


	layer_set_update_proc(bg_layer, bg_layer_callback);
	layer_set_update_proc(heading_layer, heading_layer_callback);
	layer_set_update_proc(sidebar_layer, sidebar_layer_callback);
	layer_set_update_proc(icon_layer, icon_layer_callback);


	// bitmap_layer_set_alignment(icon_layer, GAlignCenter);
	// bitmap_layer_set_compositing_mode(icon_layer, GCompOpSet);
	// bitmap_layer_set_bitmap(icon_layer, icon);

	layer_add_child(window_layer, bg_layer);
	layer_add_child(window_layer, heading_layer);
	layer_add_child(window_layer, sidebar_layer);
	layer_add_child(window_layer, icon_layer);

}

static void window_unload(Window *window) {
  layer_destroy(heading_layer);
}

static void init(void) {
	window = window_create();
	window_set_window_handlers(window, (WindowHandlers) {
		.load = window_load,
    	.unload = window_unload,
  	});
  	window_set_click_config_provider(window, (ClickConfigProvider)click_config_provider);

  	app_message_register_inbox_received(inbox);
  	app_message_open(128,128);

	ubuntu18 = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_UBUNTU_BOLD_18));
	ubuntu10 = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_UBUNTU_BOLD_10));
	icon = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_BULB);

	colors[GOOD][MAIN] = GColorIslamicGreen;
	colors[GOOD][HIGHLIGHT] = GColorMayGreen;
	colors[BAD][MAIN] = GColorFolly;
	colors[BAD][HIGHLIGHT] = GColorSunsetOrange;
	color = persist_read_int(ENDPOINT_STATE);

  	window_stack_push(window, true);

}

static void deinit(void) {

	fonts_unload_custom_font(ubuntu18);
	fonts_unload_custom_font(ubuntu10);

	free(icon);

	app_message_deregister_callbacks();

	window_destroy(window);
}

int main(void) {
	init();
	app_event_loop();
	deinit();
}

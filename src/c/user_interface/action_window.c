#include <pebble.h>

#include "c/user_interface/action_window.h"
#include "c/user_interface/loading_window.h"
#include "c/modules/data.h"
#include "c/modules/comm.h"
#include "c/stateful.h"
static Window *s_action_window;
static ActionBarLayer *s_action_bar_layer;
static TextLayer *s_up_label_layer, *s_mid_label_layer, *s_down_label_layer;
static GRect s_label_bounds;
static uint8_t tap_toggle = 0;
static Tile *tile;
static uint8_t tile_index;

void action_window_swap_buttons();

static void up_click_callback(ClickRecognizerRef recognizer, void *ctx) {
    (strlen(tile->texts[tap_toggle + 0]) == 0) ? action_window_set_color(-2) : action_window_set_color(-1);
    action_window_inset_highlight(BUTTON_ID_UP);
    comm_xhr_request(ctx, tile_index, 0 + tap_toggle);
}
static void mid_click_callback(ClickRecognizerRef recognizer, void *ctx) {
    (strlen(tile->texts[tap_toggle + 2]) == 0) ? action_window_set_color(-2) : action_window_set_color(-1);
    action_window_inset_highlight(BUTTON_ID_SELECT);
    comm_xhr_request(ctx, tile_index, 2 + tap_toggle);
}
static void down_click_callback(ClickRecognizerRef recognizer, void *ctx) {
    (strlen(tile->texts[tap_toggle + 4]) == 0) ? action_window_set_color(-2) : action_window_set_color(-1);
    action_window_inset_highlight(BUTTON_ID_DOWN);
    comm_xhr_request(ctx, tile_index, 4 + tap_toggle);
}

static void mid_hold_click_callback(ClickRecognizerRef recognizer, void *ctx) {
    action_window_swap_buttons();
}
static void click_config_provider(void *ctx) {
    window_single_click_subscribe(BUTTON_ID_UP, up_click_callback);
    window_single_click_subscribe(BUTTON_ID_SELECT, mid_click_callback);
    window_long_click_subscribe(BUTTON_ID_SELECT, 500, mid_hold_click_callback, NULL);
    window_single_click_subscribe(BUTTON_ID_DOWN, down_click_callback);
} 

void action_window_swap_buttons() {
    SHORT_VIBE();
    action_window_inset_highlight(BUTTON_ID_BACK);
    tap_toggle = !tap_toggle;

    GRect bounds = layer_get_bounds(window_get_root_layer(s_action_window));
    GRect up_label_bounds = GRect(bounds.origin.x, bounds.origin.y, bounds.size.w, bounds.size.h / 3);
    GRect mid_label_bounds = GRect(bounds.origin.x, bounds.origin.y + (up_label_bounds.origin.y + up_label_bounds.size.h),
                                   bounds.size.w, bounds.size.h / 3);
    GRect down_label_bounds = GRect(bounds.origin.x, bounds.origin.y + (mid_label_bounds.origin.y + mid_label_bounds.size.h),
                                   bounds.size.w, bounds.size.h / 3);
    GSize up_text_size = graphics_text_layout_get_content_size(tile->texts[0 + tap_toggle], ubuntu18, GRect(bounds.origin.x, bounds.origin.y, bounds.size.w - (ACTION_BAR_WIDTH * 1.6), bounds.size.h), GTextOverflowModeFill, GTextAlignmentRight);
    up_text_size.h *= 1.332;
    GSize mid_text_size = graphics_text_layout_get_content_size(tile->texts[2 + tap_toggle], ubuntu18, GRect(bounds.origin.x, bounds.origin.y, bounds.size.w - (ACTION_BAR_WIDTH * 1.6), bounds.size.h), GTextOverflowModeFill, GTextAlignmentRight);
    mid_text_size.h *= 1.332;
    GSize down_text_size = graphics_text_layout_get_content_size(tile->texts[4 + tap_toggle], ubuntu18, GRect(bounds.origin.x, bounds.origin.y, bounds.size.w - (ACTION_BAR_WIDTH * 1.6), bounds.size.h), GTextOverflowModeFill, GTextAlignmentRight);
    down_text_size.h *= 1.332;
    uint8_t pad = PBL_IF_RECT_ELSE(5, 30);
    GEdgeInsets up_label_insets = {.top = pad  + ((up_label_bounds.size.h - (up_text_size.h)) /2), .left = ACTION_BAR_WIDTH * 0.3, .right = ACTION_BAR_WIDTH * 1.3, .bottom = -pad};
    GEdgeInsets mid_label_insets = {.top = ((mid_label_bounds.size.h - (mid_text_size.h)) /2), .left = ACTION_BAR_WIDTH * 0.3, .right = ACTION_BAR_WIDTH * 1.3 };
    GEdgeInsets down_label_insets = {.top = -pad + ((down_label_bounds.size.h - (down_text_size.h)) /2), .left = ACTION_BAR_WIDTH * 0.3, .right = ACTION_BAR_WIDTH * 1.3, .bottom = pad};
    layer_set_frame(text_layer_get_layer(s_up_label_layer), grect_inset(up_label_bounds, up_label_insets));
    layer_set_frame(text_layer_get_layer(s_mid_label_layer), grect_inset(mid_label_bounds, mid_label_insets));
    layer_set_frame(text_layer_get_layer(s_down_label_layer), grect_inset(down_label_bounds, down_label_insets));
    text_layer_set_text(s_up_label_layer, tile->texts[tap_toggle]);
    text_layer_set_text(s_mid_label_layer, tile->texts[2 + tap_toggle]);
    text_layer_set_text(s_down_label_layer, tile->texts[4 + tap_toggle]);
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_UP, default_icon);
    action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_UP, data_icon_array_search(tile->icon_key[tap_toggle]), true);
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_SELECT, default_icon);
    action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_SELECT, data_icon_array_search(tile->icon_key[2 + tap_toggle]), true);
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_DOWN, default_icon);
    action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_DOWN, data_icon_array_search(tile->icon_key[4 + tap_toggle]), true);
    layer_mark_dirty(text_layer_get_layer(s_up_label_layer));
    layer_mark_dirty(text_layer_get_layer(s_mid_label_layer));
    layer_mark_dirty(text_layer_get_layer(s_down_label_layer));

    #ifdef PBL_COLOR
        window_set_background_color(s_action_window, (!tap_toggle) ? tile->color :tile->highlight);
        action_bar_layer_set_background_color(s_action_bar_layer, (!tap_toggle) ? tile->highlight : tile->color );
        layer_mark_dirty(action_bar_layer_get_layer(s_action_bar_layer));
        layer_mark_dirty(window_get_root_layer(s_action_window));
    #endif
}

void action_window_refresh_icons() {
    if (window_stack_get_top_window() == s_action_window) {
        action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_UP, data_icon_array_search(tile->icon_key[tap_toggle]), true);
        action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_SELECT, data_icon_array_search(tile->icon_key[2 + tap_toggle]), true);
        action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_DOWN, data_icon_array_search(tile->icon_key[4 + tap_toggle]), true);
        layer_mark_dirty(action_bar_layer_get_layer(s_action_bar_layer));
    }
}


static void action_window_load(Window *window) {
    Layer *window_layer = window_get_root_layer(window);
    GRect bounds = layer_get_bounds(window_layer);
    s_action_bar_layer = action_bar_layer_create();
    tap_toggle = 0;

    // 5 pixel y pad on top
   GRect up_label_bounds = GRect(bounds.origin.x, bounds.origin.y, bounds.size.w, bounds.size.h / 3);
    GRect mid_label_bounds = GRect(bounds.origin.x, up_label_bounds.origin.y + up_label_bounds.size.h,
                                   bounds.size.w, bounds.size.h / 3);
    GRect down_label_bounds = GRect(bounds.origin.x, mid_label_bounds.origin.y + mid_label_bounds.size.h,
                                   bounds.size.w, bounds.size.h / 3);
    GSize up_text_size = graphics_text_layout_get_content_size(tile->texts[0], ubuntu18, GRect(bounds.origin.x, bounds.origin.y, bounds.size.w - (ACTION_BAR_WIDTH * 1.6), bounds.size.h), GTextOverflowModeFill, GTextAlignmentRight);
    up_text_size.h *= 1.332;
    GSize mid_text_size = graphics_text_layout_get_content_size(tile->texts[2], ubuntu18, GRect(bounds.origin.x, bounds.origin.y, bounds.size.w - (ACTION_BAR_WIDTH * 1.6), bounds.size.h), GTextOverflowModeFill, GTextAlignmentRight);
    mid_text_size.h *= 1.332;
    GSize down_text_size = graphics_text_layout_get_content_size(tile->texts[4], ubuntu18, GRect(bounds.origin.x, bounds.origin.y, bounds.size.w - (ACTION_BAR_WIDTH * 1.6), bounds.size.h), GTextOverflowModeFill, GTextAlignmentRight);
    down_text_size.h *= 1.332;
    uint8_t pad = PBL_IF_RECT_ELSE(5, 30);
    GEdgeInsets up_label_insets = {.top = pad  + ((up_label_bounds.size.h - (up_text_size.h)) /2), .left = ACTION_BAR_WIDTH * 0.3, .right = ACTION_BAR_WIDTH * 1.3, .bottom = -pad};
    GEdgeInsets mid_label_insets = {.top = ((mid_label_bounds.size.h - (mid_text_size.h)) /2), .left = ACTION_BAR_WIDTH * 0.3, .right = ACTION_BAR_WIDTH * 1.3 };
    GEdgeInsets down_label_insets = {.top = -pad + ((down_label_bounds.size.h - (down_text_size.h)) /2), .left = ACTION_BAR_WIDTH * 0.3, .right = ACTION_BAR_WIDTH * 1.3, .bottom = pad};

    
    // GEdgeInsets up_label_insets = {.top = bounds.size.h * .131, .right = ACTION_BAR_WIDTH * 1.3 };
    // GEdgeInsets mid_label_insets = {.top = bounds.size.h * .43, .right = ACTION_BAR_WIDTH * 1.3};
    // // 5 pixel y pad on bottom
    // GEdgeInsets down_label_insets = {.top = bounds.size.h * .728, .right = ACTION_BAR_WIDTH * 1.3};
    s_up_label_layer = text_layer_create(grect_inset(up_label_bounds, up_label_insets));
    s_mid_label_layer = text_layer_create(grect_inset(mid_label_bounds, mid_label_insets));
    s_down_label_layer = text_layer_create(grect_inset(down_label_bounds, down_label_insets));
    s_label_bounds = layer_get_frame(text_layer_get_layer(s_up_label_layer));
    text_layer_set_text(s_up_label_layer, tile->texts[0]);
    text_layer_set_text(s_mid_label_layer, tile->texts[2]);
    text_layer_set_text(s_down_label_layer, tile->texts[4]);
    text_layer_set_background_color(s_up_label_layer, GColorClear);
    text_layer_set_background_color(s_mid_label_layer, GColorClear);
    text_layer_set_background_color(s_down_label_layer, GColorClear);
    text_layer_set_text_color(s_up_label_layer, GColorWhite);
    text_layer_set_text_color(s_mid_label_layer, GColorWhite);
    text_layer_set_text_color(s_down_label_layer, GColorWhite);
    text_layer_set_text_alignment(s_up_label_layer, GTextAlignmentRight);
    text_layer_set_text_alignment(s_mid_label_layer, GTextAlignmentRight);
    text_layer_set_text_alignment(s_down_label_layer, GTextAlignmentRight);
    text_layer_set_font(s_up_label_layer, ubuntu18);
    text_layer_set_font(s_mid_label_layer, ubuntu18);
    text_layer_set_font(s_down_label_layer, ubuntu18);
    text_layer_set_overflow_mode(s_up_label_layer,GTextOverflowModeFill);
    text_layer_set_overflow_mode(s_mid_label_layer,GTextOverflowModeFill);
    text_layer_set_overflow_mode(s_down_label_layer,GTextOverflowModeFill);

    layer_add_child(window_layer, text_layer_get_layer(s_up_label_layer));
    layer_add_child(window_layer, text_layer_get_layer(s_mid_label_layer));
    layer_add_child(window_layer, text_layer_get_layer(s_down_label_layer));

    action_bar_layer_set_background_color(s_action_bar_layer, tile->highlight);
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_UP, data_icon_array_search(tile->icon_key[0]));
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_SELECT, data_icon_array_search(tile->icon_key[2]));
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_DOWN, data_icon_array_search(tile->icon_key[4]));
    
    action_bar_layer_set_click_config_provider(s_action_bar_layer, click_config_provider);
    // accel_tap_service_subscribe(tap_handler);

    action_bar_layer_add_to_window(s_action_bar_layer, window);
}


static void action_window_unload(Window *window) {
    if (s_action_window) {
        text_layer_destroy(s_up_label_layer);
        text_layer_destroy(s_mid_label_layer);
        text_layer_destroy(s_down_label_layer);

        action_bar_layer_destroy(s_action_bar_layer);
        // accel_tap_service_unsubscribe();

        window_destroy(s_action_window);
        s_action_window = NULL;
    }
}
void app_timer_callback(void *data) {
    action_window_set_color(*(uint8_t*) data);
    free(data);
}
void action_window_set_color(int type) {
    if (!s_action_window) { return; }
    light_enable_interaction();
    #ifndef PBL_COLOR
        return;
    #endif
    switch(type) {
        case 0:
            LONG_VIBE();
            window_set_background_color(s_action_window, GColorIslamicGreen);
            action_bar_layer_set_background_color(s_action_bar_layer, GColorMayGreen);
            break;
        case 1:
            LONG_VIBE();
            window_set_background_color(s_action_window, GColorFolly);
            action_bar_layer_set_background_color(s_action_bar_layer, GColorSunsetOrange);
            break;
        case 2:
            LONG_VIBE();
            window_set_background_color(s_action_window, GColorChromeYellow);
            action_bar_layer_set_background_color(s_action_bar_layer, GColorRajah);
            break;
        case -1:
            SHORT_VIBE();
            // app_timer_cancel(app_timer);
            window_set_background_color(s_action_window, (tap_toggle) ? tile->highlight : tile->color);
            action_bar_layer_set_background_color(s_action_bar_layer, (tap_toggle) ? tile->color : tile->highlight);
            break;
        default:
            window_set_background_color(s_action_window, (tap_toggle) ? tile->highlight : tile->color);
            action_bar_layer_set_background_color(s_action_bar_layer, (tap_toggle) ? tile->color : tile->highlight);
            break;
    }
    layer_mark_dirty(window_get_root_layer(s_action_window));
    layer_mark_dirty(action_bar_layer_get_layer(s_action_bar_layer));
}
void action_window_inset_highlight(ButtonId button_id) {
    GRect up_rect = layer_get_frame(text_layer_get_layer(s_up_label_layer));
    GRect mid_rect = layer_get_frame(text_layer_get_layer(s_mid_label_layer));
    GRect down_rect = layer_get_frame(text_layer_get_layer(s_down_label_layer));
    up_rect.size.w = s_label_bounds.size.w; up_rect.origin.x = s_label_bounds.origin.x;
    mid_rect.size.w = s_label_bounds.size.w; mid_rect.origin.x = s_label_bounds.origin.x;
    down_rect.size.w = s_label_bounds.size.w; down_rect.origin.x = s_label_bounds.origin.x;
    layer_set_frame(text_layer_get_layer(s_up_label_layer), up_rect);
    layer_set_frame(text_layer_get_layer(s_mid_label_layer), mid_rect);
    layer_set_frame(text_layer_get_layer(s_down_label_layer), down_rect);
    switch (button_id) {
        case BUTTON_ID_UP:
            up_rect.size.w *= .9;
            layer_set_frame(text_layer_get_layer(s_up_label_layer), up_rect);
            break;
        case BUTTON_ID_SELECT:
            mid_rect.size.w *= .9;
            layer_set_frame(text_layer_get_layer(s_mid_label_layer), mid_rect);
            break;
        case BUTTON_ID_DOWN:
            down_rect.size.w *= .9;
            layer_set_frame(text_layer_get_layer(s_down_label_layer), down_rect);
            break;
        default:
            break;
    }
    layer_mark_dirty(text_layer_get_layer(s_up_label_layer));
    layer_mark_dirty(text_layer_get_layer(s_mid_label_layer));
    layer_mark_dirty(text_layer_get_layer(s_down_label_layer));
}

void action_window_pop() {
  window_stack_remove(s_action_window, false);
  action_window_unload(s_action_window);
}

void action_window_push(Tile *current_tile, uint8_t index) {
    if (!s_action_window) {
        tile = current_tile;
        tile_index = index;
        s_action_window = window_create();
        window_set_background_color(s_action_window, tile->color);
        window_set_window_handlers(s_action_window, (WindowHandlers) {
            .load = action_window_load,
            .unload = action_window_unload,
        });

        window_stack_push(s_action_window, true);
    }

}


#include <pebble.h>

#include "c/user_interface/action_window.h"
#include "c/user_interface/loading_window.h"
#include "c/modules/data.h"
#include "c/modules/comm.h"
#include "c/modules/apng.h"
#include "c/stateful.h"
static Window *s_action_window;
static ActionBarLayer *s_action_bar_layer;
static TextLayer *s_up_label_layer, *s_mid_label_layer, *s_down_label_layer;
static GRect s_default_label_rect;
static uint8_t tap_toggle = 0;
static Tile *tile;
uint8_t action_bar_tile_index;
static GBitmap *overflow_icon;
static uint8_t s_spinner_target;
static AppTimer *s_spinner_timer = NULL;
static void action_bar_reset_spinner(bool preserve_overflow);

static uint8_t button_to_index(ButtonId id) {
    uint8_t idx;
    switch(id) {
        case BUTTON_ID_UP:
            idx = 0;
            break;
        case BUTTON_ID_SELECT:
            idx = 2;
            break;
        case BUTTON_ID_DOWN:
            idx = 4;
            break;
        default:
            idx = 0;
    }
    return idx + tap_toggle;
}

void action_window_refresh_icons() {
    if (s_action_bar_layer && window_stack_get_top_window() == s_action_window) {
        action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_UP, data_icon_array_search(tile->icon_key[button_to_index(BUTTON_ID_UP)]), true);
        action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_SELECT, data_icon_array_search(tile->icon_key[button_to_index(BUTTON_ID_SELECT)]), true);
        action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_DOWN, data_icon_array_search(tile->icon_key[button_to_index(BUTTON_ID_DOWN)]), true);
        layer_mark_dirty(action_bar_layer_get_layer(s_action_bar_layer));
    }
}

void action_window_swap_buttons() {
    if (s_spinner_timer) { app_timer_cancel(s_spinner_timer); s_spinner_timer = NULL; }
    action_bar_reset_spinner(true);
    persist_delete(PERSIST_LAST_BUTTON);
    SHORT_VIBE();
    tap_toggle = !tap_toggle;

    GRect bounds = layer_get_bounds(window_get_root_layer(s_action_window));
    GRect up_label_bounds = GRect(bounds.origin.x, bounds.origin.y, bounds.size.w, bounds.size.h / 3);
    GRect mid_label_bounds = GRect(bounds.origin.x, bounds.origin.y + (up_label_bounds.origin.y + up_label_bounds.size.h),
                                   bounds.size.w, bounds.size.h / 3);
    GRect down_label_bounds = GRect(bounds.origin.x, bounds.origin.y + (mid_label_bounds.origin.y + mid_label_bounds.size.h),
                                   bounds.size.w, bounds.size.h / 3);
    GSize up_text_size = graphics_text_layout_get_content_size(tile->texts[button_to_index(BUTTON_ID_UP)], ubuntu18, GRect(bounds.origin.x, bounds.origin.y, bounds.size.w - (ACTION_BAR_WIDTH * 1.6), bounds.size.h), GTextOverflowModeFill, GTextAlignmentRight);
    up_text_size.h *= 1.332;
    GSize mid_text_size = graphics_text_layout_get_content_size(tile->texts[button_to_index(BUTTON_ID_SELECT)], ubuntu18, GRect(bounds.origin.x, bounds.origin.y, bounds.size.w - (ACTION_BAR_WIDTH * 1.6), bounds.size.h), GTextOverflowModeFill, GTextAlignmentRight);
    mid_text_size.h *= 1.332;
    GSize down_text_size = graphics_text_layout_get_content_size(tile->texts[button_to_index(BUTTON_ID_DOWN)], ubuntu18, GRect(bounds.origin.x, bounds.origin.y, bounds.size.w - (ACTION_BAR_WIDTH * 1.6), bounds.size.h), GTextOverflowModeFill, GTextAlignmentRight);
    down_text_size.h *= 1.332;
    uint8_t pad = PBL_IF_RECT_ELSE(5, 30);
    GEdgeInsets up_label_insets = {.top = pad  + ((up_label_bounds.size.h - (up_text_size.h)) /2), .left = ACTION_BAR_WIDTH * 0.3, .right = ACTION_BAR_WIDTH * 1.3, .bottom = -pad};
    GEdgeInsets mid_label_insets = {.top = ((mid_label_bounds.size.h - (mid_text_size.h)) /2), .left = ACTION_BAR_WIDTH * 0.3, .right = ACTION_BAR_WIDTH * 1.3 };
    GEdgeInsets down_label_insets = {.top = -pad + ((down_label_bounds.size.h - (down_text_size.h)) /2), .left = ACTION_BAR_WIDTH * 0.3, .right = ACTION_BAR_WIDTH * 1.3, .bottom = pad};
    layer_set_frame(text_layer_get_layer(s_up_label_layer), grect_inset(up_label_bounds, up_label_insets));
    layer_set_frame(text_layer_get_layer(s_mid_label_layer), grect_inset(mid_label_bounds, mid_label_insets));
    layer_set_frame(text_layer_get_layer(s_down_label_layer), grect_inset(down_label_bounds, down_label_insets));
    text_layer_set_text(s_up_label_layer, tile->texts[button_to_index(BUTTON_ID_UP)]);
    text_layer_set_text(s_mid_label_layer, tile->texts[button_to_index(BUTTON_ID_SELECT)]);
    text_layer_set_text(s_down_label_layer, tile->texts[button_to_index(BUTTON_ID_DOWN)]);
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_UP, default_icon);
    action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_UP, data_icon_array_search(tile->icon_key[button_to_index(BUTTON_ID_UP)]), true);
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_DOWN, default_icon);
    action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_DOWN, data_icon_array_search(tile->icon_key[button_to_index(BUTTON_ID_DOWN)]), true);
    layer_mark_dirty(text_layer_get_layer(s_up_label_layer));
    layer_mark_dirty(text_layer_get_layer(s_mid_label_layer));
    layer_mark_dirty(text_layer_get_layer(s_down_label_layer));

    #ifdef PBL_COLOR
        GColor8 toggle_color = (!tap_toggle) ? tile->color :tile->highlight;
        GColor8 toggle_highlight = (tap_toggle) ? tile->color :tile->highlight;
        text_layer_set_text_color(s_up_label_layer, text_color_legible_over(toggle_color));
        text_layer_set_text_color(s_mid_label_layer, text_color_legible_over(toggle_color));
        text_layer_set_text_color(s_down_label_layer, text_color_legible_over(toggle_color));
        window_set_background_color(s_action_window, toggle_color);
        action_bar_layer_set_background_color(s_action_bar_layer, toggle_highlight);
        layer_mark_dirty(action_bar_layer_get_layer(s_action_bar_layer));
        layer_mark_dirty(window_get_root_layer(s_action_window));
    #endif
}

void action_window_set_color(ColorAction action) {
    if (!s_action_window) { return; }
    light_enable_interaction();
    #ifndef PBL_COLOR
        return;
    #endif
     
    GColor8 new_color, new_highlight;
    switch(action) {
        case COLOR_ACTION_GOOD:
            if (s_spinner_timer) { app_timer_cancel(s_spinner_timer); s_spinner_timer = NULL; }
            action_bar_reset_spinner(false);
            LONG_VIBE();
            new_color = GColorIslamicGreen;
            new_highlight = GColorMayGreen;
            break;
        case COLOR_ACTION_BAD:
            if (s_spinner_timer) { app_timer_cancel(s_spinner_timer); s_spinner_timer = NULL; }
            action_bar_reset_spinner(false);
            LONG_VIBE();
            new_color = GColorFolly;
            new_highlight = GColorSunsetOrange;
            break;
        case COLOR_ACTION_ERROR:
            if (s_spinner_timer) { app_timer_cancel(s_spinner_timer); s_spinner_timer = NULL; }
            action_bar_reset_spinner(false);
            LONG_VIBE();
            new_color = GColorChromeYellow;
            new_highlight = GColorRajah;
            break;
        case COLOR_ACTION_VIBRATE_RESPONSE:
            if (s_spinner_timer) { app_timer_cancel(s_spinner_timer); s_spinner_timer = NULL; }
            action_bar_reset_spinner(false);
            SHORT_VIBE();
            new_color = (tap_toggle) ? tile->highlight : tile->color;
            new_highlight = (tap_toggle) ? tile->color : tile->highlight;
            break;
        case COLOR_ACTION_VIBRATE_INIT:
            SHORT_VIBE();
            new_color = (tap_toggle) ? tile->highlight : tile->color;
            new_highlight = (tap_toggle) ? tile->color : tile->highlight;
            break;
        case COLOR_ACTION_RESET_ONLY:
            new_color = (tap_toggle) ? tile->highlight : tile->color;
            new_highlight = (tap_toggle) ? tile->color : tile->highlight;
            break;
    }

    window_set_background_color(s_action_window, new_color);
    action_bar_layer_set_background_color(s_action_bar_layer, new_highlight);
    text_layer_set_text_color(s_up_label_layer, text_color_legible_over(new_color));
    text_layer_set_text_color(s_mid_label_layer, text_color_legible_over(new_color));
    text_layer_set_text_color(s_down_label_layer, text_color_legible_over(new_color));
    layer_mark_dirty(text_layer_get_layer(s_up_label_layer));
    layer_mark_dirty(text_layer_get_layer(s_mid_label_layer));
    layer_mark_dirty(text_layer_get_layer(s_down_label_layer));
    layer_mark_dirty(window_get_root_layer(s_action_window));
    layer_mark_dirty(action_bar_layer_get_layer(s_action_bar_layer));
}

void action_window_inset_highlight(ButtonId button_id) {
    TextLayer *labels[] = {s_up_label_layer, s_mid_label_layer, s_down_label_layer};
    Layer *layer;

    for (uint8_t i=0; i < ARRAY_LENGTH(labels); i++) {
        layer = text_layer_get_layer(labels[i]);

        GRect start_rect = layer_get_frame(layer);
        start_rect.size.w = s_default_label_rect.size.w;
        start_rect.origin.x = s_default_label_rect.origin.x;

        GRect finish_rect = start_rect;
        finish_rect.size.w *= .9;
        if (button_id == i + 1 && layer_get_frame(layer).size.w != finish_rect.size.w) {
            PropertyAnimation *prop_anim = property_animation_create_layer_frame(layer, &start_rect, &finish_rect);
            Animation *anim = property_animation_get_animation(prop_anim);
            animation_set_curve(anim, AnimationCurveEaseOut);
            animation_set_duration(anim, 100);
            animation_schedule(anim);
        } else if (button_id != i + 1 && layer_get_frame(layer).size.w == finish_rect.size.w) {
            PropertyAnimation *prop_anim = property_animation_create_layer_frame(layer, &finish_rect, &start_rect);
            Animation *anim = property_animation_get_animation(prop_anim);
            animation_set_curve(anim, AnimationCurveEaseIn);
            animation_set_duration(anim, 100);
            animation_schedule(anim);
        }
    }
}

void action_bar_set_spinner(GBitmap *icon) {
    action_bar_layer_set_icon(s_action_bar_layer, s_spinner_target, icon);
    layer_mark_dirty(action_bar_layer_get_layer(s_action_bar_layer));
}

static void action_bar_reset_spinner(bool preserve_overflow) {
    s_spinner_timer = NULL;
    apng_stop_animation();
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_UP, data_icon_array_search(tile->icon_key[button_to_index(BUTTON_ID_UP)]));
    if (!preserve_overflow) { 
        action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_SELECT, data_icon_array_search(tile->icon_key[button_to_index(BUTTON_ID_SELECT)]));
    } else {
        action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_SELECT, overflow_icon);
    }
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_DOWN, data_icon_array_search(tile->icon_key[button_to_index(BUTTON_ID_DOWN)]));
}

static void action_bar_start_spinner() {
    action_bar_reset_spinner(false);
    apng_start_animation();
}

static void normal_click_callback(ClickRecognizerRef recognizer, void *ctx) {
    ButtonId button = click_recognizer_get_button_id(recognizer);
    uint8_t button_index = button_to_index(button);
    APP_LOG(APP_LOG_LEVEL_DEBUG, "button: %d, button_index: %d", (int) button, (int) button_index);
    if (strlen(tile->texts[button_index]) == 0) {
        action_window_set_color(COLOR_ACTION_RESET_ONLY);
    } else {
        s_spinner_target = button;
        s_spinner_timer = app_timer_register(200, action_bar_start_spinner, NULL);
        action_window_set_color(COLOR_ACTION_VIBRATE_INIT);
    }
    action_window_inset_highlight(button);
    comm_xhr_request(action_bar_tile_index, button_index);
}

static void mid_hold_click_down_callback(ClickRecognizerRef recognizer, void *ctx) {
    action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_SELECT, overflow_icon, true);
    app_timer_register(100, action_window_swap_buttons, NULL);
}

static void mid_hold_click_up_callback(ClickRecognizerRef recognizer, void *ctx) {
    action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_SELECT, data_icon_array_search(tile->icon_key[button_to_index(BUTTON_ID_SELECT)]), true);
}

static void back_click_callback(ClickRecognizerRef recognizer, void *ctx) {
    if (click_number_of_clicks_counted(recognizer) > 1) {
        window_stack_pop_all(true);
    } else {
        window_stack_pop(true);
    }
}

static void click_config_provider(void *ctx) {
    window_single_click_subscribe(BUTTON_ID_UP, normal_click_callback);
    window_single_click_subscribe(BUTTON_ID_SELECT, normal_click_callback);
    window_single_click_subscribe(BUTTON_ID_DOWN, normal_click_callback);

    window_long_click_subscribe(BUTTON_ID_SELECT, 250, mid_hold_click_down_callback, mid_hold_click_up_callback);
    window_multi_click_subscribe(BUTTON_ID_BACK, 1, 2, 400, true, back_click_callback);
}


static void action_window_load(Window *window) {
    apng_set_data(RESOURCE_ID_LOADING_MINI, &action_bar_set_spinner);

    Layer *window_layer = window_get_root_layer(window);
    GRect bounds = layer_get_bounds(window_layer);
    s_action_bar_layer = action_bar_layer_create();
    overflow_icon = gbitmap_create_with_resource(RESOURCE_ID_ICON_OVERFLOW);
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

    
    s_up_label_layer = text_layer_create(grect_inset(up_label_bounds, up_label_insets));
    s_mid_label_layer = text_layer_create(grect_inset(mid_label_bounds, mid_label_insets));
    s_down_label_layer = text_layer_create(grect_inset(down_label_bounds, down_label_insets));
    s_default_label_rect = layer_get_frame(text_layer_get_layer(s_up_label_layer));
    text_layer_set_text(s_up_label_layer, tile->texts[0]);
    text_layer_set_text(s_mid_label_layer, tile->texts[2]);
    text_layer_set_text(s_down_label_layer, tile->texts[4]);
    text_layer_set_background_color(s_up_label_layer, GColorClear);
    text_layer_set_background_color(s_mid_label_layer, GColorClear);
    text_layer_set_background_color(s_down_label_layer, GColorClear);
    text_layer_set_text_color(s_up_label_layer, text_color_legible_over(tile->color));
    text_layer_set_text_color(s_mid_label_layer, text_color_legible_over(tile->color));
    text_layer_set_text_color(s_down_label_layer, text_color_legible_over(tile->color));
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

    action_bar_layer_add_to_window(s_action_bar_layer, window);
}


static void action_window_unload(Window *window) {
    if (s_action_window) {
        if (s_spinner_timer) { app_timer_cancel(s_spinner_timer); s_spinner_timer = NULL; }
        apng_stop_animation();
        persist_delete(PERSIST_LAST_BUTTON);
        text_layer_destroy(s_up_label_layer);
        text_layer_destroy(s_mid_label_layer);
        text_layer_destroy(s_down_label_layer);
        if(overflow_icon) { gbitmap_destroy(overflow_icon); overflow_icon = NULL; }
        action_bar_layer_destroy(s_action_bar_layer);
        s_action_bar_layer = NULL;
        free(window_get_user_data(s_action_window));
        window_destroy(s_action_window);
        s_action_window = NULL;
    }
}

void action_window_pop() {
  window_stack_remove(s_action_window, false);
  action_window_unload(s_action_window);
}

void action_window_push(Tile *current_tile, uint8_t index) {
    if (!s_action_window) {
        tile = current_tile;
        action_bar_tile_index = index;
        s_action_window = window_create();
        window_set_background_color(s_action_window, tile->color);
        window_set_window_handlers(s_action_window, (WindowHandlers) {
            .load = action_window_load,
            .unload = action_window_unload,
        });
        window_stack_push(s_action_window, true);
    }

}


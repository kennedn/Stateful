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
static uint8_t s_tap_toggle;
static Tile *s_tile;
static uint8_t s_active_button;
static AppTimer *s_spinner_timer, *s_mid_click_timer;
static bool s_mid_button_down;
static void action_bar_reset_spinner(bool preserve_overflow);
static void action_window_reset_elements(bool select_icon);
void action_bar_set_spinner(GBitmap *icon);

static ButtonId s_last_button;
static uint8_t s_consecutive_clicks;
static uint8_t s_tile_index;
static bool s_overflow_enabled;

typedef enum {
    TILE_DATA_ICON_KEY,
    TILE_DATA_TEXT
} TileDataType;

//! Check if passed index is enabled in the current tiles mask
//! @param index An index referring to a position in the tiles element arrays
//! @return A bool representing the enabled state of the passed index
static bool tile_index_enabled(uint8_t index) {
    return (s_tile->mask >> index) & 1;
}

//! Calculates whether the overflow menu contains any enabled elements
//! @return A bool representing whether the overflow menu contains elements
static bool overflow_contains_elements() {
    for (uint8_t i=1; i < ARRAY_LENGTH(s_tile->texts); i+=2) {
        if (tile_index_enabled(i)) {
            return true;
        }
    }
    return false;
}

//! Calculates an index for icon_key or text elements in the current tile
//! @param id A ButtonId, either Up, Select or Down
//! @return A tile element index
static uint8_t tile_index_lookup(const ButtonId id) {
    return (id - 1) * 2 + s_tap_toggle;
}

//! Finds an element within the current tile
//! @param id A ButtonId, either Up, Select or Down
//! @param type Which data type to return
//! @return A pointer to an element in the current tile
static char *tile_element_lookup(const ButtonId id, const TileDataType type) {
    uint8_t idx = tile_index_lookup(id);
    switch(type) {
        case TILE_DATA_ICON_KEY:
            return s_tile->icon_key[idx];
        case TILE_DATA_TEXT:
            return s_tile->texts[idx];
        default:
            return "";
    }
}

//! Generate a unique number using parameters that would be sent in an XHR request
//! @return A unique number that incorporates current tile index, button and click count
uint32_t action_window_generate_hash() {
    return (s_tile_index << 20) | (tile_index_lookup(s_last_button) << 10) | s_consecutive_clicks;
}

//! Refreshes all icons if current window is visible, used when icon_array is modified
void action_window_refresh_icons() {
    if (!s_action_bar_layer || window_stack_get_top_window() != s_action_window) {return;}
    action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_UP, data_icon_array_search(tile_element_lookup(BUTTON_ID_UP, TILE_DATA_ICON_KEY)), true);
    if (!s_mid_button_down) {
        action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_SELECT, data_icon_array_search(tile_element_lookup(BUTTON_ID_SELECT, TILE_DATA_ICON_KEY)), true);
    } else {
        data_icon_array_search(tile_element_lookup(BUTTON_ID_SELECT, TILE_DATA_ICON_KEY));
    }
    action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_DOWN, data_icon_array_search(tile_element_lookup(BUTTON_ID_DOWN, TILE_DATA_ICON_KEY)), true);
    layer_mark_dirty(action_bar_layer_get_layer(s_action_bar_layer));
}

//! Transitions to/from the overflow menu, which exposes a different set of up to 3 buttons
static void action_window_swap_buttons() {
    if (s_spinner_timer) { app_timer_cancel(s_spinner_timer); s_spinner_timer = NULL; }
    
    s_last_button = BUTTON_ID_BACK;
    s_tap_toggle = !s_tap_toggle;

    action_window_reset_elements(!s_mid_click_timer);
    s_mid_click_timer = NULL;

    layer_mark_dirty(text_layer_get_layer(s_up_label_layer));
    layer_mark_dirty(text_layer_get_layer(s_mid_label_layer));
    layer_mark_dirty(text_layer_get_layer(s_down_label_layer));
    layer_mark_dirty(action_bar_layer_get_layer(s_action_bar_layer));
    layer_mark_dirty(window_get_root_layer(s_action_window));
}

//! Changes action window's active colors based on a provided action.
//! Called when a button is clicked or an XHR function returns
//! @param action Controls color / vibration pattern applied 
void action_window_set_color(ColorAction action) {
    if (!s_action_window) { return; }
    light_enable_interaction();

    #ifndef PBL_COLOR

    if (action == COLOR_ACTION_GOOD || action == COLOR_ACTION_BAD || action == COLOR_ACTION_ERROR) {
        if (s_spinner_timer) { app_timer_cancel(s_spinner_timer); s_spinner_timer = NULL; }
        action_bar_reset_spinner(false);
        action_bar_layer_set_icon_animated(s_action_bar_layer, s_active_button, indicator_icons[action], true);
        LONG_VIBE();
    } else if (action == COLOR_ACTION_VIBRATE_INIT) {
        SHORT_VIBE();
    }
    layer_mark_dirty(action_bar_layer_get_layer(s_action_bar_layer));

    #else

    debug(2, "s_active_button: %d, action: %d", s_active_button, action);
    if (action == COLOR_ACTION_GOOD || action == COLOR_ACTION_BAD || action == COLOR_ACTION_ERROR) {
        if (s_spinner_timer) { app_timer_cancel(s_spinner_timer); s_spinner_timer = NULL; }
        action_bar_reset_spinner(false);
        action_bar_layer_set_icon_animated(s_action_bar_layer, s_active_button, indicator_icons[action], true);
        LONG_VIBE();
    } 

    GColor8 new_color, new_highlight;
    switch(action) {
        case COLOR_ACTION_GOOD:
            new_color = GColorIslamicGreen;
            new_highlight = GColorMayGreen;
            break;
        case COLOR_ACTION_BAD:
            new_color = GColorFolly;
            new_highlight = GColorSunsetOrange;
            break;
        case COLOR_ACTION_ERROR:
            new_color = GColorChromeYellow;
            new_highlight = GColorRajah;
            break;

        case COLOR_ACTION_VIBRATE_RESPONSE:
            if (s_spinner_timer) { app_timer_cancel(s_spinner_timer); s_spinner_timer = NULL; }
            action_bar_reset_spinner(false);
        case COLOR_ACTION_VIBRATE_INIT:
            SHORT_VIBE();
        case COLOR_ACTION_RESET_ONLY:
            new_color = (s_tap_toggle) ? s_tile->highlight : s_tile->color;
            new_highlight = (s_tap_toggle) ? s_tile->color : s_tile->highlight;
            break;
    }

    window_set_background_color(s_action_window, new_color);
    action_bar_layer_set_background_color(s_action_bar_layer, new_highlight);
    GColor8 text_color;
    text_color_legible_over_bg(&new_color, &text_color);
    bool bg_exceeds_threshold = text_color_legible_over_bg(&new_highlight, NULL);
    apng_stop_animation();
    apng_set_data((bg_exceeds_threshold) ? RESOURCE_ID_LOADING_MINI_BLACK : RESOURCE_ID_LOADING_MINI, &action_bar_set_spinner);
    text_layer_set_text_color(s_up_label_layer, text_color);
    text_layer_set_text_color(s_mid_label_layer, text_color);
    text_layer_set_text_color(s_down_label_layer, text_color);

    layer_mark_dirty(text_layer_get_layer(s_up_label_layer));
    layer_mark_dirty(text_layer_get_layer(s_mid_label_layer));
    layer_mark_dirty(text_layer_get_layer(s_down_label_layer));
    layer_mark_dirty(window_get_root_layer(s_action_window));
    layer_mark_dirty(action_bar_layer_get_layer(s_action_bar_layer));
    #endif
}

//! Drives label animations, called on the back of button clicks
//! @param button_id The button that triggered the call
void action_window_inset_highlight(ButtonId button_id) {
    TextLayer *labels[] = {s_up_label_layer, s_mid_label_layer, s_down_label_layer};
    Layer *layer;

    for (uint8_t i=0; i < ARRAY_LENGTH(labels); i++) {
        layer = text_layer_get_layer(labels[i]);

        GRect frame = layer_get_frame(layer);
        GRect start_rect = frame;
        start_rect.size.w = s_default_label_rect.size.w;
        start_rect.origin.x = s_default_label_rect.origin.x;

        GRect finish_rect = start_rect;
        finish_rect.origin.x -= finish_rect.size.w * 0.1;

        PropertyAnimation *prop_anim = NULL;
        if (button_id == i + 1 && frame.origin.x != finish_rect.origin.x) {
            prop_anim = property_animation_create_layer_frame(layer, &start_rect, &finish_rect);
        } else if (button_id != i + 1 && frame.origin.x == finish_rect.origin.x) {
            prop_anim = property_animation_create_layer_frame(layer, &finish_rect, &start_rect);
        } else if (button_id == i + 1) {
            start_rect = finish_rect;
            start_rect.origin.x -= start_rect.size.w * .05;
            prop_anim = property_animation_create_layer_frame(layer, &start_rect, &finish_rect);
        }
        if (prop_anim) {
            Animation *anim = property_animation_get_animation(prop_anim);
            animation_set_curve(anim, AnimationCurveEaseOut);
            animation_set_duration(anim, 100);
            animation_schedule(anim);
        }
    }
}

//! apng module callback, assigns animation data to last clicked button every frame
//! @param icon A bitmap image representing a frame in an ongoing animation
void action_bar_set_spinner(GBitmap *icon) {
    action_bar_layer_set_icon(s_action_bar_layer, s_active_button, icon);
    layer_mark_dirty(action_bar_layer_get_layer(s_action_bar_layer));
}

//! apng helper function, stops animation and resets all icons to pre-animation state
//! @param preserve_overflow Stops clobbering of select buttons long press transition
static void action_bar_reset_spinner(bool preserve_overflow) {
    apng_stop_animation();
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_UP, data_icon_array_search(tile_element_lookup(BUTTON_ID_UP, TILE_DATA_ICON_KEY)));
    if (!preserve_overflow) { 
        action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_SELECT, data_icon_array_search(tile_element_lookup(BUTTON_ID_SELECT, TILE_DATA_ICON_KEY)));
    }
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_DOWN, data_icon_array_search(tile_element_lookup(BUTTON_ID_DOWN, TILE_DATA_ICON_KEY)));
}

//! apng helper function, resets icons and starts apng animation afresh
static void action_bar_start_spinner() {
    s_spinner_timer = NULL;
    action_bar_reset_spinner(false);
    apng_start_animation();
}

//! Callback for all short button clicks, starts spinner animation and asks pebblekit
//! to perform an XHR request
//! @param recognizer The click recognizer that detected a "click" pattern
//! @param context Pointer to application specified data 
static void normal_click_callback(ClickRecognizerRef recognizer, void *ctx) {
    ButtonId button = click_recognizer_get_button_id(recognizer);
    uint8_t button_index = tile_index_lookup(button);
    if (!tile_index_enabled(button_index)) {return;}

    if (button == s_last_button) {
        s_consecutive_clicks++;
    } else {
        s_consecutive_clicks = 0;
    }
    s_active_button = button;
    #ifdef PBL_COLOR
    s_spinner_timer = app_timer_register(200, action_bar_start_spinner, NULL);
    #else
    action_bar_reset_spinner(false);
    #endif
    action_window_set_color(COLOR_ACTION_VIBRATE_INIT);
    action_window_inset_highlight(button);
    comm_xhr_request(s_tile_index, button_index, s_consecutive_clicks);
    s_last_button = button;
}

//! Select long press callback, display overflow icon and then switches to/from overflow after delay 
//! @param recognizer The click recognizer that detected a "click" pattern
//! @param context Pointer to application specified data 
static void mid_hold_click_down_callback(ClickRecognizerRef recognizer, void *ctx) {
    s_mid_button_down = true;
    action_bar_reset_spinner(true);
    action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_SELECT, indicator_icons[3], true);
    if (!s_overflow_enabled) {return;}
    OVERFLOW_VIBE();
    s_mid_click_timer = app_timer_register(200, action_window_swap_buttons, NULL);
}

//! Select long press released callback, replaces overflow icon with proper icon
//! @param recognizer The click recognizer that detected a "click" pattern
//! @param context Pointer to application specified data 
static void mid_hold_click_up_callback(ClickRecognizerRef recognizer, void *ctx) {
    if (!s_mid_click_timer) {
        action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_SELECT, data_icon_array_search(tile_element_lookup(BUTTON_ID_SELECT, TILE_DATA_ICON_KEY)), true);
    }
    s_mid_click_timer = NULL;
    s_mid_button_down = false;
}

//! Back click callback, exits app completly, skipping menu_window, if double click is detected
//! @param recognizer The click recognizer that detected a "click" pattern
//! @param context Pointer to application specified data 
static void back_click_callback(ClickRecognizerRef recognizer, void *ctx) {
    if (click_number_of_clicks_counted(recognizer) > 1) {
        if (DEBUG >= 1) {
            comm_refresh_request();
            data_clear_persist();
        }
        window_stack_pop_all(true);
    } else {
        window_stack_pop(true);
    }
}

static void click_config_provider(void *ctx) {
    window_single_click_subscribe(BUTTON_ID_UP, normal_click_callback);
    window_single_click_subscribe(BUTTON_ID_SELECT, normal_click_callback);
    window_single_click_subscribe(BUTTON_ID_DOWN, normal_click_callback);
    window_long_click_subscribe(BUTTON_ID_SELECT, 350, mid_hold_click_down_callback, mid_hold_click_up_callback);
    window_multi_click_subscribe(BUTTON_ID_BACK, 1, 2, 250, true, back_click_callback);
}

//! Resets texts, icons, positions and colours
//! @param select_icon Stops clobbering of select buttons long press transition
static void action_window_reset_elements(bool select_icon) {
    Layer *window_layer = window_get_root_layer(s_action_window);
    GRect bounds = layer_get_bounds(window_layer);

    int16_t y_pad = PBL_IF_RECT_ELSE(5, 20);
    int16_t left_pad = ACTION_BAR_WIDTH * 0.7;
    int16_t right_pad = ACTION_BAR_WIDTH * 1.3;
    GRect up_label_bounds = GRect(bounds.origin.x, bounds.origin.y, bounds.size.w, bounds.size.h / 3);
    GRect mid_label_bounds = GRect(bounds.origin.x, bounds.origin.y + (up_label_bounds.origin.y + up_label_bounds.size.h),
                                   bounds.size.w, bounds.size.h / 3);
    GRect down_label_bounds = GRect(bounds.origin.x, bounds.origin.y + (mid_label_bounds.origin.y + mid_label_bounds.size.h),
                                   bounds.size.w, bounds.size.h / 3);

    // Magic value used as pebble height calculations are not accurate for custom font
    int16_t up_text_height = 1.332 * graphics_text_layout_get_content_size(tile_element_lookup(BUTTON_ID_UP, TILE_DATA_TEXT), ubuntu18, GRect(bounds.origin.x, bounds.origin.y, bounds.size.w - (left_pad + right_pad), bounds.size.h), GTextOverflowModeFill, GTextAlignmentRight).h;
    int16_t mid_text_height = 1.332 * graphics_text_layout_get_content_size(tile_element_lookup(BUTTON_ID_SELECT, TILE_DATA_TEXT), ubuntu18, GRect(bounds.origin.x, bounds.origin.y, bounds.size.w - (left_pad + right_pad), bounds.size.h), GTextOverflowModeFill, GTextAlignmentRight).h;
    int16_t down_text_height = 1.332 * graphics_text_layout_get_content_size(tile_element_lookup(BUTTON_ID_DOWN, TILE_DATA_TEXT), ubuntu18, GRect(bounds.origin.x, bounds.origin.y, bounds.size.w - (left_pad + right_pad), bounds.size.h), GTextOverflowModeFill, GTextAlignmentRight).h;

    GEdgeInsets up_label_insets = {.top = y_pad  + ((up_label_bounds.size.h - (up_text_height)) /2), .left = left_pad, .right = right_pad, .bottom = -y_pad};
    GEdgeInsets mid_label_insets = {.top = ((mid_label_bounds.size.h - (mid_text_height)) /2), .left = left_pad, .right = right_pad };
    GEdgeInsets down_label_insets = {.top = -y_pad + ((down_label_bounds.size.h - (down_text_height)) /2), .left = left_pad, .right = right_pad, .bottom = y_pad};
    layer_set_frame(text_layer_get_layer(s_up_label_layer), grect_inset(up_label_bounds, up_label_insets));
    layer_set_frame(text_layer_get_layer(s_mid_label_layer), grect_inset(mid_label_bounds, mid_label_insets));
    layer_set_frame(text_layer_get_layer(s_down_label_layer), grect_inset(down_label_bounds, down_label_insets));
    s_default_label_rect = layer_get_frame(text_layer_get_layer(s_up_label_layer));

    text_layer_set_text(s_up_label_layer, tile_element_lookup(BUTTON_ID_UP, TILE_DATA_TEXT));
    text_layer_set_text(s_mid_label_layer, tile_element_lookup(BUTTON_ID_SELECT, TILE_DATA_TEXT));
    text_layer_set_text(s_down_label_layer, tile_element_lookup(BUTTON_ID_DOWN, TILE_DATA_TEXT));

    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_UP, indicator_icons[ICON_DEFAULT]);
    action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_UP, data_icon_array_search(tile_element_lookup(BUTTON_ID_UP, TILE_DATA_ICON_KEY)), true);
    action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_DOWN, indicator_icons[ICON_DEFAULT]);
    action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_DOWN, data_icon_array_search(tile_element_lookup(BUTTON_ID_DOWN, TILE_DATA_ICON_KEY)), true);

    // Disable animations for button if not enabled, neglecting BUTTON_ID_SELECT as it needs animations for longpress
    action_bar_layer_set_icon_press_animation(s_action_bar_layer, BUTTON_ID_UP, (tile_index_enabled(tile_index_lookup(BUTTON_ID_UP))) ? ActionBarLayerIconPressAnimationMoveLeft : ActionBarLayerIconPressAnimationNone);
    action_bar_layer_set_icon_press_animation(s_action_bar_layer, BUTTON_ID_DOWN, (tile_index_enabled(tile_index_lookup(BUTTON_ID_DOWN))) ? ActionBarLayerIconPressAnimationMoveLeft : ActionBarLayerIconPressAnimationNone);
    if (select_icon) {
        action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_SELECT, indicator_icons[ICON_DEFAULT]);
        action_bar_layer_set_icon_animated(s_action_bar_layer, BUTTON_ID_SELECT, data_icon_array_search(tile_element_lookup(BUTTON_ID_SELECT, TILE_DATA_ICON_KEY)), true);
    }
    GColor8 toggle_color = (!s_tap_toggle) ? s_tile->color :s_tile->highlight;
    GColor8 toggle_highlight = (s_tap_toggle) ? s_tile->color :s_tile->highlight;
    GColor8 text_color;
    text_color_legible_over_bg(&toggle_color, &text_color);
    bool bg_exceeds_threshold = text_color_legible_over_bg(&toggle_highlight, NULL);
    apng_stop_animation();
    apng_set_data((bg_exceeds_threshold) ? RESOURCE_ID_LOADING_MINI_BLACK : RESOURCE_ID_LOADING_MINI, &action_bar_set_spinner);
    text_layer_set_text_color(s_up_label_layer, text_color);
    text_layer_set_text_color(s_mid_label_layer, text_color);
    text_layer_set_text_color(s_down_label_layer, text_color);
    window_set_background_color(s_action_window, toggle_color);
    action_bar_layer_set_background_color(s_action_bar_layer, toggle_highlight);
}  

static void action_window_load(Window *window) {
    GColor8 text_color;
    text_color_legible_over_bg(&(s_tile->color), &text_color);
    bool bg_exceeds_threshold = text_color_legible_over_bg(&(s_tile->highlight), NULL);
    apng_set_data((bg_exceeds_threshold) ? RESOURCE_ID_LOADING_MINI_BLACK : RESOURCE_ID_LOADING_MINI, &action_bar_set_spinner);
    s_overflow_enabled = overflow_contains_elements();
    Layer *window_layer = window_get_root_layer(window);
    s_action_bar_layer = action_bar_layer_create();
    s_tap_toggle = 0;
    s_spinner_timer = NULL;
    s_active_button = 0;
    s_up_label_layer = text_layer_create(GRectZero);
    s_mid_label_layer = text_layer_create(GRectZero);
    s_down_label_layer = text_layer_create(GRectZero);
    text_layer_set_text(s_up_label_layer, s_tile->texts[0]);
    text_layer_set_text(s_mid_label_layer, s_tile->texts[2]);
    text_layer_set_text(s_down_label_layer, s_tile->texts[4]);
    text_layer_set_background_color(s_up_label_layer, GColorClear);
    text_layer_set_background_color(s_mid_label_layer, GColorClear);
    text_layer_set_background_color(s_down_label_layer, GColorClear);
    text_layer_set_text_color(s_up_label_layer, text_color);
    text_layer_set_text_color(s_mid_label_layer, text_color);
    text_layer_set_text_color(s_down_label_layer, text_color);
    text_layer_set_text_alignment(s_up_label_layer, GTextAlignmentRight);
    text_layer_set_text_alignment(s_mid_label_layer, GTextAlignmentRight);
    text_layer_set_text_alignment(s_down_label_layer, GTextAlignmentRight);
    text_layer_set_font(s_up_label_layer, ubuntu18);
    text_layer_set_font(s_mid_label_layer, ubuntu18);
    text_layer_set_font(s_down_label_layer, ubuntu18);
    text_layer_set_overflow_mode(s_up_label_layer,GTextOverflowModeFill);
    text_layer_set_overflow_mode(s_mid_label_layer,GTextOverflowModeFill);
    text_layer_set_overflow_mode(s_down_label_layer,GTextOverflowModeFill);

    action_window_reset_elements(true);

    layer_add_child(window_layer, text_layer_get_layer(s_up_label_layer));
    layer_add_child(window_layer, text_layer_get_layer(s_mid_label_layer));
    layer_add_child(window_layer, text_layer_get_layer(s_down_label_layer));
    action_bar_layer_set_click_config_provider(s_action_bar_layer, click_config_provider);
    action_bar_layer_add_to_window(s_action_bar_layer, window);
}


static void action_window_unload(Window *window) {
    if (s_action_window) {
        if (s_spinner_timer) { app_timer_cancel(s_spinner_timer); s_spinner_timer = NULL; }
        if (s_mid_click_timer) { app_timer_cancel(s_mid_click_timer); s_mid_click_timer = NULL; }
        apng_stop_animation();
        s_last_button = BUTTON_ID_BACK;
        text_layer_destroy(s_up_label_layer);
        text_layer_destroy(s_mid_label_layer);
        text_layer_destroy(s_down_label_layer);
        action_bar_layer_destroy(s_action_bar_layer);
        s_action_bar_layer = NULL;
        free(window_get_user_data(s_action_window));
        window_destroy(s_action_window);
        s_action_window = NULL;
    }
}

void action_window_push(Tile *current_tile, uint8_t index) {
    if (!s_action_window) {
        s_tile = current_tile;
        s_tile_index = index;
        s_action_window = window_create();
        window_set_background_color(s_action_window, s_tile->color);
        window_set_window_handlers(s_action_window, (WindowHandlers) {
            .load = action_window_load,
            .unload = action_window_unload,
        });
        window_stack_push(s_action_window, true);
    }

}


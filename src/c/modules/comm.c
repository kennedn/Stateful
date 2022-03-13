#include "c/modules/comm.h"
#include "c/modules/data.h"
#include "c/user_interface/action_window.h"
#include "c/user_interface/menu_window.h"
#include "c/stateful.h"
#include "c/user_interface/loading_window.h"
static uint8_t *s_raw_data;
static AppTimer *s_icon_retry_timer, *s_tile_retry_timer, *s_ready_timer;
static bool s_data_transfer_lock = false;
static bool s_clay_needs_config = false;
static bool s_is_ready = false;
static int s_outbox_attempts = 0;
static bool s_fast_menu = true;
static uint8_t s_session_id = 0;
static void comm_bluetooth_event(bool connected);


//! Designed to hold parameter data for comm_icon_request calls
typedef struct {
  char icon_key[9];
  uint8_t icon_index;
} RetryTimerData;

//! Designed to hold parameter data for comm_xhr_request calls
typedef struct {
  uint8_t index;
  uint8_t button;
  uint8_t clicks;
} XHRTimerData;

//! Constructs a raw uint8_t array from multiple chunks and passes output to a
//! parsing function based on transfer_type
//! @param dict The dictionary iterator which contains a chunk of data
//! @param data A global pointer which will be used as a reference for data storage
//! @param transfer_type Enum which denotes the parsing function to be called after construction.
void process_data(DictionaryIterator *dict, uint8_t **data, uint8_t transfer_type) {
    // Malloc a new array if dict contains the first chunk
    Tuple *size_t = dict_find(dict, MESSAGE_KEY_TransferLength);
    if(size_t) {
      int size = size_t->value->int32;
      *data = (uint8_t*) malloc(size * sizeof(uint8_t));
    }

    // Append chunk to data if dict contains a subsequent chunk
    Tuple *chunk_t = dict_find(dict, MESSAGE_KEY_TransferChunk);
    if(chunk_t) {
      uint8_t *chunk_data = chunk_t->value->data;

      Tuple *chunk_size_t = dict_find(dict, MESSAGE_KEY_TransferChunkLength);
      int chunk_size = chunk_size_t->value->int32;
      Tuple *index_t = dict_find(dict, MESSAGE_KEY_TransferIndex);
      int index = index_t->value->int32;

      memcpy(&(*data)[index], chunk_data, chunk_size);
    }

    // If dict contains last chunk, call the relevant parsing function, then 
    // free data and release transfer lock
    Tuple *complete_t = dict_find(dict, MESSAGE_KEY_TransferComplete);
    if(complete_t) {
      switch(transfer_type) {
        case TRANSFER_TYPE_ICON:
          data_icon_array_add_icon(*data, -1);
        break;
        case TRANSFER_TYPE_TILE:
          data_tile_array_pack_tiles(*data, complete_t->value->int32);
        break;
      }
      free(*data);
      *data = NULL;
      s_data_transfer_lock = false;
    }
}

//! Handle Javascript inbound communication
//! @param dict A dictionary iterator containing any sent keys from JS side
//! @param context Pointer to any application specific data
static void inbox(DictionaryIterator *dict, void *context) {
    Tuple *type_t = dict_find(dict, MESSAGE_KEY_TransferType);
    Tuple *color_t = dict_find(dict, MESSAGE_KEY_Color);
    Tuple *hash_t = dict_find(dict, MESSAGE_KEY_Hash);
    Tuple *session_t = dict_find(dict, MESSAGE_KEY_Session);
    switch(type_t->value->int32) {
      case TRANSFER_TYPE_ICON:
        if (!session_t || session_t->value->uint8 != s_session_id) {debug(1, "Rejecting icon chunk due to session ID mismatch(%d)", (int)session_t->value->uint8); return;}
        debug(2, "Received icon chunk, free bytes: %dB", heap_bytes_free());
        process_data(dict, &s_raw_data, TRANSFER_TYPE_ICON);
        break;
      case TRANSFER_TYPE_TILE:
        if (!session_t || session_t->value->uint8 != s_session_id) {debug(1, "Rejecting tile chunk due to session ID mismatch (%d)", (int)session_t->value->uint8); return;}
        debug(2, "Received tile chunk, free bytes: %dB", heap_bytes_free());
        s_clay_needs_config = false;
        process_data(dict, &s_raw_data, TRANSFER_TYPE_TILE);
        break;
      case TRANSFER_TYPE_XHR:
        break;
      case TRANSFER_TYPE_COLOR:
        debug(1, "Received color change request");
        if (color_t && hash_t) { 
          // Verifies that this color request was initiated by the last button to be clicked
          uint32_t js_hash = hash_t->value->uint32;
          uint32_t origin_hash = action_window_generate_hash();

          debug(2, "Calced hash: %d, JS hash: %d, Result: %s", 
                (int) origin_hash, (int) js_hash, (origin_hash == js_hash) ? "Accepted" : "Rejected");

          if (origin_hash == js_hash) {
            action_window_set_color((ColorAction) color_t->value->uint8);
          }
        }
        break;
      case TRANSFER_TYPE_ERROR:
        debug(1, "Received error");
        break;
      case TRANSFER_TYPE_ACK:
        debug(1, "Received acknowledge");
        break;
      case TRANSFER_TYPE_READY:
        debug(1, "Pebblekit environment ready, session id: %d", (int)s_session_id);
        s_is_ready = true;
        if (!tile_array && s_raw_data) {free(s_raw_data); s_raw_data = NULL;}
        if (!tile_array && !data_retrieve_persist()) { 
          comm_tile_request(); 
        }
        break;
      case TRANSFER_TYPE_NO_CLAY:
        debug(1, "No clay config present");
        if(!s_clay_needs_config) {
          s_clay_needs_config = true;
          data_clear_persist();
          window_stack_pop_all(true);
          loading_window_push("No tiles configured in watch app");
        }
        break;
      case TRANSFER_TYPE_REFRESH:
        data_clear_persist();
        comm_bluetooth_event(true);
        break;
    }
}

//! AppTimer callback function, reattempts a comm_icon_request call
//! @param data Void cast RetryTimerData struct, contains parameter data to pass to function
void icon_retry_timer_callback(void *data) {
  RetryTimerData *timerData = (RetryTimerData*) data;
  comm_icon_request(timerData->icon_key, timerData->icon_index);
  free(data);
}

//! AppTimer callback function, reattempts a comm_xhr_request call
//! @param data Void cast RetryXHRData struct, contains parameter data to pass to function
void xhr_timer_callback(void *data) {
  XHRTimerData *timerData = (XHRTimerData*) data;
  comm_xhr_request(timerData->index, timerData->button, timerData->clicks);
  free(data);
}


//! AppTimer callback function, sends a READY request to JS side on repeat until
//! tile_array has been created. This ensures that tile data gets sent when the
//! initial READY response was missed.
//! @param data NULL pointer
void comm_ready_callback(void *data) {
  if (s_clay_needs_config) {
    s_ready_timer = NULL;
    return;
  }

  if (!s_is_ready) {
    if (s_outbox_attempts == 3) {
      data_free(true);
      window_stack_pop_all(true);
      loading_window_push(NULL);
    }
    DictionaryIterator *dict;
    uint32_t result = app_message_outbox_begin(&dict);
    debug(2, "Ready result: %d", (int)result);
    if (result == APP_MSG_OK) {
      s_session_id++;
      dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_READY);
      dict_write_end(dict);
      app_message_outbox_send();
    }
    s_outbox_attempts = MIN(30, s_outbox_attempts + 1);
    debug(2, "Not ready, waiting %d ms", RETRY_READY_TIMEOUT * s_outbox_attempts);
    s_ready_timer = app_timer_register(RETRY_READY_TIMEOUT * s_outbox_attempts, comm_ready_callback, NULL);
  } else {
    s_ready_timer = NULL;
  }
}

//! Asks pebblekit to find and send an icon based on a hash value (icon_key)
//! @param icon_key An 8 character SHA1 hash of a png icon or an internal resource id
//! @param icon_index The location in icon_array that this icon should be inserted at
void comm_icon_request(char* icon_key, uint8_t icon_index) {
    bool retry = true;
    s_icon_retry_timer = NULL;
    if (!s_data_transfer_lock && s_is_ready) {
      DictionaryIterator *dict;
      uint32_t result = app_message_outbox_begin(&dict);
      if (result == APP_MSG_OK) {
        retry = false;
        s_data_transfer_lock = true;
        dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_ICON);
        dict_write_uint8(dict, MESSAGE_KEY_Session, s_session_id);
        dict_write_uint8(dict, MESSAGE_KEY_IconIndex, icon_index);
        dict_write_cstring(dict, MESSAGE_KEY_IconKey, icon_key);
        dict_write_end(dict);
        app_message_outbox_send();
      } 
    } 

    if (retry) {
      // data transfer is in-flight (locked), create a timer to re-attempt the call in a bit
      RetryTimerData *retry_data = malloc(sizeof(RetryTimerData));
      retry_data->icon_index = icon_index;
      strncpy(retry_data->icon_key, icon_key, ARRAY_LENGTH(retry_data->icon_key));
      s_icon_retry_timer = app_timer_register(100, icon_retry_timer_callback, (void*) retry_data);
    }

}

//! Asks pebblekit to send tile data
void comm_tile_request() {
    bool retry = true;
    s_tile_retry_timer = NULL;
    if (!s_data_transfer_lock) {
      DictionaryIterator *dict;
      uint32_t result = app_message_outbox_begin(&dict);
      if (result == APP_MSG_OK) {
        retry = false;
        s_data_transfer_lock = true;
        dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_TILE);
        dict_write_uint8(dict, MESSAGE_KEY_Session, s_session_id);
        dict_write_end(dict);
        app_message_outbox_send();
      } 
    } else {
      retry = false;
    }

    if (retry) {
      s_tile_retry_timer = app_timer_register(100, comm_tile_request, NULL);
    }
}

//! Asks pebblekit to perform an XHR request, this is looked up JS side based on tile index
//! and button pressed
//! @param tile_index The index of the calling tile within tile_array
//! @param button_index The index of the button that was pressed to trigger this call
//! @param consecutive_clicks The number of times this same button has been clicked previously
void comm_xhr_request(uint8_t tile_index, uint8_t button_index, uint8_t consecutive_clicks) {
    DictionaryIterator *dict;
    bool retry = true;
    if (s_is_ready) {
      uint32_t result = app_message_outbox_begin(&dict);
      if (result == APP_MSG_OK) {
        retry = false;
        dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_XHR);
        dict_write_uint8(dict, MESSAGE_KEY_RequestIndex, tile_index);
        dict_write_uint8(dict, MESSAGE_KEY_RequestButton, button_index);
        dict_write_uint8(dict, MESSAGE_KEY_RequestClicks, consecutive_clicks);
        dict_write_end(dict);
        app_message_outbox_send();
      } 
    }

    if (retry) {
      // Comms failed for some reason, create a timer to re-attempt the call in a bit
      XHRTimerData *xhr_data = malloc(sizeof(XHRTimerData));
      xhr_data->index = tile_index;
      xhr_data->button = button_index;
      xhr_data->clicks = consecutive_clicks;
      s_icon_retry_timer = app_timer_register(500, xhr_timer_callback, (void*) xhr_data);
    }
}

//! Asks pebblekit to perform a refresh, this will clear down localstorage
//! @param data NULL pointer
void comm_refresh_request(void *data) {
    DictionaryIterator *dict;
    uint32_t result = app_message_outbox_begin(&dict);
    debug(2, "Refresh result: %d", (int)result);
    if (result == APP_MSG_OK) {
      dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_REFRESH);
      dict_write_end(dict);
      app_message_outbox_send();
    }
}

//! Resets all data and locks, kicks off a callback loop that awaits a pebblekit ready message
//! @param fast_menu Immediately retrieve tile data from storage without waiting
//! for pebblekit ready message
void comm_callback_start() {
  data_free(true);
  s_is_ready = false;
  s_data_transfer_lock = false;
  s_clay_needs_config = false;
  s_outbox_attempts = 0;
  if (s_icon_retry_timer) {app_timer_cancel(s_icon_retry_timer);}
  if (s_tile_retry_timer) {app_timer_cancel(s_tile_retry_timer);}
  if (s_ready_timer) {app_timer_cancel(s_ready_timer);}
  s_tile_retry_timer = NULL;
  s_icon_retry_timer = NULL;
  s_ready_timer = NULL;
  if(s_fast_menu) { 
    s_fast_menu = false;
    data_retrieve_persist();
  }
  app_timer_register(RETRY_READY_TIMEOUT, comm_ready_callback, NULL);
}


//! Callback function for pebble connectivity events
//! @param connected Connection state of pebble
static void comm_bluetooth_event(bool connection_state) {
  debug(1, "Connection state changed to %u", connection_state);
  if (connection_state) {
    window_stack_pop_all(true);
    loading_window_push(NULL);

    // comm_callback_start had the ability to call data_retrieve_persist. Calling this function too early
    // causes undocumented behaviour in the SDK. Using app_timer_register delays enough to work around this. 
    app_timer_register(0, comm_callback_start, NULL);
  } else if(!connection_state) {
    window_stack_pop_all(true);
    loading_window_push("No connection to phone");
  }
}

//! Initialise AppMessage, timers and icon_array
void comm_init() {
  s_ready_timer = NULL;
  s_icon_retry_timer = NULL;
  s_tile_retry_timer = NULL;
  data_free(true);
  app_message_register_inbox_received(inbox);

  app_message_open(INBOX_SIZE, OUTBOX_SIZE);

  connection_service_subscribe((ConnectionHandlers) {
    .pebble_app_connection_handler = comm_bluetooth_event,
    .pebblekit_connection_handler = comm_bluetooth_event
  });
  comm_bluetooth_event(connection_service_peek_pebble_app_connection());
}

//! Deinitialise  AppMesage, timers, arrays and any left over data
void comm_deinit() {
  connection_service_unsubscribe();
  app_message_deregister_callbacks();
  if (s_raw_data) { free(s_raw_data);}
  data_free(false);
  if (s_icon_retry_timer) {app_timer_cancel(s_icon_retry_timer);}
  if (s_tile_retry_timer) {app_timer_cancel(s_tile_retry_timer);}
  if (s_ready_timer) {app_timer_cancel(s_ready_timer);}
  s_ready_timer = NULL;
  s_icon_retry_timer = NULL;
  s_tile_retry_timer = NULL;
}

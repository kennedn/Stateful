#include "c/modules/comm.h"
#include "c/modules/data.h"
#include "c/user_interface/action_window.h"
#include "c/user_interface/menu_window.h"
#include "c/stateful.h"
#include "c/user_interface/loading_window.h"
static uint8_t *raw_data;
static AppTimer *s_retry_timer, *s_ready_timer;
static bool data_transfer_lock = false;
static bool clay_needs_config = false;
static bool is_ready = false;
static int outbox_attempts = 0;
//! Designed to hold parameter data for comm_icon_request calls
typedef struct {
  char icon_key[9];
  uint8_t icon_index;
} RetryTimerData;

//! Designed to hold parameter data for comm_xhr_request calls
typedef struct {
  uint8_t index;
  uint8_t button;
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
          data_icon_array_add_icon(*data);
        break;
        case TRANSFER_TYPE_TILE:
          data_tile_array_pack_tiles(*data, complete_t->value->int32);
        break;
      }
      free(*data);
      *data = NULL;
      data_transfer_lock = false;
      #if DEBUG > 0
      APP_LOG(APP_LOG_LEVEL_DEBUG, "Transfer complete, free bytes: %d", heap_bytes_free());
      #endif
      
    }
}

//! Handle Javascript inbound communication
//! @param dict A dictionary iterator containing any sent keys from JS side
//! @param context Pointer to any application specific data
static void inbox(DictionaryIterator *dict, void *context) {
    Tuple *type_t = dict_find(dict, MESSAGE_KEY_TransferType);
    Tuple *color_t = dict_find(dict, MESSAGE_KEY_Color);
    switch(type_t->value->int32) {
      case TRANSFER_TYPE_ICON:
        #if DEBUG > 0
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received icon chunk");
        #endif
        process_data(dict, &raw_data, TRANSFER_TYPE_ICON);
        break;
      case TRANSFER_TYPE_TILE:
        #if DEBUG > 0
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received tile chunk");
        #endif
        clay_needs_config = false;
        process_data(dict, &raw_data, TRANSFER_TYPE_TILE);
        break;
      case TRANSFER_TYPE_XHR:
        break;
      case TRANSFER_TYPE_COLOR:
        if (color_t) { action_window_set_color(color_t->value->int32); }
        break;
      case TRANSFER_TYPE_ERROR:
        #if DEBUG > 0
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received Error");
        #endif

        break;
      case TRANSFER_TYPE_ACK:
        #if DEBUG > 0
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received acknowledge");
        #endif
        break;
      case TRANSFER_TYPE_READY:
        #if DEBUG > 0
        APP_LOG(APP_LOG_LEVEL_DEBUG, "JS Environment Ready");
        #endif
        is_ready = true;
        if (!tile_array) { 
          comm_tile_request(); 
        } else {
          menu_window_push();
        }
        break;
      case TRANSFER_TYPE_NO_CLAY:
        #if DEBUG > 0
        APP_LOG(APP_LOG_LEVEL_DEBUG, "No clay config present");
        #endif
        if(!clay_needs_config) {
          clay_needs_config = true;
          loading_window_pop();
          loading_window_push("No tiles configured in watch app");
        }
        break;
      case TRANSFER_TYPE_REFRESH:
        data_clear_persist();
        pebblekit_connection_callback(true);
        break;
    }
}

//! AppTimer callback function, reattempts a comm_icon_request call
//! @param data Void cast RetryTimerData struct, contains parameter data to pass to function
void retry_timer_callback(void *data) {
  RetryTimerData *timerData = (RetryTimerData*) data;
  comm_icon_request(timerData->icon_key, timerData->icon_index);
  free(data);
}

//! AppTimer callback function, reattempts a comm_xhr_request call
//! @param data Void cast RetryXHRData struct, contains parameter data to pass to function
void xhr_timer_callback(void *data) {
  XHRTimerData *timerData = (XHRTimerData*) data;
  comm_xhr_request(timerData->index, timerData->button);
  free(data);
}

//! AppTimer callback function, sends a READY request to JS side on repeat until
//! tile_array has been created. This ensures that tile data gets sent when the
//! initial READY response was missed.
//! @param data NULL pointer
void comm_ready_callback(void *data) {
  if (!tile_array) {
    DictionaryIterator *dict;
    uint32_t result = app_message_outbox_begin(&dict);
    #if DEBUG > 1
    APP_LOG(APP_LOG_LEVEL_DEBUG, "result: %d", (int)result);
    #endif
    if (result == APP_MSG_OK) {
      dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_READY);
      dict_write_end(dict);
      app_message_outbox_send();
    }
    outbox_attempts = MIN(30, outbox_attempts + 1);
    #if DEBUG > 1
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Not ready, waiting %d ms", 500 * outbox_attempts);
    #endif
    s_ready_timer = app_timer_register(500 * outbox_attempts, comm_ready_callback, NULL);
  } else {
    s_ready_timer = NULL;
  }
}

//! Asks pebblekit to find and send an icon based on a hash value (icon_key)
//! @param icon_key An 8 character SHA1 hash of a png icon or an internal resource id
//! @param icon_index The location in icon_array that this icon should be inserted at
void comm_icon_request(char* icon_key, uint8_t icon_index) {
    if (!data_transfer_lock && is_ready) {
      s_retry_timer = NULL;
      DictionaryIterator *dict;
      uint32_t result = app_message_outbox_begin(&dict);
      if (result == APP_MSG_OK) {
        data_transfer_lock = true;
        dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_ICON);
        dict_write_uint8(dict, MESSAGE_KEY_IconIndex, icon_index);
        dict_write_cstring(dict, MESSAGE_KEY_IconKey, icon_key);
        dict_write_end(dict);
        app_message_outbox_send();
      } else {
        // Comms failed for some reason, create a timer to re-attempt the call in a bit
        RetryTimerData *retry_data = malloc(sizeof(RetryTimerData));
        retry_data->icon_index = icon_index;
        strncpy(retry_data->icon_key, icon_key, ARRAY_LENGTH(retry_data->icon_key));
        s_retry_timer = app_timer_register(100, retry_timer_callback, (void*) retry_data);
      }
    } else {
      // data transfer is in-flight (locked), create a timer to re-attempt the call in a bit
      RetryTimerData *retry_data = malloc(sizeof(RetryTimerData));
      retry_data->icon_index = icon_index;
      strncpy(retry_data->icon_key, icon_key, ARRAY_LENGTH(retry_data->icon_key));
      s_retry_timer = app_timer_register(100, retry_timer_callback, (void*) retry_data);
    }

}

//! Asks pebblekit to send tile data
void comm_tile_request() {
    if (!data_transfer_lock) {
      DictionaryIterator *dict;
      
      uint32_t result = app_message_outbox_begin(&dict);
      if (result == APP_MSG_OK) {
        data_transfer_lock = true;
        dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_TILE);
        dict_write_end(dict);
        app_message_outbox_send();
      } 
    }
}

//! Asks pebblekit to perform an XHR request, this is looked up JS side based on tile index
//! and button pressed
//! @param index The index of the calling tile within tile_array
//! @param button The button that was pressed to trigger this call
void comm_xhr_request(uint8_t index, uint8_t button) {
    DictionaryIterator *dict;
    if (is_ready) {
      uint32_t result = app_message_outbox_begin(&dict);
      if (result == APP_MSG_OK) {
          dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_XHR);
          dict_write_uint8(dict, MESSAGE_KEY_RequestIndex, index);
          dict_write_uint8(dict, MESSAGE_KEY_RequestButton, button);
          dict_write_end(dict);
          app_message_outbox_send();
      } else {
        // Comms failed for some reason, create a timer to re-attempt the call in a bit
        XHRTimerData *xhr_data = malloc(sizeof(XHRTimerData));
        xhr_data->index = index;
        xhr_data->button = button;
        s_retry_timer = app_timer_register(500, xhr_timer_callback, (void*) xhr_data);
      }
    } else {
        // Comms failed for some reason, create a timer to re-attempt the call in a bit
        XHRTimerData *xhr_data = malloc(sizeof(XHRTimerData));
        xhr_data->index = index;
        xhr_data->button = button;
        s_retry_timer = app_timer_register(500, xhr_timer_callback, (void*) xhr_data);

    }
}

//! Free arrays and reset locks / timers so that the app is in a state to 
//! receive new tile data
void comm_callback_start() {
  data_tile_array_free();
  data_icon_array_free();
  data_icon_array_init(ICON_ARRAY_SIZE);
  is_ready = false;
  data_retrieve_persist();
  data_transfer_lock = false;
  outbox_attempts = 0;
  if (s_retry_timer) {app_timer_cancel(s_retry_timer);}
  if (s_ready_timer) {app_timer_cancel(s_ready_timer);}
  s_retry_timer = NULL;
  s_ready_timer = NULL;
  app_timer_register(RETRY_READY_TIMEOUT, comm_ready_callback, NULL);
}

//! Initialise AppMessage, timers and icon_array
void comm_init() {
  s_ready_timer = NULL;
  s_retry_timer = NULL;
  data_icon_array_init(ICON_ARRAY_SIZE);
  app_message_register_inbox_received(inbox);

  app_message_open(INBOX_SIZE, OUTBOX_SIZE);
}

//! Deinitialise  AppMesage, timers, arrays and any left over data
void comm_deinit() {
  app_message_deregister_callbacks();
  if (raw_data) { free(raw_data);}
  data_tile_array_free();
  data_icon_array_free();
  if (s_retry_timer) {app_timer_cancel(s_retry_timer);}
  if (s_ready_timer) {app_timer_cancel(s_ready_timer);}
  s_ready_timer = NULL;
  s_retry_timer = NULL;
}

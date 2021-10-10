#include "c/modules/comm.h"
#include "c/modules/data.h"
#include "c/user_interface/action_window.h"
#include "c/stateful.h"
#include "c/user_interface/loading_window.h"
static uint8_t *raw_data;
static AppTimer *s_retry_timer, *s_ready_timer;
static bool data_transfer_lock = false;
static bool is_ready = false;
static bool clay_needs_config = false;
static int outbox_attempts = 0;
typedef struct {
  char icon_key[9];
  uint8_t icon_index;
} RetryTimerData;
RetryTimerData retry_data;

void process_data(DictionaryIterator *dict, uint8_t **data, uint8_t transfer_type) {
    // Get the received image chunk
    Tuple *size_t = dict_find(dict, MESSAGE_KEY_TransferLength);
    if(size_t) {
      int size = size_t->value->int32;
      // Allocate buffer for image data
      *data = (uint8_t*) malloc(size * sizeof(uint8_t));
    }
    Tuple *chunk_t = dict_find(dict, MESSAGE_KEY_TransferChunk);
    if(chunk_t) {
      uint8_t *chunk_data = chunk_t->value->data;

      Tuple *chunk_size_t = dict_find(dict, MESSAGE_KEY_TransferChunkLength);
      int chunk_size = chunk_size_t->value->int32;
      Tuple *index_t = dict_find(dict, MESSAGE_KEY_TransferIndex);
      int index = index_t->value->int32;

      // Save the chunk
      memcpy(&(*data)[index], chunk_data, chunk_size);
    }

    // Complete?
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

// Called when a message is received from the JavaScript side
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
        comm_tile_request();
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
        pebblekit_connection_callback(true);
        break;

    }
}
void retry_timer_callback(void *data) {
  RetryTimerData *timerData = (RetryTimerData*) data;
  comm_icon_request(timerData->icon_key, timerData->icon_index);
  free(data);
}

// ask for a tile data after ready
void comm_ready_callback(void *data) {
  if (!tile_array) {
    // catching an edge case where a data tranfer was interrupted part way so the lock was never released
    if (is_ready && data_transfer_lock) {data_transfer_lock = false;}
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

// ask pebblekit to lookup and send a related icon based on hash key
void comm_icon_request(char* icon_key, uint8_t icon_index) {
    if (!data_transfer_lock) {
      s_retry_timer = NULL;
      // Asks pebblekit for an icon based on a hash key, to be inserted at provided index in data_icon_array
      data_transfer_lock = true;
      DictionaryIterator *dict;
      uint32_t result = app_message_outbox_begin(&dict);
      if (result == APP_MSG_OK) {
        dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_ICON);
        dict_write_uint8(dict, MESSAGE_KEY_IconIndex, icon_index);
        dict_write_cstring(dict, MESSAGE_KEY_IconKey, icon_key);
        dict_write_end(dict);
        app_message_outbox_send();
      }
    } else {
      // data transfer is in-flight (locked), so create a timer to re-call this function with params in 100ms
      RetryTimerData *retry_data = malloc(sizeof(RetryTimerData));
      retry_data->icon_index = icon_index;
      strcpy(retry_data->icon_key, icon_key);
      s_retry_timer = app_timer_register(100, retry_timer_callback, (void*) retry_data);
    }

}

// ask pebblekit to send down its tile data
void comm_tile_request() {
    if (!data_transfer_lock) {
      data_transfer_lock = true;
      DictionaryIterator *dict;
      
      uint32_t result = app_message_outbox_begin(&dict);
      if (result == APP_MSG_OK) {
        dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_TILE);
        dict_write_end(dict);
        app_message_outbox_send();
      } 
    }
}

// ask pebblekit to find and call a REST endpoint based on tile id and the button pressed
void comm_xhr_request(void *context, uint8_t id, uint8_t button) {
    DictionaryIterator *dict;
    
    uint32_t result = app_message_outbox_begin(&dict);
    if (result == APP_MSG_OK) {
        dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_XHR);
        dict_write_uint8(dict, MESSAGE_KEY_RequestIndex, id);
        dict_write_uint8(dict, MESSAGE_KEY_RequestButton, button);
        dict_write_end(dict);
        app_message_outbox_send();
    }
}

// kicks of loop to wait for pebblekit ready and then request tile data
void comm_callback_start() {
  data_tile_array_free();
  is_ready = false;
  data_transfer_lock = false;
  outbox_attempts = 0;
  if (s_retry_timer) {app_timer_cancel(s_retry_timer);}
  if (s_ready_timer) {app_timer_cancel(s_ready_timer);}
  s_retry_timer = NULL;
  s_ready_timer = NULL;
  app_timer_register(RETRY_READY_TIMEOUT, comm_ready_callback, NULL);
}


void comm_init() {
  s_ready_timer = NULL;
  s_retry_timer = NULL;
  data_icon_array_init(ICON_ARRAY_SIZE);
  app_message_register_inbox_received(inbox);

  app_message_open(INBOX_SIZE, OUTBOX_SIZE);
}

void comm_deinit() {
  app_message_deregister_callbacks();
  if (raw_data) { free(raw_data);}
  data_tile_array_free();
  data_icon_array_free();
  if (s_retry_timer) {app_timer_cancel(s_retry_timer);}
  if (s_ready_timer) {app_timer_cancel(s_ready_timer);}
  s_ready_timer = NULL;
  s_retry_timer = NULL;
  // Free image data buffer
}

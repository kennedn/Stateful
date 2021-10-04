#include "c/modules/comm.h"
#include "c/modules/data.h"
#include "c/user_interface/action_window.h"
#include "c/stateful.h"
static uint8_t *raw_data;
static AppTimer *s_retry_timer, *s_ready_timer;
static bool data_transfer_lock = false;
static bool is_ready = false;
static int outbox_attempts = 0;
typedef struct {
  char iconKey[11];
  uint8_t iconIndex;
} RetryTimerData;
RetryTimerData retryData;

void processData(DictionaryIterator *dict, uint8_t **data, uint8_t transferType ) {
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
      switch(transferType) {
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
      #ifdef DEBUG
      APP_LOG(APP_LOG_LEVEL_DEBUG, "Transfer complete, free bytes: %d", heap_bytes_free());
      #endif
      
    }
}

// Called when a message is received from the JavaScript side
static void inbox(DictionaryIterator *dict, void *context) {
    Tuple *type_t = dict_find(dict, MESSAGE_KEY_TransferType);
    Tuple *color_t = dict_find(dict, MESSAGE_KEY_Color);
    Tuple *size_t = dict_find(dict, MESSAGE_KEY_TransferLength);
    switch(type_t->value->int32) {
      case TRANSFER_TYPE_ICON:
        #ifdef DEBUG
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received icon chunk");
        #endif
        processData(dict, &raw_data, TRANSFER_TYPE_ICON);
        break;
      case TRANSFER_TYPE_TILE:
        #ifdef DEBUG
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received tile chunk");
        #endif
        processData(dict, &raw_data, TRANSFER_TYPE_TILE);
        break;
      case TRANSFER_TYPE_XHR:
        break;
      case TRANSFER_TYPE_COLOR:
        if (color_t) { action_window_set_color(color_t->value->int32); }
        break;
      case TRANSFER_TYPE_ERROR:
        #ifdef DEBUG
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received Error");
        #endif

        break;
      case TRANSFER_TYPE_ACK:
        #ifdef DEBUG
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received acknowledge");
        #endif
        break;
      case TRANSFER_TYPE_READY:
        #ifdef DEBUG
        APP_LOG(APP_LOG_LEVEL_DEBUG, "JS Environment Ready");
        is_ready = true;
        comm_tile_request();
        #endif
        break;
    }
}
void retry_timer_callback(void *data) {
  RetryTimerData *timerData = (RetryTimerData*) data;
  comm_icon_request(timerData->iconKey, timerData->iconIndex);
  free(data);
}

// ask for a tile data after ready
void comm_ready_callback(void *data) {
  if (!tileArray) {
    // catching an edge case where a data tranfer was interrupted part way so the lock was never released
    if (is_ready && data_transfer_lock) {data_transfer_lock = false;}
    DictionaryIterator *dict;
    uint32_t result = app_message_outbox_begin(&dict);
    APP_LOG(APP_LOG_LEVEL_DEBUG, "result: %d", (int)result);
    if (result == APP_MSG_OK) {
      dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_READY);
      dict_write_end(dict);
      app_message_outbox_send();
    }
    outbox_attempts = MIN(30, outbox_attempts + 1);
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Not ready, waiting %d ms", 1000 * outbox_attempts);
    s_ready_timer = app_timer_register(1000 * outbox_attempts, comm_ready_callback, NULL);
  } else {
    s_ready_timer = NULL;
  }
}

// ask pebblekit to lookup and send a related icon based on hash key
void comm_icon_request(char* iconKey, uint8_t iconIndex) {
    if (!data_transfer_lock) {
      s_retry_timer = NULL;
      // Asks pebblekit for an icon based on a hash key, to be inserted at provided index in data_icon_array
      data_transfer_lock = true;
      DictionaryIterator *dict;
      uint32_t result = app_message_outbox_begin(&dict);
      if (result == APP_MSG_OK) {
        dict_write_uint8(dict, MESSAGE_KEY_TransferType, TRANSFER_TYPE_ICON);
        dict_write_uint8(dict, MESSAGE_KEY_IconIndex, iconIndex);
        dict_write_cstring(dict, MESSAGE_KEY_IconKey, iconKey);
        dict_write_end(dict);
        app_message_outbox_send();
      }
    } else {
      // data transfer is in-flight (locked), so create a timer to re-call this function with params in 100ms
      RetryTimerData *retryData = malloc(sizeof(RetryTimerData));
      retryData->iconIndex = iconIndex;
      strcpy(retryData->iconKey, iconKey);
      s_retry_timer = app_timer_register(100, retry_timer_callback, (void*) retryData);
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
        dict_write_uint8(dict, MESSAGE_KEY_RequestID, id);
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
  app_timer_register(5000, comm_ready_callback, NULL);
}


void comm_init() {
  app_comm_set_sniff_interval(SNIFF_INTERVAL_REDUCED);
  s_ready_timer = NULL;
  s_retry_timer = NULL;
  data_icon_array_init(ICON_ARRAY_SIZE);
  app_message_register_inbox_received(inbox);

  app_message_open(INBOX_SIZE, OUTBOX_SIZE);
}

void comm_deinit() {
  if (s_retry_timer) {app_timer_cancel(s_retry_timer);}
  if (s_ready_timer) {app_timer_cancel(s_ready_timer);}
  s_ready_timer = NULL;
  s_retry_timer = NULL;
  // Free image data buffer
  data_tile_array_free();
  data_icon_array_free();
  app_message_deregister_callbacks();
}

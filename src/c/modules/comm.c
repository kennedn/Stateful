#include "c/modules/comm.h"
#include "c/modules/data.h"
#include "c/user_interface/action_window.h"
#define SHORT_VIBE() vibes_enqueue_custom_pattern(short_vibe);
static uint8_t *raw_data;
static AppTimer *s_retry_timer;
static bool outbox_lock = false;
typedef struct {
  char iconKey[41];
  uint8_t iconIndex;
} RetryTimerData;
RetryTimerData retryData;

VibePattern short_vibe = { 
    .durations = (uint32_t []) {50},
    .num_segments = 1,};

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
        case 0:
          data_icon_array_add_icon(*data);
        break;
        case 1:
          data_tile_array_pack_tiles(*data, complete_t->value->int32);
        break;
      }
      free(*data);
      outbox_lock = false;
    }
}

// Called when a message is received from the JavaScript side
static void inbox(DictionaryIterator *dict, void *context) {
    Tuple *type_t = dict_find(dict, MESSAGE_KEY_TransferType);
    Tuple *color_t = dict_find(dict, MESSAGE_KEY_Color);
    switch(type_t->value->int32) {
      case 0: // TransferType.ICON
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received icon data");
        processData(dict, &raw_data, 0);
        break;
      case 1: // TransferType.TILE
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received tile data");
        processData(dict, &raw_data, 1);
        break;
      case 2: // TransferType.XHR
        break;
      case 3: // TransferType.COLOR
        SHORT_VIBE();
        if (color_t) {
          APP_LOG(APP_LOG_LEVEL_DEBUG, "Status: %d", (int)color_t->value->int32);
          action_window_set_color(color_t->value->int32);
        }
        break;
      case 4: // TransferType.ERROR
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received Error");
        break;
      case 5: // TransferType.ACK
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received acknowledge");
        break;
      case 6: // TransferType.READY
        APP_LOG(APP_LOG_LEVEL_DEBUG, "JS Environment Ready");
        comm_data_request(1); // Request Icon Payload
        break;
    }
}
void retry_timer_callback(void *data) {
  RetryTimerData *timerData = (RetryTimerData*) data;
  comm_icon_request(timerData->iconKey, timerData->iconIndex);
  free(data);
}

void comm_icon_request(char* iconKey, uint8_t iconIndex) {
    DictionaryIterator *dict;
    // uint32_t size = dict_calc_buffer_size(3, sizeof(uint8_t), sizeof(uint8_t), strlen(iconKey) + 1);
    // uint8_t buffer[size];
    if (!outbox_lock) {
      APP_LOG(APP_LOG_LEVEL_DEBUG, "Outbox is unlocked");
      uint32_t result = app_message_outbox_begin(&dict);
      if (result == APP_MSG_OK) {
        dict_write_uint8(dict, MESSAGE_KEY_TransferType, 0);
        dict_write_uint8(dict, MESSAGE_KEY_IconIndex, iconIndex);
        dict_write_cstring(dict, MESSAGE_KEY_IconKey, iconKey);
        dict_write_end(dict);
        app_message_outbox_send();
        outbox_lock = true;
      }
    } else {
      APP_LOG(APP_LOG_LEVEL_DEBUG, "Outbox currently locked, retrying");
      RetryTimerData *retryData = malloc(sizeof(RetryTimerData));
      retryData->iconIndex = iconIndex;
      strcpy(retryData->iconKey, iconKey);
      s_retry_timer = app_timer_register(50, retry_timer_callback, (void*) retryData);
    }

}

void comm_data_request(uint8_t transferType) {
    DictionaryIterator *dict;
    
    uint32_t result = app_message_outbox_begin(&dict);
    if (result == APP_MSG_OK) {
      dict_write_uint8(dict, MESSAGE_KEY_TransferType, transferType);
      dict_write_end(dict);
      app_message_outbox_send();
    } 
}

void comm_xhr_request(void *context, uint8_t id, uint8_t button) {
    DictionaryIterator *dict;
    
    uint32_t result = app_message_outbox_begin(&dict);
    if (result == APP_MSG_OK) {
        dict_write_uint8(dict, MESSAGE_KEY_TransferType, 2); // TransferType.XHR
        dict_write_uint8(dict, MESSAGE_KEY_RequestID, id);
        dict_write_uint8(dict, MESSAGE_KEY_RequestButton, button);
        dict_write_end(dict);
        app_message_outbox_send();
    }
}


void comm_init() {
  data_icon_array_init(4);
  app_message_register_inbox_received(inbox);

  const int inbox_size = app_message_inbox_size_maximum();
  const int outbox_size = app_message_outbox_size_maximum();
  app_message_open(inbox_size, outbox_size);
}

void comm_deinit() {
  // Free image data buffer
  data_tile_array_free();
  data_icon_array_free();
  app_message_deregister_callbacks();
}

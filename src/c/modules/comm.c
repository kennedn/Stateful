#include "c/modules/comm.h"
#ifndef HEADER_FILE
#define HEADER_FILE
#include "c/modules/data.h"
#endif
#include "c/user_interface/toggle_window.h"
#define SHORT_VIBE() vibes_enqueue_custom_pattern(short_vibe);
#define BIN_PATTERN "%c%c%c%c%c%c%c%c:%d"
#define BIN(byte)  \
  (byte & 0x80 ? '1' : '0'), \
  (byte & 0x40 ? '1' : '0'), \
  (byte & 0x20 ? '1' : '0'), \
  (byte & 0x10 ? '1' : '0'), \
  (byte & 0x08 ? '1' : '0'), \
  (byte & 0x04 ? '1' : '0'), \
  (byte & 0x02 ? '1' : '0'), \
  (byte & 0x01 ? '1' : '0'), \
  byte 

static uint8_t *tile_data;
static int tile_size;
static uint8_t *icon_data;
static int icon_size;
VibePattern short_vibe = { 
    .durations = (uint32_t []) {50},
    .num_segments = 1,};

static void tileDone(uint8_t **data, int size){
    Tile *tile = (Tile*) *data;
    APP_LOG(APP_LOG_LEVEL_DEBUG, "type:"BIN_PATTERN, BIN(tile->type));
    APP_LOG(APP_LOG_LEVEL_DEBUG, "base_resource:"BIN_PATTERN, BIN(tile->base_resource));
    APP_LOG(APP_LOG_LEVEL_DEBUG, "up_call:"BIN_PATTERN,BIN(tile->up_call));
    APP_LOG(APP_LOG_LEVEL_DEBUG, "mid_call:"BIN_PATTERN ,BIN(tile->mid_call));
    APP_LOG(APP_LOG_LEVEL_DEBUG, "down_call:"BIN_PATTERN ,BIN(tile->down_call));
    APP_LOG(APP_LOG_LEVEL_DEBUG, "status_call:"BIN_PATTERN ,BIN(tile->status_call));
    APP_LOG(APP_LOG_LEVEL_DEBUG, "color_good:"BIN_PATTERN ,BIN(tile->color_good));
    APP_LOG(APP_LOG_LEVEL_DEBUG, "color_good_hi:"BIN_PATTERN ,BIN(tile->color_good_hi));
    APP_LOG(APP_LOG_LEVEL_DEBUG, "color_bad:"BIN_PATTERN ,BIN(tile->color_bad));
    APP_LOG(APP_LOG_LEVEL_DEBUG, "color_bad_hi:"BIN_PATTERN,BIN(tile->color_bad_hi));                
    APP_LOG(APP_LOG_LEVEL_DEBUG, "title: %s", tile->title);
    //toggle_window_set_tile_data(tile);
  }
void processData(DictionaryIterator **dict, uint8_t **data, int *size, void (*f)(uint8_t **data, int size)) {
    // Get the received image chunk
    Tuple *size_t = dict_find(*dict, MESSAGE_KEY_TransferLength);
    if(size_t) {
      *size = size_t->value->int32;

      // Allocate buffer for image data
      *data = (uint8_t*)malloc((*size) * sizeof(uint8_t));
    }
    Tuple *chunk_t = dict_find(*dict, MESSAGE_KEY_TransferChunk);
    if(chunk_t) {
      uint8_t *chunk_data = chunk_t->value->data;

      Tuple *chunk_size_t = dict_find(*dict, MESSAGE_KEY_TransferChunkLength);
      int chunk_size = chunk_size_t->value->int32;

      Tuple *index_t = dict_find(*dict, MESSAGE_KEY_TransferIndex);
      int index = index_t->value->int32;

      // Save the chunk
      memcpy(*data + index, chunk_data, chunk_size);
     // data[index+chunk_size+1]
    }

    // Complete?
    Tuple *complete_t = dict_find(*dict, MESSAGE_KEY_TransferComplete);
    if(complete_t) {
      // Show the image
      APP_LOG(APP_LOG_LEVEL_DEBUG, "Completed transfer, setting data");
      (*f)(data, (*size));
    }

}

// Called when a message is received from the JavaScript side
static void inbox(DictionaryIterator *dict, void *context) {
    SHORT_VIBE();
    Tuple *type_t = dict_find(dict, MESSAGE_KEY_TransferType);
    switch(type_t->value->int32) {
      case 0:
        processData(&dict, &icon_data, &icon_size, toggle_window_set_image_data);
        break;
      case 1:
        processData(&dict, &tile_data, &tile_size, toggle_window_set_tile_data);
        break;
    }
}

    // Tuple *status_t = dict_find(dict, MESSAGE_KEY_status);
    // if(status_t) {
    //     #if DEBUG > 1
    //         APP_LOG(APP_LOG_LEVEL_DEBUG, "status_t: %s, ldictal: %s, comparison %d", status_t->value->cstring, "Success", strcmp(status_t->value->cstring, "Success"));
    //     #endif    
    //     if (strcmp(status_t->value->cstring, "Success") == 0) {
    //         uint32_t state = !persist_read_int(ENDPOINT_STATE);
    //         color = state;
    //         persist_write_int(ENDPOINT_STATE, state);
    //     }
    //     layer_mark_dirty(bg_layer);
    //     layer_mark_dirty(sidebar_layer);
    // } 
    // else {
    //     APP_LOG(APP_LOG_LEVEL_DEBUG, "ERROR!");
    // }

// Make a request for the national debt number
static void outbox(void *context, uint8_t endpoint, uint8_t param) {
    DictionaryIterator *dict;
    
    uint32_t result = app_message_outbox_begin(&dict);
    if (result == APP_MSG_OK) {
        dict_write_uint8(dict, MESSAGE_KEY_endpoint, endpoint);  // Gotta have a payload
        dict_write_uint8(dict, MESSAGE_KEY_param, param);
        dict_write_end(dict);
        app_message_outbox_send();
    }
}


void comm_init() {
  app_message_register_inbox_received(inbox);

  const int inbox_size = app_message_inbox_size_maximum();
  const int outbox_size = 64;
  app_message_open(inbox_size, outbox_size);
}

void comm_deinit() {
  // Free image data buffer
  if(tile_data) {
    free(tile_data);
  }
}

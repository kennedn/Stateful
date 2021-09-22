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
VibePattern short_vibe = { 
    .durations = (uint32_t []) {50},
    .num_segments = 1,};

// Packs raw tile packet into a struct
static void tileDone(uint8_t *data){
    uint16_t ptr = 0;
    uint8_t text_size = 0;
    tile.id = (uint8_t) data[ptr++];
    tile.color = (GColor) data[ptr++];
    tile.highlight = (GColor) data[ptr++];
    APP_LOG(APP_LOG_LEVEL_DEBUG, "color:"BIN_PATTERN, BIN(tile.id));
    // APP_LOG(APP_LOG_LEVEL_DEBUG, "color:"BIN_PATTERN, BIN((uint8_t) tile.color));
    // APP_LOG(APP_LOG_LEVEL_DEBUG, "up_text: %s", tile.up_text);
    
    for(uint8_t i=0; i < ARRAY_LENGTH(tile.texts); i++) {
      text_size = data[ptr++];
      tile.texts[i] = (char*) malloc(text_size * sizeof(char*));
      strncpy(tile.texts[i], (char*) &data[ptr], text_size);
      ptr += text_size;
    }

    for(uint8_t i=0; i < ARRAY_LENGTH(tile.icons); i++) {
      // data length can be much bigger than the max uint8_t size (255), so as a workaround 
      // we can read in two uint8_t values with a cast to uint16_t
      uint16_t icon_size = *(uint16_t*) &data[ptr];
      ptr +=2;
      tile.icons[i] = (icon_size == 1) ? gbitmap_create_with_resource(data[ptr]) : gbitmap_create_from_png_data(&data[ptr], icon_size);
      ptr += icon_size;
    }

    APP_LOG(APP_LOG_LEVEL_DEBUG, "Completed tile assignment");
    toggle_window_push();

  }
void processData(DictionaryIterator *dict, uint8_t **data) {
    // Get the received image chunk
    Tuple *size_t = dict_find(dict, MESSAGE_KEY_TransferLength);
    if(size_t) {
      int size = size_t->value->int32;

      // Allocate buffer for image data
      *data = (uint8_t*)malloc(size * sizeof(uint8_t));
    }
    Tuple *chunk_t = dict_find(dict, MESSAGE_KEY_TransferChunk);
    if(chunk_t) {
      uint8_t *chunk_data = chunk_t->value->data;

      Tuple *chunk_size_t = dict_find(dict, MESSAGE_KEY_TransferChunkLength);
      int chunk_size = chunk_size_t->value->int32;

      Tuple *index_t = dict_find(dict, MESSAGE_KEY_TransferIndex);
      int index = index_t->value->int32;

      // Save the chunk
      memcpy(*data + index, chunk_data, chunk_size);
    }

    // Complete?
    Tuple *complete_t = dict_find(dict, MESSAGE_KEY_TransferComplete);
    if(complete_t) {
      // Show the image
      APP_LOG(APP_LOG_LEVEL_DEBUG, "Completed transfer, setting data");
      tileDone(*data);
    }

}

// Called when a message is received from the JavaScript side
static void inbox(DictionaryIterator *dict, void *context) {
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Free bytes: %d", heap_bytes_free());
    Tuple *type_t = dict_find(dict, MESSAGE_KEY_TransferType);
    Tuple *status_t = dict_find(dict, MESSAGE_KEY_XHRStatus);
    switch(type_t->value->int32) {
      // case 0:
      //   processData(&dict, &icon_data, &icon_size, toggle_window_set_image_data);
      //   break;
      case 1:
        processData(dict, &tile_data);
        break;
      case 2:
        SHORT_VIBE();
        if (status_t) {
          APP_LOG(APP_LOG_LEVEL_DEBUG, "Status: %d", (int)status_t->value->int32);
          toggle_window_set_color((uint8_t) status_t->value->uint8);
        }
        break;
      case 3:
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received Error");
        break;
      case 4:
        APP_LOG(APP_LOG_LEVEL_DEBUG, "Received acknowledge");
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
void outbox(void *context, uint8_t id, uint8_t button) {
    DictionaryIterator *dict;
    
    uint32_t result = app_message_outbox_begin(&dict);
    if (result == APP_MSG_OK) {
        dict_write_uint8(dict, MESSAGE_KEY_RequestID, id);  // Gotta have a payload
        dict_write_uint8(dict, MESSAGE_KEY_RequestButton, button);
        dict_write_end(dict);
        app_message_outbox_send();
    }
}


void comm_init() {
  app_message_register_inbox_received(inbox);

  const int inbox_size = app_message_inbox_size_maximum();
  // const int inbox_size = 64;
  const int outbox_size = 64;
  app_message_open(inbox_size, outbox_size);
}

void comm_deinit() {
  // Free image data buffer
  if(tile_data) {
    free(tile_data);
  }
}

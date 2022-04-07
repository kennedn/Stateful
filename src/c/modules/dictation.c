#include <pebble.h>
#include <ctype.h>
#include "c/stateful.h"
#include "c/modules/data.h"
#include "c/modules/comm.h"

DictationSession *s_dictation_session;
#define DICTATION_STRING_LENGTH 21
static char s_tile_string[DICTATION_STRING_LENGTH];
static char s_button_string[DICTATION_STRING_LENGTH];
static char *s_string_pointer;

static void dictation_session_callback(DictationSession *session, DictationSessionStatus status, char *transcription, void *context) {
  if(status != DictationSessionStatusSuccess) {return;}
  for (uint8_t i=0; i < strlen(transcription); i++) {
    transcription[i] = tolower((unsigned char)transcription[i]);
  }
  char buff[DICTATION_STRING_LENGTH];
  Tile *tile;
  for (uint8_t tile_idx=0; tile_idx < tile_array->used; tile_idx++) {
    tile = tile_array->tiles[tile_idx];
    for (uint8_t button_idx=ARRAY_LENGTH(tile->texts)-1; button_idx != 255; button_idx--) {
      char *substring = NULL;
      if (strlen(tile->texts[button_idx]) > 0) {
        strncpy(buff, tile->texts[button_idx], DICTATION_STRING_LENGTH);
        for (uint8_t i=0; i < strlen(buff); i++) {
          buff[i] = tolower((unsigned char)buff[i]);
        }
        substring = strstr(transcription, buff);
      }      

      if (substring && button_idx == 6) {  // Tile match
        debug(2, "Found tile match at index %d", tile_idx);
        uint8_t substring_length = strlen(buff);
        memmove(substring, substring + substring_length, strlen(substring + substring_length) + 1); 
        continue;
      } else if (button_idx == 6) {  // No Tile Match
        debug(2, "No match for tile index %d", tile_idx);
        break;
      } else if (substring) { // Button Match
        debug(2, "Found button match at index %d", button_idx);
        comm_xhr_request(tile_idx, button_idx, 0);
        return;
      }

    }
  }
}

void dictation_start() {
  dictation_session_start(s_dictation_session);
}

void dictation_init() {
  s_dictation_session = dictation_session_create(DICTATION_STRING_LENGTH * 2, dictation_session_callback, NULL);
}

void dictation_deinit() {
  if(!s_dictation_session) {return;}
  dictation_session_destroy(s_dictation_session);
  s_dictation_session = NULL;
}
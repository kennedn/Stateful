#pragma once

#include <pebble.h>

typedef enum {
	REST_ENDPOINT,
	REST_CODE,
	NUM_RESTS
} RestValues

typedef enum {
    GOOD,
    BAD,
    WARN,
    NUM_COLOR_SETS
} ColorSets;

typedef enum {
    MAIN,
    HIGHLIGHT,
    NUM_COLOR_TYPES
} ColorTypes;

typedef struct {
	static void (*gadget_load_function)(Window);
	static uint8_t current_row;
	static uint8_t rows;
	static uint8_t rest_calls[NUM_BUTTONS][NUM_RESTS];
	static uint8_t colors[NUM_COLOR_SETS][NUM_COLOR_TYPES]} 				

//gadget window_load callback

//rows
//current row

//REST values[up,select,down]:
//	endpoint
//	code
//Colors[good, bad, warn]:
//	Main
//	Highlight
//Icon data

//Gadget type
//Call values:
//	endpoint
//	code
//Colors[]:
//	Main
//	Highlight
//Icon data (SVG or PNG)?

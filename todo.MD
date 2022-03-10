# Todo
## Icons
- ~~Ditch `.webp` (thanks apple)~~
- Create standard set of icons
- Convert png8 icon set under `resources/icons` to RGB png and allow `pebble build` to convert down to png8, this will reduce filesize of `tools/webp.sh` output a bit.
- ~~Create black spinner icon and tie into `text_color_legible_over()`~~

## General
- Handle xhrArrayBuffer callback failures
- Use `Object.byString` in `status.variable` parsing
- Test clay_needs_config against changes made in comm_ready_callback
- ~~Attempt to retrieve icons from storage in `data_tile_array_pack_tiles()` for faster loads~~
- ~~Detect startup connectivity issues in `comm_ready_callback()`~~

## Clay Config
- Handle Submit payload
- Handle Icon payload (url)
- Handle Add / Delete tile payload
- Add Icon manager
- Add global settings
- Add section for tile data

## Nice to have
- Session management (via session token) in comm.c to prevent old requests causing a race condition in `comm_bluetooth_event()`. Currently an assumption is made that when READY is received the subsequent TILE chunk transfers will be received without interruption, which under a limited set of circumstances is not the case and can cause app crashes.
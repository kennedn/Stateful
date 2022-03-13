# Todo
## Icons
- ~~Ditch `.webp` (thanks apple)~~
- ~~Un-ditch `.webp` due to size contraints (f*ck you apple)~~
- ~~Create standard set of icons~~
- ~~Convert png8 icon set under `resources/icons` to RGB png and allow `pebble build` to convert down to png8, this will reduce filesize of `tools/webp.sh` output a bit.~~
- ~~Create black spinner icon and tie into `text_color_legible_over()`~~

## General
- Handle xhrArrayBuffer callback failures
- Use `Object.byString` in `status.variable` parsing
- Test clay_needs_config against changes made in comm_ready_callback
- ~~Attempt to retrieve icons from storage in `data_tile_array_pack_tiles()` for faster loads~~
- ~~Detect startup connectivity issues in `comm_ready_callback()`~~
- Implement custom icon storage and pulldown to clay
- Implement tile limits - aplite (16), basalt (backend 64, frontend 49)
- png decode failure on aplite? Maybe need ~bw variants? 
## Clay Config
- Handle Submit payload
- Handle Icon payload (url)
- Handle Add / Delete tile payload
- Add Icon manager
- Add global settings
- Add section for tile data

## Nice to have / ideas
- ~~Session management (via incrementing int) in comm.c to prevent old requests causing a race condition in `comm_bluetooth_event()`. Currently an assumption is made that when READY is received the subsequent TILE chunk transfers will be received without interruption, which under a limited set of circumstances is not the case and can cause app crashes.~~
- Use image urls from github repo as a fallback position for webp data uris
  - Create promise in ready event to verify url's are reachable, validate promise in showConfiguration event, resolve should return either list of data uris, list of urls or a mix of both. Store icon-set in a js file and use require to pull in.
- Static loading image for b/w models on xhr request (rotate overflow icon?)
- ~~Use LZString library to reduce transfer sizes (needs to be below ~256kb or android app crashes)~~
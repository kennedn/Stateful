# Todo
## Icons
- Ditch `.webp` (thanks apple)
- Create standard set of icons
- Convert png8 icon set under `resources/icons` to RGB png and allow `pebble build` to convert down to png8, this will reduce filesize of `tools/webp.sh` output a bit.
- Create black spinner icon and tie into `text_color_legible_over()`

## General
- Handle xhrArrayBuffer callback failures
- Use `Object.byString` in `status.variable` parsing

## Clay Config
- Handle Submit payload
- Handle Icon payload (url)
- Handle Add / Delete tile payload
- Add Icon manager
- Add global settings
- Add section for tile data
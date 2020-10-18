typedef struct {
  uint8_t type;
  uint8_t base_resource;
  uint8_t up_call;
  uint8_t mid_call;
  uint8_t down_call;
  uint8_t status_call;
  uint8_t color_good;
  uint8_t color_good_hi;
  uint8_t color_bad;
  uint8_t color_bad_hi;
  char title[32];
} Tile;

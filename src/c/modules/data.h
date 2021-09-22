// todo:
// text elements could also be pointers?
// icon elements could be GBitMaps? 

#define UP 0
#define UP_HOLD 1
#define MID 2
#define MID_HOLD 3
#define DOWN 4
#define DOWN_HOLD 5

typedef struct {
  uint8_t id;
  GColor color;
  GColor highlight;
  char* texts[6];
  GBitmap* icons[6];
} Tile;

var self = module.exports = {
  DEBUG: 2,
  ICON_SIZE_PX: 18,
  MAX_HASH_LENGTH: 8,
  MAX_STR_LENGTH: 20,
  TRANSFER_LOCK: false,
  getPlatformLimits: function() {
    var aplite = (Pebble.getActiveWatchInfo().platform == 'aplite');
    return {
      'maxChunkSize': aplite ? 256 : 8200,
      'iconArraySize': aplite ? 10: 16,
      'maxTiles': aplite ? 16 : 64
    };
  },
  debug: function(level, msg) {
    if (level <= self.DEBUG) {
      console.log(msg);
    }
  },
  messageSuccess: function() {
    self.debug(3, "Message send succeeded.");  
  },
  messageFailure: function() {
    self.debug(3,"Message send failed.");
  },

  TransferType: {
    "ICON": 0,
    "TILE": 1,
    "XHR": 2,
    "COLOR": 3,
    "ERROR": 4,
    "ACK": 5,
    "READY": 6,
    "NO_CLAY": 7,
    "REFRESH": 8,
  },
  ColorAction: {
    "GOOD": 0,
    "BAD": 1,
    "ERROR": 2,
    "VIBRATE_INIT": 3,
    "VIBRATE_RESPONSE": 4,
    "RESET_ONLY": 5
  },
  Button: {
    "0": "up",
    "1": "up_hold",
    "2": "mid",
    "3": "mid_hold",
    "4": "down",
    "5": "down_hold"
  },
  ButtonIndex: {
    "up": 0,
    "up_hold": 1,
    "mid": 2,
    "mid_hold": 3,
    "down": 4,
    "down_hold": 5
  },
  CallType: {
    "LOCAL": 0,
    "STATEFUL": 1,
    "STATUS_ONLY": 2,
    "DISABLED": 3,
  },
  ClayAction: {
    "NORMAL": 0,
    "JSON_SUBMIT": 1,
    "ICON_ADD": 2,
    "ICON_REMOVE": 3,
    "TILE_ADD": 4,
    "TILE_REMOVE": 5
  }
};
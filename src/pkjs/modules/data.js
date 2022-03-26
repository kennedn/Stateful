var globals = require('./globals');
for (var key in globals) {
  window[key] = globals[key];
}

var Comms = require('./comm');
var Icon = require('./icon')

window.global = window;
var Buffer = require('buffer/').Buffer;

var self = module.exports = {

  /**
   * Returns a GColor8 (uint8_t) representation of a hex color code, replicates GColorFromHEX()
   * @param {string} hexString
   * @param {int} position
   * @return {int}
   */
  toGColor: function(hexString) {
    // Split hexString into 2 char array [r, g, b], bitshift and pad each element, 
    // then join and parse into uint8_t.
    hexString = hexString.replace("#", "");
    if (hexString.length < 6) {
      hexString = hexString.padStart(6, '0');
    } else if (hexString.length > 6) {
      return 255;
    }
    return parseInt("11" + hexString.match(/.{1,2}/g).map(function(hex) { 
      return (parseInt(hex, 16) >> 6).toString(2).padStart(2, '0')
    }).join(''), 2); 
  },

  /**
   * Assigns each byte of a string to uint8Array, including null terminator
   * @param {Uint8Array} uint8Array
   * @param {string} str
   * @param {int} idx 
   */
  packString: function(uint8Array, str, idx) {
    if(idx + (str.length + 1) > uint8Array.length) throw new Error("Index out of range");
    for (var c=0; c < str.length; c++) {
      uint8Array[c+idx] = str.charCodeAt(c);
    }
    uint8Array[c+idx+1] = 0x00;
    return c+idx+1
  },

  packIcon: function(key, index, session) {
    if (TRANSFER_LOCK) {return;}
    key = key.slice(0, MAX_HASH_LENGTH);
    var buffer = new ArrayBuffer(1000000);
    var uint8 = new Uint8Array(buffer);
    var ptr = 0;

    var icon = Icon.find(key);

    if (icon == null) {
      return;
    }

    uint8[ptr++] = index;

    uint8[ptr++] = key.length + 1;
    ptr = self.packString(uint8, key, ptr);
    
    if (typeof(icon) === 'object') {
      if(Pebble.getActiveWatchInfo().platform == "aplite") {
        uint8[ptr++] = 1;
        uint8[ptr++] = 0;
        uint8[ptr++] = 1;
      } else {
        var buff = icon;
        uint8[ptr++] = buff.length & 0xff;
        uint8[ptr++] = buff.length >> 8;
        for (var i=0; i < buff.length; i++) {
          uint8[ptr++] = buff[i];
        }
      }
    } else if(typeof(icon) === 'number') {
      uint8[ptr++] = 1;
      uint8[ptr++] = 0;
      uint8[ptr++] = icon;
    } else {
      uint8[ptr++] = 1;
      uint8[ptr++] = 0;
      uint8[ptr++] = 1;
    }

    var buffer_2 = buffer.slice(0, ptr);
    var uint8_2 = new Uint8Array(buffer_2);

    debug(3, Array.apply([], uint8_2).join(","));
    debug(1, "Completed icon packing (" + (ptr / 1024).toFixed(2) + "kB): " + key);

    Comms.processData(buffer_2, TransferType.ICON, session);
  },

  packTiles: function(session) {
    if (TRANSFER_LOCK) {return;}
    // create a big temporary buffer as we don't know the size we will end up with yet
    var buffer = new ArrayBuffer(1000000);
    var uint8 = new Uint8Array(buffer);

    var ptr = 0;
    var payload;
    var icon_keys = [];
    var tiles = localStorage.getItem('tiles');
    try {
      tiles = JSON.parse(tiles)
    } catch(e) {
      tiles = null;
    }
    if (tiles == null || Object.keys(tiles).length == 0  || tiles.tiles == null ||  tiles.tiles.length == 0) {
      Pebble.sendAppMessage({"TransferType": TransferType.NO_CLAY}, messageSuccess, messageFailure);
      return;
    }
    tiles.tiles = tiles.tiles.slice(0, getPlatformLimits().maxTiles);
    // pack tile variables into the buffer object, incrementing our pointer each time
    uint8[ptr++] = tiles.tiles.length;
    uint8[ptr++] = Math.max(0, Math.min(tiles.tiles.length - 1, tiles.default_idx));
    uint8[ptr++] = tiles.open_default;
    for (var tileIdx in tiles.tiles) {
      payload = tiles.tiles[tileIdx].payload;

      // build an array of icon_keys, give default tile's Icons priority if open_default is set
      if (tileIdx == tiles.default_idx && tiles.open_default) {
        icon_keys = icon_keys.concat(payload.icon_keys);
      } else {
        icon_keys = payload.icon_keys.concat(icon_keys);
      }

      uint8[ptr++] = self.toGColor(payload.color);
      uint8[ptr++] = self.toGColor(payload.highlight);

      for (var idx in payload.texts) {
        t = payload.texts[idx].slice(0, MAX_STR_LENGTH);
        uint8[ptr++] = t.length + 1;
        ptr = self.packString(uint8, t, ptr);
      }

      for (var idx in payload.icon_keys) {
        k = payload.icon_keys[idx].slice(0, MAX_HASH_LENGTH);;
        uint8[ptr++] = k.length + 1;
        ptr = self.packString(uint8, k, ptr);
      }
    }
    // Generate a unique list of icon_keys and pack as many as the icon buffer can store without looping to 
    // send alongside the tile data. This is just to try and speed up icon download a little on initial app open
    icon_keys = icon_keys.filter(function(v, i, s) {return (s.indexOf(v) === i && v != ""); });
    // Sort icon_keys so base64 encoded strings are last and resource ids are first, this stops 'gaps' appearing
    // in the icon_array when resource ids are restored from persistant storage
    icon_keys = icon_keys.sort(function(a, b) { 
      if (typeof(Icon.find(a)) === 'string' && typeof(Icon.find(b)) === 'string') {
        return 0;
      } else if (typeof(Icon.find(a)) === 'string' && typeof(Icon.find(b)) !== 'string') {
        return 1;
      } else {
        return -1;
      }
    });
    var unique_keys_slice = icon_keys.slice(0, getPlatformLimits().iconArraySize)
    debug(2, "Quick Icons: " + JSON.stringify(unique_keys_slice));
    for (var keyIdx in unique_keys_slice) {
      key = unique_keys_slice[keyIdx].slice(0, MAX_HASH_LENGTH);
      uint8[ptr++] = key.length + 1;
      ptr = self.packString(uint8, key, ptr);
    }
    
    // We now know the size of our buffer thanks to ptr, slice our temp to create a correctly sized final buffer.
    var buffer_2 = buffer.slice(0,ptr);
    var uint8_2 = new Uint8Array(buffer_2);

    for (var key in payload) {
      debug(3, key + ": " + payload[key]);
      debug(3, Array.apply([], uint8_2).join(","));
    }
    debug(1, "Completed tile packing (" + (ptr / 1024).toFixed(2) + "kB)");
    Comms.processData(buffer_2, TransferType.TILE, session);
  }
};
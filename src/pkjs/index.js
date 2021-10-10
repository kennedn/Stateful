window.global = window;

require('./polyfills/strings');
var Buffer = require('buffer/').Buffer;
var Headers = require('../../headers.json');
var Clay = require('pebble-clay');
var customClay = require('./custom-clay');
var clayConfig = require('./config')
var messageKeys = require('message_keys')
var clay = new Clay(clayConfig, customClay, {autoHandleEvents: false});

// var clayTemplate = require('./clay-templates');
var baseURL = (Pebble.getActiveWatchInfo().model.indexOf('emu') != -1) ? "http://thinboy.int" : "https://kennedn.com"
var DEBUG = 3;
var MAX_CHUNK_SIZE = (Pebble.getActiveWatchInfo().model.indexOf('aplite') != -1) ? 256 : 8200;
var ICON_BUFFER_SIZE = (Pebble.getActiveWatchInfo().model.indexOf('aplite') != -1) ? 4 : 10;
var MAX_TEXT_SIZE = 24;
 
var no_transfer_lock = false;



// Called when the message send attempt succeeds
function messageSuccessCallback() {
  if (DEBUG > 1) console.log("Message send succeeded.");  
}

// Called when the message send attempt fails
function messageFailureCallback() {
  if (DEBUG > 1) console.log("Message send failed.");
}

//todo find out how uploaded icons and pre-packaged differ on c side
// Fade status color back to default?
const Icons = {
  "ICON_DEFAULT": 1,
  "ICON_TV": 2,
  "ICON_BULB": 3,
  "ICON_MONITOR": 4,
  "ICON_TEST": 5
}
const TransferType = {
  "ICON": 0,
  "TILE": 1,
  "XHR": 2,
  "COLOR": 3,
  "ERROR": 4,
  "ACK": 5,
  "READY": 6,
  "NO_CLAY": 7,
  "REFRESH": 8,
};
const Color = {
  "GOOD": 0,
  "BAD": 1,
  "ERROR": 2,
};
const Button = {
  "0": "up",
  "1": "up_hold",
  "2": "mid",
  "3": "mid_hold",
  "4": "down",
  "5": "down_hold"
};

const ButtonTypes = ['up', 'up_hold', 'mid', 'mid_hold', 'down', 'down_hold'];
const ButtonNames = ['UP', 'UP OVERFLOW', 'MID', 'MID OVERFLOW', 'DOWN', 'DOWN OVERFLOW'];

const CallType = {
  "LOCAL": 0,
  "STATEFUL": 1,
  "STATUS_ONLY": 2,
  "DISABLED": 3
};

var icons = {
  "356a192b": 1,
  "da4b9237": 2,
  "77de68da": 3,
  "1b645389": 4,
  "ac3478d6": 5,
  "b1e98808": "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",
  "202eb9f1": "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",
  "84d30b57": "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",
}


//! create a sub-object, with items that end with a given substring
//! Substring is additionally stripped from the keys in the return object
//! @param obj An object
//! @param substring A string to search the end of every key for
function keyEndsWith(obj, substring) {
  var ret = {};
  for (var key in obj) {
    if (key.endsWith(substring)) {
      ret[key.slice(0,key.length - substring.length)] = obj[key];
    }
  }
  return ret;
}

//! create a sub-object, with items that start with a given substring
//! Substring is additionally stripped from the keys in the return object
//! @param obj An object
//! @param substring A string to search the start of every key for
function keyStartsWith(obj, substring) {
  var ret = {};
  for (var key in obj) {
    if (key.startsWith(substring)) {
      ret[key.slice(substring.length, key.length)] = obj[key];
    }
  }
  return ret;
}

//! Builds a tiles object from the flat packed clay-settings object
//! Using structured ID's to figure out object levels
function clayToTiles() {
  no_transfer_lock = true;
  var tiles = {}
  var claySettings = JSON.parse(localStorage.getItem('clay-settings'));

  try {
    tiles = JSON.parse(claySettings['json_string']);
    claySettings['pebblekit_message'] = "Current JSON loaded correctly";
  } catch(e) {
    claySettings['pebblekit_message'] = "Error: " + e;
    Pebble.openURL(clay.generateUrl());
  }

  localStorage.setItem('clay-settings', JSON.stringify(claySettings));
  localStorage.setItem('tiles', JSON.stringify(tiles));
  Pebble.sendAppMessage({"TransferType": TransferType.REFRESH },function() {
    Pebble.sendAppMessage({"TransferType": TransferType.READY }, messageSuccessCallback, messageFailureCallback);
  }, messageFailureCallback);
  no_transfer_lock = false;
}

function packIcon(key, index) {
  if (no_transfer_lock) {return;}
  var buffer = new ArrayBuffer(1000000);
  var uint8 = new Uint8Array(buffer);
  var ptr = 0;

  var icon = icons[key];

  if (icon == null) {
    return;
  }

  uint8[ptr++] = index;
  
  if (DEBUG > 1) { console.log("Sending icon " + key); }
  if (typeof(icon) == 'string') {
    if(Pebble.getActiveWatchInfo().model.indexOf('aplite') != -1) {
      if (DEBUG > 1) { console.log("aplite detected, icon_size: " + 1); }
      uint8[ptr++] = 1;
      uint8[ptr++] = 0;
      uint8[ptr++] = 1;
    } else {
      var buff = Buffer.from(icon, 'base64');
      if (DEBUG > 1) { console.log("icon_size: " + buff.length); }
      uint8[ptr++] = buff.length & 0xff;
      uint8[ptr++] = buff.length >> 8;
      for (var i=0; i < buff.length; i++) {
        uint8[ptr++] = buff[i];
      }
    }
  } else {
    if (DEBUG > 1) { console.log("icon_size: " + 1); }
    uint8[ptr++] = 1;
    uint8[ptr++] = 0;
    uint8[ptr++] = icon;
  }
  var buffer_2 = buffer.slice(0, ptr);
  var uint8_2 = new Uint8Array(buffer_2);

  if (DEBUG > 2) {
    console.log(Array.apply([], uint8_2).join(","));
  }

  processData(buffer_2, TransferType.ICON, index);
}

function packTiles() {
  if (no_transfer_lock) {return;}
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

  if (tiles == null || tiles.tiles.length == 0) {
    Pebble.sendAppMessage({"TransferType": TransferType.NO_CLAY}, messageSuccessCallback, messageFailureCallback);
    return;
  }

  // pack tile variables into the buffer object, incrementing our pointer each time
  uint8[ptr++] = tiles.tiles.length;
  uint8[ptr++] = Math.max(0, Math.min(tiles.tiles.length - 1, tiles.default_idx));
  uint8[ptr++] = tiles.open_default;
  for (var tileIdx in tiles.tiles) {
    payload = tiles.tiles[tileIdx].payload;

    // build an array of icon_keys, give default tile's icons priority if open_default is set
    if (tileIdx == tiles.default_idx && tiles.open_default) {
      icon_keys = payload.icon_keys.concat(icon_keys);
    } else {
      icon_keys = icon_keys.concat(payload.icon_keys);
    }

    uint8[ptr++] = toGColor(payload.color);
    uint8[ptr++] = toGColor(payload.highlight);

    for (var idx in payload.texts) {
      t = payload.texts[idx];
      uint8[ptr++] = t.length + 1;
      ptr = packString(uint8, t, ptr);
    }

    for (var idx in payload.icon_keys) {
      k = payload.icon_keys[idx];
      uint8[ptr++] = k.length + 1;
      ptr = packString(uint8, k, ptr);
    }
  }
  // Aplite doesn't have the memory capacity to support external icons
  if (!Pebble.getActiveWatchInfo().model.indexOf('aplite') != -1) {
    // Generate a unique list of icon_keys and pack as many as the icon buffer can store without looping to 
    // send alongside the tile data. This is just to try and speed up icon download a little on initial app open
    icon_keys = icon_keys.filter(function(v, i, s) {return (s.indexOf(v) === i); });
    if (DEBUG > 1) { console.log("Quick Icons: " + JSON.stringify(icon_keys)); }
    var unique_keys_slice = icon_keys.slice(0, ICON_BUFFER_SIZE)
    for (var keyIdx in unique_keys_slice) {
      key = unique_keys_slice[keyIdx]
      uint8[ptr++] = key.length + 1;
      ptr = packString(uint8, key, ptr);
    }
  }
  
  // We now know the size of our buffer thanks to ptr, slice our temp to create a correctly sized final buffer.
  var buffer_2 = buffer.slice(0,ptr);
  var uint8_2 = new Uint8Array(buffer_2);

  if (DEBUG > 2) {
    for (var key in payload)
      console.log(key + ": " + payload[key]);
    console.log(Array.apply([], uint8_2).join(","));
  }

  processData(buffer_2, TransferType.TILE);
}


/**
 * Returns a GColor8 (uint8_t) representation of a hex color code, replicates GColorFromHEX()
 * @param {string} hexString
 * @param {int} position
 * @return {int}
 */
function toGColor(hexString) {
  // Split hexString into 2 char array [r, g, b], bitshift and pad each element, 
  // then join and parse into uint8_t.
  if (hexString.length < 6) {
    hexString = hexString.padStart(6, '0');
  } else if (hexString.length > 6) {
    return 255;
  }
  return parseInt("11" + hexString.match(/.{1,2}/g).map(function(hex) { 
    return (parseInt(hex, 16) >> 6).toString(2).padStart(2, '0')}).join(''), 2); 
}

/**
 * Assigns each byte of a string to uint8Array, including null terminator
 * @param {Uint8Array} uint8Array
 * @param {string} str
 * @param {int} idx 
 */
function packString(uint8Array, str, idx) {
  if(idx + (str.length + 1) > uint8Array.length) throw new Error("Index out of range");
  for (var c=0; c < str.length; c++) {
    uint8Array[c+idx] = str.charCodeAt(c);
  }
  uint8Array[c+idx+1] = 0x00;
  if (DEBUG > 2) {
    console.log("String: " + str + ", Length: " + str.length + ", c + idx: " + (c + idx) + ", uint8Length: " + uint8Array.length);
  }
  return c+idx+1
}

function sendChunk(array, index, arrayLength, type) {
  // Determine the next chunk size, there needs to be 5 bits of padding for every key sent to stay under threshold
  var chunkSize = MAX_CHUNK_SIZE - (24 * 2);
  if(arrayLength - index < chunkSize) {
    // Will only need one more chunk
    chunkSize = arrayLength - index;
  } 
  if (DEBUG > 0)
    console.log("ChunkSize: " +chunkSize);
  // Prepare the dictionary
  var dict = {
    'TransferChunk': array.slice(index, index + chunkSize),
    'TransferChunkLength': chunkSize,
    'TransferIndex': index,
    'TransferType': type
  };

  // Send the chunk
  Pebble.sendAppMessage(dict, function() {
    // Success
    index += chunkSize;

    if(index < arrayLength) {
      // Send the next chunk
      sendChunk(array, index, arrayLength, type);
    } else {
      // Done
      Pebble.sendAppMessage({
        'TransferComplete': arrayLength,
        'TransferType': type});
    }
  }, function(obj, error) {
    if (DEBUG > 1) { console.log('Failed to send chunk, reattempting'); }
    setTimeout(1000, function() {sendChunk(array, index, arrayLength, type);});
  });
}

function transmitData(array, type) {
  var index = 0;
  var arrayLength = array.length;
  
  // Transmit the length for array allocation
  Pebble.sendAppMessage({
    'TransferLength': arrayLength,
    'TransferType' : type}, function(e) {
    // Success, begin sending chunks
    sendChunk(array, index, arrayLength, type);
  }, function(e) {
   if (DEBUG > 1) { console.log('Failed to send data length to Pebble!'); }
  });
}

function processData(data, type) {
  // Convert to a array
  var byteArray = new Uint8Array(data);
  var array = [];
  for(var i = 0; i < byteArray.byteLength; i++) {
    array.push(byteArray[i]);
  }
  // Send chunks to Pebble
  transmitData(array, type);
}

function downloadImage(i, callback) {
    console.log("Icon need retrieved");
    var request = new XMLHttpRequest();
    request.onload = function() {
      console.log("Downloaded with return code " + this.status);
      if(this.status < 400) {
        console.log("Saving icon to json");
        tile.payload.icons[i] = Buffer.from(this.responseText).toString('base64');
        callback()
        // localStorage.setItem("tile", JSON.stringify(tile));
        // console.log(localStorage.getItem("tile"));
        // processData(this.responseText, TransferType.ICON);
      }
    };
    request.responseType = "arraybuffer";
    request.open("GET", tile.payload.icons[i]);
    request.send();
  // }
}

function xhrRequest(method, url, headers, data, maxRetries, callback) {
  if (typeof(maxRetries) == 'number'){
    maxRetries = [maxRetries, maxRetries];
  }

  var request = new XMLHttpRequest();
  request.onload = function() {
    if(this.status < 400) {
      var returnData = {};
      try {
        returnData = JSON.parse(this.responseText);
        if (DEBUG > 1) {
          console.log("Response data: " + JSON.stringify(returnData));
        }
      } catch(e) {
        Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.ERROR }, messageSuccessCallback, messageFailureCallback);
        return;
      }
      Pebble.sendAppMessage({"TransferType": TransferType.ACK}, messageSuccessCallback, messageFailureCallback);
      if (DEBUG > 1) { console.log("Status: " + this.status); }
      if (callback) { callback(); } 
    } else {
      // Pebble.sendAppMessage({"TransferType": TransferType.ERROR}, messageSuccessCallback, messageFailureCallback);
      Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.ERROR }, messageSuccessCallback, messageFailureCallback);
    }
  };

  if (DEBUG > 1) {
    console.log("URL: " + url);
    console.log("Method: " + method);
    console.log("Data: " + JSON.stringify(data));
  }
  request.onerror = function(e) { 
    if (DEBUG > 1 ) { console.log("Timed out"); }
    Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.ERROR }, messageSuccessCallback, messageFailureCallback);
  };
  request.ontimeout  = function(e) { 
    if (DEBUG > 1 ) { console.log("Timed out"); }
    if (maxRetries[1] > 0) {
      setTimeout(function() {xhrRequest(method, url, headers, data, [maxRetries[0], maxRetries[1] - 1], callback)},  307 * (maxRetries[0] - maxRetries[1]));
    } else {
      Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.ERROR }, messageSuccessCallback, messageFailureCallback);
    }
  };
  request.open(method, url);
  request.timeout = 4000;
  for (var key in headers) {
    if(headers.hasOwnProperty(key)) {
      if (DEBUG > 1) { console.log("Setting header: " + key + ": " + headers[key]); }
      request.setRequestHeader(key, headers[key]);
    }
  }
  request.send(JSON.stringify(data));  
}				

function xhrStatus(method, url, headers, data, variable, good, bad, maxRetries) {
  var request = new XMLHttpRequest();

  if (typeof(maxRetries) == 'number'){
    maxRetries = [maxRetries, maxRetries];
  }

  repeatCall = function() {
    if (maxRetries[1] > 0) {
      setTimeout(function() {xhrStatus(method, url, headers, data, variable, good, bad, [maxRetries[0], maxRetries[1] - 1])}, 100 * (maxRetries[0] - maxRetries[1]));
    } else {
      Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.ERROR }, messageSuccessCallback, messageFailureCallback);
    }
  };

  request.ontimeout = request.onerror = function(e) { 
    if (DEBUG > 1 ) { console.log("Timed out"); }
    repeatCall();
  };

  request.onload = function() {
    if(this.status < 400) {
      var returnData = {};
      try {
        returnData = JSON.parse(this.responseText);
        var variable_split = variable.split(".")
        for (var j in variable_split) {
          returnData = returnData[variable_split[j]];
        }
        if (DEBUG > 1) {
          console.log("Response data: " + JSON.stringify(returnData));
        }
      } catch(e) {
        Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.ERROR }, messageSuccessCallback, messageFailureCallback);
        return;
      }
      if (DEBUG > 1) { 
        console.log("Status: " + this.status);
        console.log("result: " + returnData + " maxRetries: " + maxRetries[1])
      }

      switch(returnData) {
        case good:
          Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.GOOD }, messageSuccessCallback, messageFailureCallback);
          break;
        case bad:
          Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.BAD }, messageSuccessCallback, messageFailureCallback);
          break;
        default:
          repeatCall();
      }

    } else {
        repeatCall();
    }
  };

  if (DEBUG > 1) {
    console.log("URL: " + url);
    console.log("Method: " + method);
    console.log("Data: " + JSON.stringify(data));
  }

  request.open(method, url);
  request.timeout = 4000;
  for (var key in headers) {
    if(headers.hasOwnProperty(key)) {
      if (DEBUG > 1) { console.log("Setting header: " + key + ": " + headers[key]); }
      request.setRequestHeader(key, headers[key]);
    }
  }
  request.send(JSON.stringify(data));  
}				

//! Issues a dud XHR on a timer, this is to work around battery saving optimisations on android
//! that limit connectivity when the screen is off, eventually causing timeouts for valid XHR requests
//! @param url URL to initiate XHR GET to
//! @param Any headers required to authenticate, probably redundant for this use case
function xhrKeepAlive(url, headers) {
  var request = new XMLHttpRequest();
  request.open('GET', url);
  for (var key in headers) {
    if(headers.hasOwnProperty(key)) {
      if (DEBUG > 1) { console.log("Setting header: " + key + ": " + headers[key]); }
      request.setRequestHeader(key, headers[key]);
    }
  }
  request.send();  
  setTimeout(function() {
    if (DEBUG > 2) { console.log('xhrKeepAlive fired'); }
    request.abort();
    xhrKeepAlive();
  }, 5000);
}				

// Called when incoming message from the Pebble is received
Pebble.addEventListener("appmessage", function(e) {
  var dict = e.payload;
  if (DEBUG > 1) 
    console.log('Got message: ' + JSON.stringify(dict));

  switch(dict.TransferType) {
    case TransferType.ICON:
      if (!(dict.hasOwnProperty("IconKey")) || !(dict.hasOwnProperty("IconIndex"))) {
        if (DEBUG > 1)
          console.log("didn't receive expected data");
        return;
      }
      packIcon(dict.IconKey, dict.IconIndex);
    break;
    case TransferType.TILE:
      packTiles();
      break;
    case TransferType.READY:
      if (DEBUG > 1)
        console.log("Sending Ready message");
      Pebble.sendAppMessage({"TransferType": TransferType.READY }, messageSuccessCallback, messageFailureCallback);
      // packTiles(tiles);
    break;

    case TransferType.XHR:
      if (!(dict.hasOwnProperty("RequestIndex")) || !(dict.hasOwnProperty("RequestButton"))) {
        if (DEBUG > 1)
          console.log("didn't receive expected data");
        return;
      }


      // find the tile that matches the id recieved from appmessage
      var tiles = JSON.parse(localStorage.getItem('tiles'));
      var tile = tiles.tiles[dict.RequestIndex];
      if (tile == null) { 
        if (DEBUG > 1) { console.log("Could not locate tile with id " + id); }
        return;
      }
      var button = tile.buttons[Button[dict.RequestButton]];
      if (button == null) { 
        if (DEBUG > 1) 
          console.log('Got message: ' + JSON.stringify(dict));
        return;
      }

      var url = (tiles.base_url != null) ? tiles.base_url + button.url : button.url;
      var headers = (tiles.headers != null) ? tiles.headers : button.headers;
      switch(button.type) {
        case CallType.STATEFUL:
          var status = button.status
          var status_url = (tiles.base_url != null) ? tiles.base_url + status.url : status.url;
          var status_headers = (tiles.headers != null) ? tiles.headers : status.headers;
          var data = {};
          if (Array.isArray(button.data)) {
            if (button.index == null) { 
              button.index = 0;
            }
            data = button.data[button.index];
            if (DEBUG > 1) { console.log("Button has multiple endpoints, using idx: " + button.index)}
            button.index = (button.index + 1) % button.data.length;
            
          } else {
            if (DEBUG > 1) { console.log("Button has single endpoint")}
            data = button.data;
          }
          xhrRequest(button.method, url, headers, data, 20, function() { 
            xhrStatus(status.method, status_url, status_headers, status.data, status.variable, status.good, status.bad, 25); 
          });
          break;
        case CallType.LOCAL:
          var data = {};
          var highlight_idx = -2;
          if (Array.isArray(button.data)) {
            if (button.index == null) { 
              button.index = 0;
            }
            data = button.data[button.index];
            if (DEBUG > 1) { console.log("Button has multiple endpoints, using idx: " + button.index)}
            if (button.data.length == 2) { highlight_idx = button.index; }
            button.index = (button.index + 1) % button.data.length;
          } else {
            if (DEBUG > 1) { console.log("Button has single endpoint")}
            data = button.data;
          }
          if (DEBUG > 1) { console.log("highlight idx: " + highlight_idx)}
          xhrRequest(button.method, url, headers, data, 20, function() { 
            Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": highlight_idx }, messageSuccessCallback, messageFailureCallback);
          });
          break;
        case CallType.STATUS_ONLY:
          xhrStatus(button.method, url, headers, button.data, button.variable, button.good, button.bad, 25); 
          break;
        default:
          if (DEBUG > 1) { console.log("Unknown type: " + button.type); }
          break;
      }
      localStorage.setItem('tiles', JSON.stringify(tiles)); // Commits any changes to index trackers to localStorage
    break;
  }
});


Pebble.addEventListener('ready', function() {
  console.log("And we're back");
  // var claySettings = JSON.parse(localStorage.getItem('clay-settings'));
  // var tiles = null;
  // try {
  //   tiles = JSON.parse(claySettings['json_string']);
  // } catch(e) { 
  //   tiles = null;
  // }
  // if(tiles != null && tiles.keep_alive) { xhrKeepAlive(); }
  Pebble.sendAppMessage({"TransferType": TransferType.READY }, messageSuccessCallback, messageFailureCallback);
});


Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL(clay.generateUrl());
});


Pebble.addEventListener('webviewclosed', function(e) {
  if (e && !e.response) {
    return;
  }
  // Get the keys and values from each config item
  var dict = clay.getSettings(e.response);
  var clayJSON = JSON.parse(dict[messageKeys.ClayJSON]);

  switch(clayJSON.action) {
    case "AddTile":
      Pebble.openURL(clay.generateUrl());
      break;
    // case "LoadIcon":
    //   //Attempt a clayConfig data URI insert with provided payload (url)
    //   //Re-open config page when promise returns.
    //   insertDataURL(clayJSON.payload).then(function () {
    //       console.log("Image parse Success, Re-opening pebbleURL");
    //       Pebble.openURL(clay.generateUrl());
    //     },function () {
    //       console.log("Image parse Failure, Re-opening pebbleURL");
    //       Pebble.openURL(clay.generateUrl());
    //     });
    //   break;
    case "Submit":
      // Decode and parse config data as JSON
      var settings = clayJSON.payload;

      // flatten the settings for localStorage
      var settingsStorage = {};
      settings.forEach(function(e) {
        if (typeof e === 'object' && e.id) {
          settingsStorage[e.id] = e.value;
        } else {
          settingsStorage[e.id] = e;
        }
      });
      localStorage.setItem('clay-settings', JSON.stringify(settingsStorage));
      clayToTiles();
      break;
  }
});

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

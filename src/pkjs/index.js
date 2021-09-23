var Buffer = require('buffer/').Buffer;
var headers = require('../../headers.json');
var DEBUG = 3;
//var IMG_URL = 'https://i.imgur.com/gzLWQXf.png'; //bulb
//var IMG_URL = 'https://i.imgur.com/tQOn2aw.png'; //tv
//var IMG_URL = 'http://pc.int:8080/tv.png';
var IMG_URL = 'https://kennedn.com/images/deleted.png'
var MAX_CHUNK_SIZE = 7800;  // Needs to be slightly smaller than app_message_inbox_size_maximum()

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
const text_size = 12
const TransferType = {
  "ICON": 0,
  "TILE": 1,
  "RESPONSE": 2,
  "ERROR": 3,
  "ACK": 4
};
const TransferStatus = {
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

const XHRType = {
  "NORMAL": 0,
  "CALLBACK": 1
};
tiles = [
   {
    "headers": headers,
    "payload": {
      "id": 1,
      "color": "0055aa",
      "highlight": "00aaff",
      "texts": [
        "office",
        "attic",
        "bedroom",
        "hall up",
        "tv",
        "hall down",
        "lights"
      ],
      "icons": [
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_DEFAULT,
        Icons.ICON_BULB,
        Icons.ICON_BULB
      ]
    },
    "buttons": {
      "base_url": "https://kennedn.com/api/v1.0/",
      "up": {
        "method": "PUT",
        "url": "wifi_bulb/office",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/office",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "up_hold": {
        "method": "PUT",
        "url": "wifi_bulb/attic",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/attic",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "mid": {
        "method": "PUT",
        "url": "wifi_bulb/bedroom",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/bedroom",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "mid_hold": {
        "method": "PUT",
        "url": "wifi_bulb/hall_up",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/hall_up",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "down": {
        "method": "PUT",
        "url": "tvcom/ir_key",
        "data": {"code": "power"},
        "status": {
          "method": "PUT",
          "url": "tvcom/power",
          "data": {"code": "status"},
          "variable": "status",
          "good": 'on',
          "bad": 'off'
        }
      },
      "down_hold": {
        "method": "PUT",
        "url": "wifi_bulb/hall_down",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/hall_down",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      }
    }
  },
  {
    "headers": headers,
    "payload": {
      "id": 2,
      "color": "550055",
      "highlight": "5500aa",
      "texts": [
        "bulb on",
        "bulb off",
        "lamp on",
        "lamp off",
        "tv",
        "input",
        "livingroom"
      ],
      "icons": [
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_TV,
        Icons.ICON_TV,
        Icons.ICON_TV
      ]
    },
    "buttons": {
      "base_url": "https://kennedn.com/api/v1.0/",
      "up": {
        "method": "PUT",
        "url": "bulb_old",
        "multi_data": {
          "index": 0,
          "good": 0,
          "bad": 1,
          "data": [
            {"code": "on"},
            {"code": "off"}
          ]
        }
      },
      "up_hold": {
        "method": "PUT",
        "url": "bulb_old",
        "data": {"code": "off"},
      },
      "mid": {
        "method": "PUT",
        "url": "bulb",
        "data": {"code": "on"},
      },
      "mid_hold": {
        "method": "PUT",
        "url": "bulb",
        "data": {"code": "off"},
      },
      "down": {
        "method": "PUT",
        "url": "tvcom/ir_key",
        "data": {"code": "power"},
        "status": {
          "method": "PUT",
          "url": "tvcom/power",
          "data": {"code": "status"},
          "variable": "status",
          "good": 'on',
          "bad": 'off'
        }
      },
      "down_hold": {
        "method": "PUT",
        "url": "tvcom/ir_key",
        "data": {"code": "input"}
      }
    }
  },
  {
    "headers": headers,
    "payload": {
      "id": 1,
      "color": "0055aa",
      "highlight": "00aaff",
      "texts": [
        "office",
        "attic",
        "bedroom",
        "hall up",
        "tv",
        "hall down",
        "lights"
      ],
      "icons": [
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_DEFAULT,
        Icons.ICON_BULB,
        Icons.ICON_BULB
      ]
    },
    "buttons": {
      "base_url": "https://kennedn.com/api/v1.0/",
      "up": {
        "method": "PUT",
        "url": "wifi_bulb/office",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/office",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "up_hold": {
        "method": "PUT",
        "url": "wifi_bulb/attic",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/attic",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "mid": {
        "method": "PUT",
        "url": "wifi_bulb/bedroom",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/bedroom",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "mid_hold": {
        "method": "PUT",
        "url": "wifi_bulb/hall_up",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/hall_up",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "down": {
        "method": "PUT",
        "url": "tvcom/ir_key",
        "data": {"code": "power"},
        "status": {
          "method": "PUT",
          "url": "tvcom/power",
          "data": {"code": "status"},
          "variable": "status",
          "good": 'on',
          "bad": 'off'
        }
      },
      "down_hold": {
        "method": "PUT",
        "url": "wifi_bulb/hall_down",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/hall_down",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      }
    }
  },
  {
    "headers": headers,
    "payload": {
      "id": 2,
      "color": "550055",
      "highlight": "5500aa",
      "texts": [
        "bulb on",
        "bulb off",
        "lamp on",
        "lamp off",
        "tv",
        "input",
        "livingroom"
      ],
      "icons": [
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_TV,
        Icons.ICON_TV,
        Icons.ICON_TV
      ]
    },
    "buttons": {
      "base_url": "https://kennedn.com/api/v1.0/",
      "up": {
        "method": "PUT",
        "url": "bulb_old",
        "multi_data": {
          "index": 0,
          "good": -1,
          "bad": -1,
          "data": [
            {"code": "on"},
            {"code": "off"}
          ]
        }
      },
      "up_hold": {
        "method": "PUT",
        "url": "bulb_old",
        "data": {"code": "off"},
      },
      "mid": {
        "method": "PUT",
        "url": "bulb",
        "data": {"code": "on"},
      },
      "mid_hold": {
        "method": "PUT",
        "url": "bulb",
        "data": {"code": "off"},
      },
      "down": {
        "method": "PUT",
        "url": "tvcom/ir_key",
        "data": {"code": "power"},
        "status": {
          "method": "PUT",
          "url": "tvcom/power",
          "data": {"code": "status"},
          "variable": "status",
          "good": 'on',
          "bad": 'off'
        }
      },
      "down_hold": {
        "method": "PUT",
        "url": "tvcom/ir_key",
        "data": {"code": "input"}
      }
    }
  },
  {
    "headers": headers,
    "payload": {
      "id": 1,
      "color": "0055aa",
      "highlight": "00aaff",
      "texts": [
        "office",
        "attic",
        "bedroom",
        "hall up",
        "tv",
        "hall down",
        "lights"
      ],
      "icons": [
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_DEFAULT,
        Icons.ICON_BULB,
        Icons.ICON_BULB
      ]
    },
    "buttons": {
      "base_url": "https://kennedn.com/api/v1.0/",
      "up": {
        "method": "PUT",
        "url": "wifi_bulb/office",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/office",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "up_hold": {
        "method": "PUT",
        "url": "wifi_bulb/attic",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/attic",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "mid": {
        "method": "PUT",
        "url": "wifi_bulb/bedroom",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/bedroom",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "mid_hold": {
        "method": "PUT",
        "url": "wifi_bulb/hall_up",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/hall_up",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "down": {
        "method": "PUT",
        "url": "tvcom/ir_key",
        "data": {"code": "power"},
        "status": {
          "method": "PUT",
          "url": "tvcom/power",
          "data": {"code": "status"},
          "variable": "status",
          "good": 'on',
          "bad": 'off'
        }
      },
      "down_hold": {
        "method": "PUT",
        "url": "wifi_bulb/hall_down",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/hall_down",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      }
    }
  },
  {
    "headers": headers,
    "payload": {
      "id": 2,
      "color": "550055",
      "highlight": "5500aa",
      "texts": [
        "bulb on",
        "bulb off",
        "lamp on",
        "lamp off",
        "tv",
        "input",
        "livingroom"
      ],
      "icons": [
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_TV,
        Icons.ICON_TV,
        Icons.ICON_TV
      ]
    },
    "buttons": {
      "base_url": "https://kennedn.com/api/v1.0/",
      "up": {
        "method": "PUT",
        "url": "bulb_old",
        "multi_data": {
          "index": 0,
          "good": -1,
          "bad": -1,
          "data": [
            {"code": "on"},
            {"code": "off"}
          ]
        }
      },
      "up_hold": {
        "method": "PUT",
        "url": "bulb_old",
        "data": {"code": "off"},
      },
      "mid": {
        "method": "PUT",
        "url": "bulb",
        "data": {"code": "on"},
      },
      "mid_hold": {
        "method": "PUT",
        "url": "bulb",
        "data": {"code": "off"},
      },
      "down": {
        "method": "PUT",
        "url": "tvcom/ir_key",
        "data": {"code": "power"},
        "status": {
          "method": "PUT",
          "url": "tvcom/power",
          "data": {"code": "status"},
          "variable": "status",
          "good": 'on',
          "bad": 'off'
        }
      },
      "down_hold": {
        "method": "PUT",
        "url": "tvcom/ir_key",
        "data": {"code": "input"}
      }
    }
  },
  {
    "headers": headers,
    "payload": {
      "id": 1,
      "color": "0055aa",
      "highlight": "00aaff",
      "texts": [
        "office",
        "attic",
        "bedroom",
        "hall up",
        "tv",
        "hall down",
        "lights"
      ],
      "icons": [
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_DEFAULT,
        Icons.ICON_BULB,
        Icons.ICON_BULB
      ]
    },
    "buttons": {
      "base_url": "https://kennedn.com/api/v1.0/",
      "up": {
        "method": "PUT",
        "url": "wifi_bulb/office",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/office",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "up_hold": {
        "method": "PUT",
        "url": "wifi_bulb/attic",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/attic",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "mid": {
        "method": "PUT",
        "url": "wifi_bulb/bedroom",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/bedroom",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "mid_hold": {
        "method": "PUT",
        "url": "wifi_bulb/hall_up",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/hall_up",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      },
      "down": {
        "method": "PUT",
        "url": "tvcom/ir_key",
        "data": {"code": "power"},
        "status": {
          "method": "PUT",
          "url": "tvcom/power",
          "data": {"code": "status"},
          "variable": "status",
          "good": 'on',
          "bad": 'off'
        }
      },
      "down_hold": {
        "method": "PUT",
        "url": "wifi_bulb/hall_down",
        "data": {"code": "toggle"},
        "status": {
          "method": "PUT",
          "url": "wifi_bulb/hall_down",
          "data": {"code": "status"},
          "variable": "onoff",
          "good": 1,
          "bad": 0
        }
      }
    }
  },
  {
    "headers": headers,
    "payload": {
      "id": 2,
      "color": "550055",
      "highlight": "5500aa",
      "texts": [
        "bulb on",
        "bulb off",
        "lamp on",
        "lamp off",
        "tv",
        "input",
        "livingroom"
      ],
      "icons": [
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_BULB,
        Icons.ICON_TV,
        Icons.ICON_TV,
        Icons.ICON_TV
      ]
    },
    "buttons": {
      "base_url": "https://kennedn.com/api/v1.0/",
      "up": {
        "method": "PUT",
        "url": "bulb_old",
        "multi_data": {
          "index": 0,
          "good": -1,
          "bad": -1,
          "data": [
            {"code": "on"},
            {"code": "off"}
          ]
        }
      },
      "up_hold": {
        "method": "PUT",
        "url": "bulb_old",
        "data": {"code": "off"},
      },
      "mid": {
        "method": "PUT",
        "url": "bulb",
        "data": {"code": "on"},
      },
      "mid_hold": {
        "method": "PUT",
        "url": "bulb",
        "data": {"code": "off"},
      },
      "down": {
        "method": "PUT",
        "url": "tvcom/ir_key",
        "data": {"code": "power"},
        "status": {
          "method": "PUT",
          "url": "tvcom/power",
          "data": {"code": "status"},
          "variable": "status",
          "good": 'on',
          "bad": 'off'
        }
      },
      "down_hold": {
        "method": "PUT",
        "url": "tvcom/ir_key",
        "data": {"code": "input"}
      }
    }
  }
]

function packTile(tiles) {
  var buffer = new ArrayBuffer(1000000);
  var uint8 = new Uint8Array(buffer);
  let ptr = 0;
  let payload;
  for (tile of tiles) {
    payload = tile.payload;

    uint8[ptr++] = payload.id;
    uint8[ptr++] = toGColor(payload.color);
    uint8[ptr++] = toGColor(payload.highlight);

    for (t of payload.texts) {
      uint8[ptr++] = t.length+ 1;
      ptr = packString(uint8, t, ptr);
    }

    for (i of payload.icons) {
      uint8[ptr++] = 1;
      uint8[ptr++] = 0;
      uint8[ptr++] = i;
    }
  }

  var buffer_2 = buffer.slice(0,ptr);
  var uint8_2 = new Uint8Array(buffer_2);

  if (DEBUG > 2) {
    for (var key in payload)
      console.log(key + ": " + payload[key]);
    console.log(Array.apply([], uint8_2).join(","));
  }

  processData(buffer_2, TransferType.TILE);
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join(' ');
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
  return parseInt("11" + hexString.match(/.{1,2}/g).map(hex => 
    (parseInt(hex, 16) >> 6).toString(2).padStart(2, '0')).join(''), 2); 
}

/**
 * Assigns each byte of a string to uint8Array
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
  // Determine the next chunk size
  var chunkSize = MAX_CHUNK_SIZE;
  if(arrayLength - index < MAX_CHUNK_SIZE) {
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
      // Complete!
      Pebble.sendAppMessage({
        'TransferComplete': 0,
        'TransferType': type});
      if (console.time) console.timeEnd('Send Image');
    }
  }, function(obj, error) {
    console.log(error + ": " + JSON.stringify(dict));
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
    console.log('Failed to send data length to Pebble!');
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
  // if (tile.payload.icons[i] !== "") {
  //   console.log("Icon stored locally");
  //   processData(Buffer.from(tile.payload.icons[i], 'base64'), TransferType.ICON);
  // } else {
    console.log("Icon need retrieved");
    var request = new XMLHttpRequest();
    request.onload = function() {
      console.log("Downloaded with return code " + this.status);
      if(this.status === 200) {
        console.log("Saving icon to json");
        tile.payload.icons[i] = Buffer.from(this.response).toString('base64');
        callback()
        // localStorage.setItem("tile", JSON.stringify(tile));
        // console.log(localStorage.getItem("tile"));
        // processData(this.response, TransferType.ICON);
      }
    };
    request.responseType = "arraybuffer";
    request.open("GET", tile.payload.icons[i]);
    request.send();
  // }
}

function xhrRequest(method, base_url, url, headers, data, callback) {
  var request = new XMLHttpRequest();
  request.onload = function() {

    if(this.status == 200) {
      let returnData = JSON.parse(this.response);
      if (DEBUG > 0) {
        console.log("XHRData: " + JSON.stringify(returnData));
        console.log("Status: " + this.status);
      }
      Pebble.sendAppMessage({"TransferType": TransferType.ACK}, messageSuccessCallback, messageFailureCallback);
      if (callback) { callback(); }
    } else {
      // Pebble.sendAppMessage({"TransferType": TransferType.ERROR}, messageSuccessCallback, messageFailureCallback);
      Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": TransferStatus.ERROR }, messageSuccessCallback, messageFailureCallback);
    }
  };

  request.ontimeout = function(e) { console.log("Timed out");};
  request.open(method, base_url + url);
  request.timeout = 4000;
  for (let key in headers) {
    if(headers.hasOwnProperty(key)) {
      if (DEBUG > 1) { console.log("Setting header: " + key + ": " + headers[key]); }
      request.setRequestHeader(key, headers[key]);
    }
  }
  request.send(JSON.stringify(data));  
}				

function xhrStatus(method, base_url, url, headers, data, variable, good, bad, maxRetries=40) {
  var request = new XMLHttpRequest();
  request.onload = function() {

    if(this.status == 200) {
      let returnData = JSON.parse(this.response);
      if (DEBUG > 0) {
        console.log("XHRData: " + JSON.stringify(returnData));
        console.log("Status: " + this.status);
      }
      let r = returnData
      for (let j of variable.split(".")) {
        r = r[j];
      }
      if (DEBUG > 1) { console.log("result: " + r + " maxRetries: " + maxRetries)}
      switch(r) {
        case good:
          Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": TransferStatus.GOOD }, messageSuccessCallback, messageFailureCallback);
          break;
        case bad:
          Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": TransferStatus.BAD }, messageSuccessCallback, messageFailureCallback);
          break;
        default:
          if (maxRetries > 0) {
            setTimeout(function() {xhrStatus(method, base_url, url, headers, data, variable, good, bad, --maxRetries)}, 100);
          } else {
            Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": TransferStatus.ERROR }, messageSuccessCallback, messageFailureCallback);
          }
      }

    } else {
          if (maxRetries > 0) {
            setTimeout(function() {xhrStatus(method, base_url, url, headers, data, variable, good, bad, --maxRetries)}, 100);
          } else {
            Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": TransferStatus.ERROR }, messageSuccessCallback, messageFailureCallback);
          }
    }
  };


  request.ontimeout = function(e) { console.log("Timed out");};
  request.open(method, base_url + url);
  request.timeout = 4000;
  for (let key in headers) {
    if(headers.hasOwnProperty(key)) {
      if (DEBUG > 1) { console.log("Setting header: " + key + ": " + headers[key]); }
      request.setRequestHeader(key, headers[key]);
    }
  }
  request.send(JSON.stringify(data));  
}				

function idxHighlight(index, good, bad) {
  switch(index) {
    case good:
      Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": TransferStatus.GOOD }, messageSuccessCallback, messageFailureCallback);
      break;
    case bad:
      Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": TransferStatus.BAD }, messageSuccessCallback, messageFailureCallback);
      break;
    default:
      Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": -1 }, messageSuccessCallback, messageFailureCallback);
  }
}

// Called when incoming message from the Pebble is received
Pebble.addEventListener("appmessage", function(e) {
  var dict = e.payload;
  if (DEBUG > 1) 
    console.log('Got message: ' + JSON.stringify(dict));
  
  if (!("RequestID" in dict) || !("RequestButton" in dict)) {
    if (DEBUG > 0)
      console.log("didn't receive expected data");
    return;
  }

  let id = dict.RequestID;
  let tile = tiles.find(t => t.payload.id == id);
  if (tile == null) { 
    console.log("Could not locate tile with id " + id);
    return;
  }
  let button = tile.buttons[Button[dict.RequestButton]];
  let base_url = tile.buttons.base_url;
  let headers = tile.headers;

  if ("status" in button) {
    let status = button.status
    xhrRequest(button.method, base_url, button.url, headers, button.data, 
               xhrStatus.bind(null, status.method, base_url, status.url, headers, status.data, status.variable, status.good, status.bad));
  } else if("multi_data" in button) {
    let multi_data = button.multi_data;
    let data = multi_data.data[multi_data.index];
    xhrRequest(button.method, base_url, button.url, headers, data, idxHighlight.bind(null, multi_data.index, multi_data.good, multi_data.bad));
    button.multi_data.index = (multi_data.index + 1) % multi_data.data.length;
  } else {
    xhrRequest(button.method, base_url, button.url, headers, button.data);
  }
});

Pebble.addEventListener('ready', function() {
  console.log("ready");
  setTimeout(function() { Pebble.sendAppMessage({"TransferType": TransferType.ACK}, messageSuccessCallback, messageFailureCallback);}, 1000);
  if (console.time) console.time('Send Image');
  // tiles.forEach(t => packTile(t));
  packTile(tiles);
  // setTimeout(() => packTile(tiles[1]), 3000);
});

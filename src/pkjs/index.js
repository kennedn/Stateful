var rest_data = [["PUT", "tvcom/power", ["off", "on", "status"]],
                 ["PUT", "pc",          ["status", "power"]],
                 ["PUT", "bulb",        ["off", "on"]]];


var DEBUG = 1;
// var IMG_URL = 'https://i.imgur.com/gzLWQXf.png';
var IMG_URL = 'http://pc.int:8080/tv.png';
var MAX_CHUNK_SIZE = 7800;  // Needs to be slightly smaller than app_message_inbox_size_maximum()
var messageKeys = require('message_keys');

var chars = {
    ascii: function () {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    },
    indices: function () {
      if (!this.cache) {
        this.cache = {};
        var ascii = chars.ascii();

        for (var c = 0; c < ascii.length; c++) {
          var chr = ascii[c];
          this.cache[chr] = c;
        }
      }
      return this.cache;
    }
  };

function btoa(data) {
  var ascii = chars.ascii(),
    len = data.length - 1,
    i = -1,
    b64 = '';

  while (i < len) {
    var code = data.charCodeAt(++i) << 16 | data.charCodeAt(++i) << 8 | data.charCodeAt(++i);
    b64 += ascii[(code >>> 18) & 63] + ascii[(code >>> 12) & 63] + ascii[(code >>> 6) & 63] + ascii[code & 63];
  }

  var pads = data.length % 3;
  if (pads > 0) {
    b64 = b64.slice(0, pads - 3);

    while (b64.length % 4 !== 0) {
      b64 += '=';
    }
  }

  return b64;
}
function atob(b64) {
  var indices = chars.indices(),
    pos = b64.indexOf('='),
    padded = pos > -1,
    len = padded ? pos : b64.length,
    i = -1,
    data = '';

  while (i < len) {
    var code = indices[b64[++i]] << 18 | indices[b64[++i]] << 12 | indices[b64[++i]] << 6 | indices[b64[++i]];
    if (code !== 0) {
      data += String.fromCharCode((code >>> 16) & 255, (code >>> 8) & 255, code & 255);
    }
  }

  if (padded) {
    data = data.slice(0, pos - b64.length);
  }

  return data;
}
var Base64Binary = {
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  
  /* will return a  Uint8Array type */
  decodeArrayBuffer: function(input) {
    var bytes = (input.length/4) * 3;
    var ab = new ArrayBuffer(bytes);
    this.decode(input, ab);
    
    return ab;
  },

  removePaddingChars: function(input){
    var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
    if(lkey == 64){
      return input.substring(0,input.length - 1);
    }
    return input;
  },

  decode: function (input, arrayBuffer) {
    //get last chars to see if are valid
    input = this.removePaddingChars(input);
    input = this.removePaddingChars(input);

    var bytes = parseInt((input.length / 4) * 3, 10);
    
    var uarray;
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    var j = 0;
    
    if (arrayBuffer)
      uarray = new Uint8Array(arrayBuffer);
    else
      uarray = new Uint8Array(bytes);
    
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    
    for (i=0; i<bytes; i+=3) {  
      //get the 3 octects in 4 ascii chars
      enc1 = this._keyStr.indexOf(input.charAt(j++));
      enc2 = this._keyStr.indexOf(input.charAt(j++));
      enc3 = this._keyStr.indexOf(input.charAt(j++));
      enc4 = this._keyStr.indexOf(input.charAt(j++));
  
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
  
      uarray[i] = chr1;     
      if (enc3 != 64) uarray[i+1] = chr2;
      if (enc4 != 64) uarray[i+2] = chr3;
    }
  
    return uarray;  
  }
};
// Called when the message send attempt succeeds
function messageSuccessCallback() {
  console.log("Message send succeeded.");  
}

// Called when the message send attempt fails
function messageFailureCallback() {
  console.log("Message send failed.");
}


var tile = localStorage.getItem("tile");
if(tile) {
  tile = JSON.parse(tile);
} else 
  tile = {
    "id": 0x00,
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Basic dG9rZW46aHJYSkM2Z3Nlc205NXBVUmVURHZ3VUpWV0xSd1JTVVE="
    },
    "method": "PUT",
    "url": "https://kennedn.com/api/v1.0/tvcom/power",
    "buttons": {
      "up": {"code": "on"},
      "middle": {"code": "status"},
      "down": {"code": "off"},
      "status": {"code": "status"},
    },
    "icon": "",
    "type": 0x42,
    "color_good": "aa00aa",
    "color_good_hi": "aa00ff",
    "color_bad": "ff0055",
    "color_bad_hi": "ff5555",
    "title": "Tvcom"
  };

  const TransferType = {
    "ICON": 0,
    "TILE": 1,
    "RESPONSE": 2
  };
  const Button = {
    "0": "up",
    "1": "middle",
    "2": "down",
    "3": "status"
  };

function packTile(tile) {
  // Create buffer object, constrain title to a max of 12 chars
  var buffer = new ArrayBuffer(5 + Math.min(12, tile.title.length) + 1);
  var uint8 = new Uint8Array(buffer);
  uint8[0] = tile.id;
  uint8[1] = tile.type;
  uint8[2] = toGColor(tile.color_good);
  uint8[3] = toGColor(tile.color_good_hi);
  uint8[4] = toGColor(tile.color_bad);
  uint8[5] = toGColor(tile.color_bad_hi);
  packString(uint8, tile.title, 6);

  //packString(view, tile.title, 22);
  //console.log(toHexString(view));
  if (DEBUG > 1) {
    for (var key in tile)
      console.log(key + ": " + tile[key]);
  }
  processData(buffer, TransferType.TILE);

  
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
  return parseInt("11" + hexString.match(/.{1,2}/g).map(function(hex, i) {
    return("0" + (parseInt(hex, 16) >> 6).toString(2)).substr(-2);
    }).join(''), 2);
}

/**
 * Returns a hexString for a given byteArray, 
 * @param {Uint8Array} uint8Array
 * @return {string}
 */
function toHexString(uint8Array) {
  return Array.prototype.map.call(uint8Array, function(byte) {
    return ('0' + byte.toString(16)).slice(-2);
  }).join('');
}

/**
 * Assigns each byte of a string to uint8Array
 * @param {Uint8Array} uint8Array
 * @param {string} str
 * @param {int} idx 
 */
function packString(uint8Array, str, idx) {
  if(idx + str.length > uint8Array.length) throw new Error("Index out of range");
  for (var c=0; c < str.length; c++)
    uint8Array[c+idx] = str.charCodeAt(c);
  // Null terminate string
  uint8Array[c+idx] = 0x00;
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
function imageToB64(data) {
  var binary = '';
  var bytes = new Uint8Array(data);
  for (var i=0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function downloadImage() {
  if (tile.icon !== "") {
    console.log("Icon stored locally");
    processData(Base64Binary.decodeArrayBuffer(tile.icon), TransferType.ICON);
  } else {
    console.log("Icon need retrieved");
    var request = new XMLHttpRequest();
    request.onload = function() {
      console.log("Downloaded with return code " + this.status);
      if(this.status === 200) {
        console.log("Saving icon to json: " + imageToB64(this.response));
        tile.icon = imageToB64(this.response);
        localStorage.setItem("tile", JSON.stringify(tile));
        console.log(localStorage.getItem("tile"));
        processData(this.response, TransferType.ICON);
      }
    };
    request.responseType = "arraybuffer";
    request.open("GET", IMG_URL);
    request.send();
  }
}

Pebble.addEventListener('ready', function() {
  if (console.time) console.time('Send Image');
  downloadImage();
  packTile(tile);
  console.log("ready");
});

// // Called when JavaScript is ready
// Pebble.addEventListener("ready", function(e) {
//   if (DEBUG > 0)
//     console.log("JS is ready!");
// });
function xhrRequest(method, url, headers, data) {
  var request = new XMLHttpRequest();
  request.onload = function() {
    var returnData = "";
    try { 
      returnData = JSON.parse(this.response); 
      if(typeof returnData !== "string")
        returnData = returnData[Object.keys(returnData)[0]]; 
    } catch(e) { 
      if (typeof returnData=== "string")
        returnData = this.response;
      else {
        throw new Error("Passed parameter is " + typeof returnData);
      }
    }

    if (DEBUG > 0) {
      console.log("XHRStatus: " + this.status);
      console.log("XHRData: " + returnData);
    }

    if(this.status == 200)
      Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": this.status, "XHRData": returnData}, messageSuccessCallback, messageFailureCallback);
    else
      Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": this.status}, messageSuccessCallback, messageFailureCallback);
  };
  request.ontimeout = function(e) {
    if (DEBUG > 0) {
      console.log("Timed out request");
    }
    Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": "408"});
  };
  // if (DEBUG > 0)
  //   console.log("Trying " +url +"?"+params + " with method " + method);
  request.open(method, url);
  request.timeout = 4000;
  for (var key in headers) {
    if(headers.hasOwnProperty(key)) {
      if (DEBUG > 1)
        console.log("Setting header: " + key + ": " + headers[key]);
      request.setRequestHeader(key, headers[key]);
    }
  }
  request.send(JSON.stringify(data));  
}				

// Called when incoming message from the Pebble is received
Pebble.addEventListener("appmessage", function(e) {
  var dict = e.payload;
  if (DEBUG > 1) 
    console.log('Got message: ' + JSON.stringify(dict));
  
  if (!("RequestID" in dict) || !("RequestButton" in dict)) {
    if (DEBUG > 0)
      console.log("didn't recieve expected data");
    return;
  }

  var method = tile.method;
  var url = tile.url;
  var headers = tile.headers;
  var data = tile.buttons[Button[dict.RequestButton]];
  xhrRequest(method, url, headers, data);
});
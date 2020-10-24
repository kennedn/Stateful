var Buffer = require('buffer/').Buffer;
var DEBUG = 1;
// var IMG_URL = 'https://i.imgur.com/gzLWQXf.png'; //bulb
var IMG_URL = 'https://i.imgur.com/tQOn2aw.png'; //tv
//var IMG_URL = 'http://pc.int:8080/tv.png';
var MAX_CHUNK_SIZE = 7800;  // Needs to be slightly smaller than app_message_inbox_size_maximum()

// Called when the message send attempt succeeds
function messageSuccessCallback() {
  if (DEBUG > 1) console.log("Message send succeeded.");  
}

// Called when the message send attempt fails
function messageFailureCallback() {
  if (DEBUG > 1) console.log("Message send failed.");
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
    "states": {
      "on": 0,
      "off": 1
    },
    "icon": "",
    "type": 0,
    "color_good": "00aa00",
    "color_good_hi": "55aa55",
    "color_bad": "ff0055",
    "color_bad_hi": "ff5555",
    "color_error": "ffaa55",
    "color_error_hi": "ffff00",
    "title": "Tvcom"
  };

  const TransferType = {
    "ICON": 0,
    "TILE": 1,
    "RESPONSE": 2,
    "ERROR": 3,
    "ACK": 4
  };
  const Button = {
    "0": "up",
    "1": "middle",
    "2": "down",
    "3": "status"
  };

  const XHRType = {
    "NORMAL": 0,
    "CALLBACK": 1
  };

function packTile(tile) {
  // Create buffer object, constrain title to a max of 12 chars
  var buffer = new ArrayBuffer(8 + (tile.title.length + 1));
  var uint8 = new Uint8Array(buffer);
  uint8[0] = tile.id;
  uint8[1] = tile.type;
  uint8[2] = toGColor(tile.color_good);
  uint8[3] = toGColor(tile.color_good_hi);
  uint8[4] = toGColor(tile.color_bad);
  uint8[5] = toGColor(tile.color_bad_hi);
  uint8[6] = toGColor(tile.color_error);
  uint8[7] = toGColor(tile.color_error_hi);
  packString(uint8, tile.title, 8);

  //packString(view, tile.title, 22);
  //console.log(toHexString(view));
  if (DEBUG > 1) {
    for (var key in tile)
      console.log(key + ": " + tile[key]);
    console.log(Array.apply([], uint8).join(","));
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
  if(idx + str.length > uint8Array.length) throw new Error("Index out of range");
  for (var c=0; c < str.length; c++)
    uint8Array[c+idx] = str.charCodeAt(c);
  // Null terminate string
  uint8Array[c+idx+1] = 0x00;
  if (DEBUG > 1) {
    console.log("String: " + str + ", Length: " + str.length + ", c + idx: " + (c + idx) + ", uint8Length: " + uint8Array.length);
  }
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

function downloadImage() {
  if (tile.icon !== "") {
    console.log("Icon stored locally");
    processData(Buffer.from(tile.icon, 'base64'), TransferType.ICON);
  } else {
    console.log("Icon need retrieved");
    var request = new XMLHttpRequest();
    request.onload = function() {
      console.log("Downloaded with return code " + this.status);
      if(this.status === 200) {
        console.log("Saving icon to json");
        tile.icon = Buffer.from(this.response).toString('base64');
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
  if (Buffer) console.log("Buffer exists: " + JSON.stringify(Buffer));
  downloadImage();
  packTile(tile);
  console.log("ready");
  xhrRequest(method, url, headers, data, data.code);
});

function xhrRequest(method, url, headers, data, type, typeData={}) {
  var request = new XMLHttpRequest();
  request.onload = function() {
    var returnData = "";
    try { 
      returnData = JSON.parse(this.response); 
      if(typeof returnData !== "string") {
        returnData = returnData[Object.keys(returnData)[0]]; 
      }
    } catch(e) { 
      if (typeof returnData=== "string")
        returnData = this.response;
      else {
        throw new Error("Passed parameter is " + typeof returnData);
      }
    }

    if (DEBUG > 0) {
      console.log("XHRData: " + returnData);
      console.log("Status: " + this.status);
    }
    switch(type) {
      case XHRType.NORMAL:
        if(this.status == 200) {
          if (DEBUG > 0) console.log("In States: " + (returnData in tile.states));
         
          if (returnData in tile.states)
            Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": tile.states[returnData] }, messageSuccessCallback, messageFailureCallback);
          else {
            Pebble.sendAppMessage({"TransferType": TransferType.ACK}, messageSuccessCallback, messageFailureCallback);
            if(tile.type == 0)
              xhrRequest(method, url, headers, tile.buttons.status, XHRType.CALLBACK, {"targetState": data.code});
          }
        }
        else
          Pebble.sendAppMessage({"TransferType": TransferType.ERROR}, messageSuccessCallback, messageFailureCallback);
        break;
      case XHRType.CALLBACK:
        if(this.status == 200) {
          if (DEBUG > 0) console.log("Met Target State: " + (returnData == typeData.targetState));
         
          if (returnData == typeData.targetState)
            Pebble.sendAppMessage({"TransferType": TransferType.RESPONSE, "XHRStatus": tile.states[returnData] }, messageSuccessCallback, messageFailureCallback);
          else
            setTimeout(function() {xhrRequest(method, url, headers, data, XHRType.CALLBACK, {"targetState": typeData.targetState});}, 500);
        }
        else
          setTimeout(function() {xhrRequest(method, url, headers, data, XHRType.CALLBACK, {"targetState": typeData.targetState});}, 500);
      break;

    }
  };
  request.ontimeout = function(e) { console.log("Timed out");};
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
  xhrRequest(method, url, headers, data, XHRType.NORMAL);
  //xhrRequest(method, url, headers, tile.buttons.status, data.code);
});
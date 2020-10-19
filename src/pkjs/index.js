
var rest_data = [["PUT", "tvcom/power", ["off", "on", "status"]],
                 ["PUT", "pc",          ["status", "power"]],
                 ["PUT", "bulb",        ["off", "on"]]];


var DEBUG = 1;
var IMG_URL = 'https://i.imgur.com/gzLWQXf.png';
var MAX_CHUNK_SIZE = 7800;  // From app_message_inbox_size_maximum()
var messageKeys = require('message_keys');
// // Called when the message send attempt succeeds
// function messageSuccessHandler() {
//   console.log("Message send succeeded.");  
// }

// // Called when the message send attempt fails
// function messageFailureHandler() {
//   console.log("Message send failed.");
// }

// function reply_to_query(responseText) {
//   var response = JSON.parse(responseText);
//   if (DEBUG > 0)
//     console.log("Status: " + response[Object.keys(response)[0]]);
//   Pebble.sendAppMessage({"status": response[Object.keys(response)[0]]}, messageSuccessHandler, messageFailureHandler);
// }

// function xhr_request(method, url, params) {
//    var request = new XMLHttpRequest();
//    request.onload = function() {
//    	if(this.status < 300)
//     	reply_to_query(this.responseText);
//     else
//     	reply_to_query('{ "message": "Error" }');
//   };
//   if (DEBUG > 0)
//     console.log("Trying " +url +"?"+params + " with method " + method);
//   request.open(method, url +"?"+params);   
//   request.send();  
// }

var tile = {
  "type": 0x42,
  "base_resource": 0x00,
  "up_call": 0x66,
  "mid_call": 0x01,
  "down_call": 0x02,
  "status_call": 0x03,
  "color_good": "00aa00",
  "color_good_hi": "55aa55",
  "color_bad": "ff0055",
  "color_bad_hi": "ff5555",
  "title": "Bulb!!!"
};

const TransferType = {
  "ICON": 0,
  "TILE": 1
};
/**
 * Returns a GColor8 representation of a hex color code at ${position}, 
 * Replicates the functionality of GColorFromHEX()
 * @param {string} hexString
 * @param {int} position
 * @return {int}
 */
function toGColor(hexString) {
  // Assert that hexString is a hex color code 
  // console.log("11" + hexString.match(/.{1,2}/g).map(function(hex, i) {
  //   return (parseInt(hex, 16) >> 6).toString(2).padStart(2, '0');}).join(''));
   var s = "11" + hexString.match(/.{1,2}/g).map(function(hex, i) {
      var t = "0" + (parseInt(hex, 16) >> 6).toString(2);
      return t.substr(t.length-2);}
      ).join('');
    //console.log(s);
    return parseInt(s, 2);
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
 * Convert and assign each byte of a GColor8 object to uint8Array
 * @param {Uint8Array} uint8Array
 * @param {string} color
 * @param {int} idx 
 */
function packColor(uint8Array, color, idx) {
  if(idx + 2 > uint8Array.length) throw new Error("Index out of range");
  for (var i=0; i < 4; i++)
    uint8Array[i+idx] = toGColor(color, i);
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

function packTile(tile) {
  // Create buffer object, constrain title to a max of 12 chars
  var buffer = new ArrayBuffer(9 + Math.min(12, tile.title.length) + 1);
  var view = new Uint8Array(buffer);
  view[0] = tile.type;
  view[1] = tile.base_resource;
  view[2] = tile.up_call;
  view[3] = tile.mid_call;
  view[4] = tile.down_call;
  view[5] = tile.status_call;
  view[6] = toGColor(tile.color_good);
  view[7] = toGColor(tile.color_good_hi);
  view[8] = toGColor(tile.color_bad);
  view[9] = toGColor(tile.color_bad_hi);
  packString(view, tile.title, 10);

  //packString(view, tile.title, 22);
  //console.log(toHexString(view));
  for (var key in tile)
    console.log(key + ": " + tile[key]);
  processData(buffer, TransferType.TILE);
  
}

function sendChunk(array, index, arrayLength, type) {
  console.log("Entered sendChunk");
  // Determine the next chunk size
  var chunkSize = MAX_CHUNK_SIZE;
  console.log(arrayLength + " - " + index + " < " + MAX_CHUNK_SIZE + " = " + (arrayLength - index < MAX_CHUNK_SIZE));
  if(arrayLength - index < MAX_CHUNK_SIZE) {
    // Will only need one more chunk
    chunkSize = arrayLength - index;
  } 
  console.log("Index: " + index + "\nChunkSize: " +chunkSize);
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
  var request = new XMLHttpRequest();
  request.onload = function() {
    console.log("Downloaded with return code " + this.status);
    processData(this.response, TransferType.ICON);
  };
  request.responseType = "arraybuffer";
  request.open("GET", IMG_URL);
  request.send();
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
												
// // Called when incoming message from the Pebble is received
// Pebble.addEventListener("appmessage", function(e) {
//   var dict = e.payload;
//   if (DEBUG > 1) 
//     console.log('Got message: ' + JSON.stringify(dict));
  
//   if (!("endpoint" in dict) || !("param" in dict)) {
//     if (DEBUG > 0)
//       console.log("didn't recieve expected data");
//     return;
//   }

//   var method = rest_data[dict.endpoint][0];
//   var url = "http://192.168.1.107/api/v1.0/" + rest_data[dict.endpoint][1]; 
//   var param = "code=" + rest_data[dict.endpoint][2][dict.param];
//   xhr_request(method, url, param);
  
// });
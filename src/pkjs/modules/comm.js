var globals = require('./globals');
for (var key in globals) {
  window[key] = globals[key];
}

window.global = window;
var Buffer = require('buffer/').Buffer;

var self = module.exports = {

  processData: function(data, type, session) {
    // Convert to a array
    var byteArray = new Uint8Array(data);
    var array = [];
    for(var i = 0; i < byteArray.byteLength; i++) {
      array.push(byteArray[i]);
    }
    // Send chunks to Pebble
    self.transmitData(array, type, session);
  },

  transmitData: function(array, type, session) {
    var index = 0;
    var arrayLength = array.length;
    
    // Transmit the length for array allocation
    Pebble.sendAppMessage({
      'TransferLength': arrayLength,
      'TransferType': type,
      'Session': session
    }, function(e) {
      // Success, begin sending chunks
      self.sendChunk(array, index, arrayLength, type, session);
    }, function(e) {
      debug(1, 'Failed to send data length to Pebble, reattempting');
      setTimeout(1000, function() {self.transmitData(array, type);});
    });
  },

  sendChunk: function(array, index, arrayLength, type, session) {
    // Determine the next chunk size, there needs to be 5 bits of padding for every key sent to stay under threshold
    var chunkSize = getPlatformLimits().maxChunkSize - (24 * 2);
    if(arrayLength - index < chunkSize) {
      // Will only need one more chunk
      chunkSize = arrayLength - index;
    } 
    debug(2, "ChunkSize: " +chunkSize);
    // Prepare the dictionary
    var dict = {
      'TransferChunk': array.slice(index, index + chunkSize),
      'TransferChunkLength': chunkSize,
      'TransferIndex': index,
      'TransferType': type,
      'Session': session
    };

    // Send the chunk
    Pebble.sendAppMessage(dict, function() {
      // Success
      index += chunkSize;

      if(index < arrayLength) {
      // Send the next chunk
      self.sendChunk(array, index, arrayLength, type);
      } else {
      // Done
      Pebble.sendAppMessage({
        'TransferComplete': arrayLength,
        'TransferType': type,
        'Session': session
      }, null, function() {
        debug(1, 'Failed to send complete message, reattempting');
        setTimeout(1000, function() {self.sendChunk(array, index, arrayLength, type);});
        });
      }
    }, function(obj, error) {
      debug(1, 'Failed to send chunk, reattempting');
      setTimeout(1000, function() {self.sendChunk(array, index, arrayLength, type);});
    });
  }
};
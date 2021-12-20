require('./polyfills/strings');
var globals = require('./modules/globals');
for (var key in globals) {
  window[key] = globals[key];
}
var XHR = require('./modules/xhr')
var Comms = require('./modules/comm')
var ClayHelper = require('./modules/clay')


var Clay = require('pebble-clay');
var customClay = require('./custom-clay');
var clayConfig = require('./config')
var messageKeys = require('message_keys');
var clay = new Clay(clayConfig, customClay, {autoHandleEvents: false});

// var image = require('./modules/image')


// Called when incoming message from the Pebble is received
Pebble.addEventListener("appmessage", function(e) {
  var dict = e.payload;
  debug(3, 'Got message: ' + JSON.stringify(dict));

  switch(dict.TransferType) {
    case TransferType.ICON:
      if (!(dict.hasOwnProperty("IconKey")) || !(dict.hasOwnProperty("IconIndex"))) {
        debug(1, "didn't receive expected data");
        return;
      }
      Comms.packIcon(dict.IconKey, dict.IconIndex);
    break;

    case TransferType.TILE:
      Comms.packTiles();
      break;

    case TransferType.READY:
      debug(1, "Sending Ready message");
      Pebble.sendAppMessage({"TransferType": TransferType.READY }, messageSuccess, messageFailure);
    break;

    case TransferType.XHR:
      if (!(dict.hasOwnProperty("RequestIndex"))) {
        debug(1, "didn't receive expected data");
        return;
      }

      var tiles = localStorage.getItem('tiles');
      try {
        tiles = JSON.parse(tiles);
      } catch(e) {
        Pebble.sendAppMessage({"TransferType": TransferType.REFRESH }, messageSuccess, messageFailure);
        return;
      }

      var tile = tiles.tiles[dict.RequestIndex];
      if (tile == null) { 
        debug(1, "Could not locate tile with id " + id);
        return;
      }

      var button = tile.buttons[Button[dict.RequestButton]];
      if (button == null) { 
         debug(2, 'Button null: ' + JSON.stringify(dict));
        return;
      }

      var hash = (dict.RequestIndex << 20) | (dict.RequestButton << 10) | dict.RequestClicks;
      var url = (tiles.base_url != null) ? tiles.base_url + button.url : button.url;
      // Shouldn't headers be concatinated?
      var headers = (tiles.headers != null) ? tiles.headers : button.headers;

      switch(button.type) {
        case CallType.STATEFUL:
          var status_url = (tiles.base_url != null) ? tiles.base_url + button.status.url : button.status.url;
          var status_headers = (tiles.headers != null) ? tiles.headers : button.status.headers;
          XHR.statefulXHRRequest(button, url, headers, status_url, status_headers, hash);
          break;
        case CallType.LOCAL:
          XHR.localXHRRequest(button, url, headers, hash);
          break;
        case CallType.STATUS_ONLY:
          XHR.statusXHRRequest(button, url, headers, hash);
          break;
        default:
          debug(1, "Unknown type: " + button.type);
          break;
      }
      // Commits any changes to index trackers to localStorage
      localStorage.setItem('tiles', JSON.stringify(tiles)); 
    break;
  }
});


Pebble.addEventListener('ready', function() {
  console.log("And we're back");
  // image.load('http://thinboy.int/icons/tv_8bit.png');
  // image.load('https://i.imgur.com/Bwvvn3P.png');
  Pebble.sendAppMessage({"TransferType": TransferType.READY }, messageSuccess, messageFailure);
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
      ClayHelper.clayToTiles(clay);
      break;
  }
});

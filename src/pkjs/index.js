require('./polyfills/strings');
var globals = require('./modules/globals');
for (var key in globals) {
  window[key] = globals[key];
}
var XHR = require('./modules/xhr');
var Data = require('./modules/data');
var ClayHelper = require('./modules/clay');
var LZString = require ('./vendor/LZString');


var Clay = require('pebble-clay');
var customClay = require('./data/clay_function');
var clayConfig = require('./data/clay_config');
var clay = new Clay(clayConfig, customClay, {autoHandleEvents: false});
var image = require('./modules/image');
var icon = require('./modules/icon');


// Called when incoming message from the Pebble is received
Pebble.addEventListener("appmessage", function(e) {
  var dict = e.payload;
  debug(3, 'Got message: ' + JSON.stringify(dict));

  switch(dict.TransferType) {
    case TransferType.ICON:
      if (!dict.hasOwnProperty("IconKey") || !dict.hasOwnProperty("IconIndex") || !dict.hasOwnProperty("Session")) {
        debug(1, "Icon request didn't contain expected data");
        return;
      }
      Data.packIcon(dict.IconKey, dict.IconIndex, dict.Session);
    break;

    case TransferType.TILE:
      if (!dict.hasOwnProperty("Session")) {
        debug(1, "Tile request didn't contain expected data");
        return;
      }
      Data.packTiles(dict.Session);
      break;

    case TransferType.READY:
      debug(1, "Sending Ready message");
      Pebble.sendAppMessage({"TransferType": TransferType.READY}, messageSuccess, messageFailure);
    break;

    case TransferType.REFRESH:
      debug(1, "Refresh message received");
      localStorage.clear();
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

      switch(parseInt(button.type)) {
        case CallType.STATEFUL:
          var status_url = (tiles.base_url != null) ? tiles.base_url + button.status.url : button.status.url;
          var status_headers = (tiles.headers != null) ? tiles.headers : button.status.headers;
          XHR.statefulXHRRequest(button, url, headers, status_url, status_headers, hash);
          break;
        case CallType.LOCAL:
          XHR.localXHRRequest(button, url, headers, hash);
          break;
        case CallType.STATUS_ONLY:
          var status_url = (tiles.base_url != null) ? tiles.base_url + button.status.url : button.status.url;
          var status_headers = (tiles.headers != null) ? tiles.headers : button.status.headers;
          XHR.statusXHRRequest(button, status_url, status_headers, hash);
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

  image.load('http://thinboy.int/icons/deleted.png', 'Deleted', function(img) {
    debug(1, img.message);
    image.load('http://thinboy.int/icons/rgb.png', 'RGB', function(img) {
      debug(1, img.message);
    });
  });
  Pebble.sendAppMessage({"TransferType": TransferType.READY,}, messageSuccess, messageFailure);
});


Pebble.addEventListener('showConfiguration', function(e) {
  ClayHelper.openURL(clay);
});


Pebble.addEventListener('webviewclosed', function(e) {
  if (e && !e.response) {
    return;
  }
  // Get the keys and values from each config item
  var response = JSON.parse(LZString.decompressFromEncodedURIComponent(e.response));
  // var clayJSON = JSON.parse(dict[messageKeys.ClayJSON]);
  var tiles = response.payload;

  switch(response.action) {
    case "AddTile":
      ClayHelper.addTile(tiles);
      ClayHelper.openURL(clay, "Tile added", ClayAction.TILE_ADD);
      break;
    case "RemoveTile":
      ClayHelper.removeTile(tiles, response.param);
      ClayHelper.openURL(clay, "Tile removed", ClayAction.TILE_REMOVE);
      break;
    case "AddIcon":
      image.load(response.param.url, response.param.label, function(img){
        debug(2, "IMG message: " + img.message);
        ClayHelper.openURL(clay, img.message, (img.status == 200) ? ClayAction.ICON_ADD : ClayAction.ICON_REMOVE);
      });
      break;
    case "RemoveIcon":
      icon.remove(response.param, function(){
        ClayHelper.openURL(clay, "Icon removed", ClayAction.ICON_REMOVE);
      });
      break;
    case "Submit":
      ClayHelper.clayToTiles(tiles);
      break;
  }
});

var globals = require('./globals');
for (var key in globals) {
  window[key] = globals[key];
}

var LZString = require ('../vendor/LZString');
var icon = require('../modules/icon');

var self = module.exports = {
  clayToTiles: function(tiles) {
    // Enforce default values for buttons that changed type on last submit
    for (var i in tiles.tiles) {
      var tile = tiles.tiles[i];
      tile.payload.icon_keys.forEach(function(elm, idx) {
        if (tile.payload.texts[idx] === "") {
          tile.payload.icon_keys[idx] = "";
        }
      });
      for (var j in tile.buttons) {
        var button = tile.buttons[j];
        switch(parseInt(button.type)) {
          case CallType.LOCAL:
	          button.status = {};
            button.status.method = "PUT";
            button.status.url = "";
            button.status.headers = {};
            button.status.data = {};
            button.status.variable = "";
            button.status.good = "";
            button.status.bad = "";
            if (typeof(button.headers) !== 'object'){button.headers = {};}
            if (typeof(button.data) !== 'object'){button.data = {};}
            break;
          case CallType.STATUS_ONLY:
            button.method = "PUT";
            button.url = "";
            button.headers = {};
            button.data = {};
            if (typeof(button.status.headers) !== 'object'){button.headers = {};}
            if (typeof(button.status.data) !== 'object'){button.data = {};}
            break;
          case CallType.STATEFUL:
            if (typeof(button.headers) !== 'object'){button.headers = {};}
            if (typeof(button.data) !== 'object'){button.data = {};}
            if (typeof(button.status.headers) !== 'object'){button.headers = {};}
            if (typeof(button.status.data) !== 'object'){button.data = {};}
            break;
          case CallType.DISABLED:
          default:
            button = {};
            button.status = {};
            button.status.method = "PUT";
            button.status.url = "";
            button.status.headers = {};
            button.status.data = {};
            button.status.variable = "";
            button.status.good = "";
            button.status.bad = "";
            button.type = CallType.DISABLED;
            button.method = "PUT";
            button.url = "";
            button.headers = {};
            button.data = {};
            tile.payload.texts[ButtonIndex[j]] = "";
            tile.payload.icon_keys[ButtonIndex[j]] = "";
        }
      }
    }
    debug(2, "Tiles: " + JSON.stringify(tiles, null, 2));
    localStorage.setItem('tiles', JSON.stringify(tiles));
    Pebble.sendAppMessage({"TransferType": TransferType.REFRESH },function() {
      Pebble.sendAppMessage({"TransferType": TransferType.READY}, messageSuccess, messageFailure);
    }, messageFailure);
  },
  removeTile: function(tiles, index) {
    tiles.tiles.splice(index, 1);
    if (tiles.default_idx > tiles.tiles.length - 1) {
      tiles.default_idx = 0;
    } 
    localStorage.setItem('tiles', JSON.stringify(tiles));
  },
  addTile: function(tiles) {
    tiles.tiles.push(JSON.parse(JSON.stringify(require('../data/tile_object'))));
    localStorage.setItem('tiles', JSON.stringify(tiles));
  },
  openURL: function(clay, message, clayAction) {
    var tiles = localStorage.getItem('tiles');
    try {
      tiles = JSON.parse(tiles);
    } catch(e) {
      tiles = null;
    }
    var claySettings = {};
    if (tiles == null || Object.keys(tiles).length == 0  || tiles.tiles == null || tiles.tiles.length == 0) {
      tiles = JSON.parse(JSON.stringify(require('../data/base_object')));
      self.addTile(tiles);
    }
    for (var i in tiles.tiles) {
      var tile = tiles.tiles[i];
      tile.payload.icon_keys.forEach(function(elm, idx) {
        if (tile.payload.texts[idx] === "") {
          tile.payload.icon_keys[idx] = icon.defaultKey;
        }
      });
    }
    claySettings['ClayJSON'] = LZString.compressToEncodedURIComponent(JSON.stringify([tiles, icon.getClay()]));
    if (typeof(message) !== 'undefined') {
      claySettings['MessageText'] = "<font style='color:#ff4700;'><b>" + message + "</b></font>";
    }
    if (typeof(clayAction) !== 'undefined') {
      claySettings['ClayAction'] = clayAction;
    } else {
      claySettings['ClayAction'] = 0;
    }
    console.log("Payload size: " + (claySettings['ClayJSON'].length / 1024).toFixed(2) + "kB");
    localStorage.setItem('clay-settings', JSON.stringify(claySettings));
    var clayURL = clay.generateUrl();
    console.log("URL size: " + (clayURL.length / 1024).toFixed(2) + "kB");
    Pebble.openURL(clayURL);
    localStorage.removeItem('clay-settings');
  }
};
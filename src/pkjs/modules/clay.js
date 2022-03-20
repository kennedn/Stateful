var globals = require('./globals');
for (var key in globals) {
  window[key] = globals[key];
}

var LZString = require ('../vendor/LZString');
var icon = require('../modules/icon');

var self = module.exports = {
  //! Builds a tiles object from the flat packed clay-settings object
  //! Using structured ID's to figure out object levels
  clayToTiles: function(tiles) {
    // Enforce default values for buttons that changed type on last submit
    for (var i in tiles.tiles) {
      var tile = tiles.tiles[i];
      for (var j in tile.buttons) {
        var button = tile.buttons[j];
        switch(parseInt(button.type)) {
          case CallType.LOCAL:
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
            button.type = CallType.DISABLED;
            button.status.method = "PUT";
            button.status.url = "";
            button.status.headers = {};
            button.status.data = {};
            button.status.variable = "";
            button.status.good = "";
            button.status.bad = "";
            button.method = "PUT";
            button.url = "";
            button.headers = {};
            button.data = {};
            tile.payload.texts[ButtonIndex[j]] = "";
            tile.payload.icon_keys[ButtonIndex[j]] = "";
        }
      }
    }
    debug(2, JSON.stringify(tiles, null, 2));
    localStorage.setItem('tiles', JSON.stringify(tiles));
    Pebble.sendAppMessage({"TransferType": TransferType.REFRESH },function() {
      Pebble.sendAppMessage({"TransferType": TransferType.READY}, messageSuccess, messageFailure);
    }, messageFailure);
  },
  openURL: function(clay, addNew) {
    var tiles = localStorage.getItem('tiles');
    try {
      tiles = JSON.parse(tiles);
    } catch(e) {
      tiles = null;
    }
    var claySettings = {};
    if (tiles == null || Object.keys(tiles).length == 0  || tiles.tiles == null || tiles.tiles.length == 0) {
      tiles = require('../data/base_object')
      tiles.tiles.push(require('../data/tile_object'));
      tiles.tiles[tiles.tiles.length - 1].payload.icon_keys = Array(7).fill(icon.defaultKey);
      debug(2, "Icon Keys:" + JSON.stringify(tiles.tiles[tiles.tiles.length - 1].payload.icon_keys));
    } else if (addNew){
      tiles.tiles.push(require('../data/tile_object'));
      tiles.tiles[tiles.tiles.length - 1].payload.icon_keys = Array(7).fill(icon.defaultKey);
    }
    for (var i in tiles.tiles){
      var tile = tiles.tiles[i];
    }
    debug(2, "Tiles: " + JSON.stringify(tiles, null, 2));
    localStorage.setItem('tiles', JSON.stringify(tiles));
    claySettings['ClayJSON'] = LZString.compressToEncodedURIComponent(JSON.stringify([tiles, icon.getClay()]));
    console.log("Payload size: " + (claySettings['ClayJSON'].length / 1024).toFixed(2) + "kB");
    localStorage.setItem('clay-settings', JSON.stringify(claySettings));
    Pebble.openURL(clay.generateUrl());
    localStorage.removeItem('clay-settings');
  }
};
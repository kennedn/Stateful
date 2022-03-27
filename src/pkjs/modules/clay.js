var globals = require('./globals');
for (var key in globals) {
  window[key] = globals[key];
}

var LZString = require ('../vendor/LZString');
var icon = require('../modules/icon');

var self = module.exports = {
  clayToTiles: function(tiles) {
    if (tiles == null || Object.keys(tiles).length == 0  || tiles.tiles == null || tiles.tiles.length == 0) {
      debug(2, "clayToTiles: " + JSON.stringify(tiles, null, 2));
      localStorage.setItem('tiles', "{}");
      Pebble.sendAppMessage({"TransferType": TransferType.REFRESH },function() {
        Pebble.sendAppMessage({"TransferType": TransferType.READY}, messageSuccess, messageFailure);
      }, messageFailure);
      return;
    }
    // Enforce default values for buttons that changed type on last submit
    tiles.tiles = tiles.tiles.slice(0, 64) // Max allowed tiles
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
            if (typeof(button.headers) !== 'object' || button.headers === null){button.headers = {};}
            if (typeof(button.data) !== 'object' || button.data === null){button.data = {};}
            break;
          case CallType.STATUS_ONLY:
            button.method = "PUT";
            button.url = "";
            button.headers = {};
            button.data = {};
            if (typeof(button.status.headers) !== 'object' || button.status.headers === null){button.status.headers = {};}
            if (typeof(button.status.data) !== 'object' || button.status.data === null){button.status.data = {};}
            break;
          case CallType.STATEFUL:
            if (typeof(button.headers) !== 'object' || button.headers === null){button.headers = {};}
            if (typeof(button.data) !== 'object' || button.data === null){button.data = {};}
            if (typeof(button.status.headers) !== 'object' || button.status.headers === null){button.status.headers = {};}
            if (typeof(button.status.data) !== 'object' || button.status.data === null){button.status.data = {};}
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
    if (tiles.tiles.length >= getPlatformLimits().maxTiles) {return "Tile not added: Max tiles reached";}
    tiles.tiles.push(JSON.parse(JSON.stringify(require('../data/tile_object'))));
    localStorage.setItem('tiles', JSON.stringify(tiles));
    return "Tile added";
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
      tile.payload.icon_keys.forEach(function(icon_key, idx) {
        if (icon_key !== icon.defaultKey && icon.find(icon_key) === 1) {
          tile.payload.icon_keys[idx] = icon.defaultKey;
        }
      });
    }
    claySettings['ClayJSON'] = LZString.compressToEncodedURIComponent(JSON.stringify([tiles, icon.getClay()]));
    claySettings['ClayAction'] = (typeof(clayAction) !== 'undefined' && clayAction !== null) ? clayAction : 0;
    localStorage.setItem('clay-param-action', claySettings['ClayAction']);
    if (typeof(message) !== 'undefined' && message !== null) {
      claySettings['MessageText'] = "<font style='color:#ff4700;'><b>" + message + "</b></font>";
      localStorage.setItem('clay-param-message', claySettings['MessageText']);
    }

    console.log("Payload size: " + (claySettings['ClayJSON'].length / 1024).toFixed(2) + "kB");
    localStorage.setItem('clay-settings', JSON.stringify(claySettings));
    var clayURL = clay.generateUrl();
    console.log("URL size: " + (clayURL.length / 1024).toFixed(2) + "kB");

    Pebble.openURL(clayURL);
    localStorage.removeItem('clay-settings');
  }
};

var globals = require('./globals');
for (var key in globals) {
  window[key] = globals[key];
}

var self = module.exports = {
  //! Builds a tiles object from the flat packed clay-settings object
  //! Using structured ID's to figure out object levels
  clayToTiles: function(clay) {
    localStorage.setItem("tiles", "");
    var tiles = {}
    var claySettings = JSON.parse(localStorage.getItem('clay-settings'));

    try {
      tiles = claySettings['ClayJSON'];
      claySettings['pebblekit_message'] = "Current JSON loaded correctly";
      localStorage.setItem('clay-settings', JSON.stringify(claySettings));
    } catch(e) {
      claySettings['pebblekit_message'] = "Error: " + e;
      localStorage.setItem('clay-settings', JSON.stringify(claySettings));
      Pebble.sendAppMessage({"TransferType": TransferType.NO_CLAY }, messageSuccess, messageFailure);
      Pebble.openURL(clay.generateUrl());
      return;
    }

    // if tiles object has at least 1 tile
    if (tiles != null && Object.keys(tiles).length != 0  && tiles.tiles != null && tiles.tiles.length != 0) {
      // for (var i=0; i < tiles.tiles.length; i++) {
      //   var icon_keys = tiles.tiles[i].payload.icon_keys;
      //   for (var j=0; j < icon_keys.length; j++) {
      //     if (icon_keys[j] != "" && Object.keys(Icons).indexOf(icon_keys[j]) == -1) {
      //       icon_keys[j] = Default_Icon;
      //     }
      //   }
      // }
      localStorage.setItem('tiles', JSON.stringify(tiles));
      Pebble.sendAppMessage({"TransferType": TransferType.REFRESH },function() {
      Pebble.sendAppMessage({"TransferType": TransferType.READY}, messageSuccess, messageFailure);
      }, messageFailure);
    } else {
      claySettings['pebblekit_message'] = "No tiles present in JSON";
      localStorage.setItem('clay-settings', JSON.stringify(claySettings));
      Pebble.sendAppMessage({"TransferType": TransferType.NO_CLAY }, messageSuccess, messageFailure);
      Pebble.openURL(clay.generateUrl());
      return;
    }
  }
};
var globals = require('./globals');
for (var key in globals) {
  window[key] = globals[key];
}

var default_icons = require('../data/default_icons');

var self = module.exports = {
  getClay: function() {
    var customIconsDict = localStorage.getItem('custom-icons');
    try {
      customIconsDict = JSON.parse(customIconsDict);
    } catch(e) {
      customIconsDict = {};
    }
    var icons = [];
    var customIcons = [];
    var iDevice = /(.+)(iPhone|iPad|iPod)(.+)OS[\s|\_](\d+)[\_|\.]?(\d+)[\_|\.]?(\d+).*/.exec(navigator.userAgent)
    if (iDevice && iDevice[4] < 14) {
      for (var i in default_icons) {
        icons.push({
          "src": default_icons[i].src.url,
          "label": default_icons[i].label,
          "value": default_icons[i].value
        });
      }
    } else {
      for (var i in default_icons) {
        icons.push({
          "src": default_icons[i].src.webp,
          "label": default_icons[i].label,
          "value": default_icons[i].value
        });
      }
    }

    for (var key in customIconsDict) {
      customIcons.push({
        "src": customIconsDict[key].src.url,
        "label": customIconsDict[key].label,
        "value": key
      });
    }

    return [icons, customIcons];
  }
};
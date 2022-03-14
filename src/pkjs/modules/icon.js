var globals = require('./globals');
for (var key in globals) {
  window[key] = globals[key];
}

var default_icons = require('../data/default_icons');

var self = module.exports = {
    getClay: function() {
        var returnArray = [];
        var iDevice = /(.+)(iPhone|iPad|iPod)(.+)OS[\s|\_](\d+)[\_|\.]?(\d+)[\_|\.]?(\d+).*/.exec(navigator.userAgent)
        if (iDevice && iDevice[4] < 14) {
            for (var i in default_icons) {
                returnArray.push({
                    "src": default_icons[i].src.url,
                    "label": default_icons[i].label,
                    "value": default_icons[i].value
                });
            }
        } else {
            for (var i in default_icons) {
                returnArray.push({
                    "src": default_icons[i].src.webp,
                    "label": default_icons[i].label,
                    "value": default_icons[i].value
                });
            }
        }
        return returnArray;
    }
};
var globals = require('./globals');
var Promise = require('bluebird');
for (var key in globals) {
  window[key] = globals[key];
}

var self = module.exports = {
  objectByString: function(object, str) {
    str = str.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    str = str.replace(/^\./, '');           // strip a leading dot
    var a = str.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in object) {
            object = object[k];
        } else {
            return null;
        }
    }
    return object;
  },
  colorAppMessage: function(color, hash) {
    Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": color, "Hash": hash}, messageSuccess, messageFailure);
  },

  localXHRRequest: function(button, url, headers, hash) {
    var data = {};
    var highlight_idx = ColorAction.VIBRATE_RESPONSE;
    if (Array.isArray(button.data)) {
      if (button.index == null) { 
        button.index = 0;
      }
      data = button.data[button.index];
      if (button.data.length == 2) { highlight_idx = button.index; }
      button.index = (button.index + 1) % button.data.length;
    } else {
      data = button.data;
    }
    debug(2, "highlight idx: " + highlight_idx);
    self.xhrRequest(button.method, url, headers, data, hash, 2).then(function(xhr_data) {
      self.colorAppMessage(highlight_idx, xhr_data.hash);
    }, function(hash) {
      self.colorAppMessage(ColorAction.ERROR, hash);
    });
  },

  statefulXHRRequest: function(button, url, headers, status_url, status_headers, hash) {
    var status = button.status
    var data = {};
    if (Array.isArray(button.data)) {
      if (button.index == null) { 
        button.index = 0;
      }
      data = button.data[button.index];
      button.index = (button.index + 1) % button.data.length;
      
    } else {
      data = button.data;
    }
    self.xhrRequest(button.method, url, headers, data, hash, 4).then(function(data) {
      self.xhrStatus(status.method, status_url, status_headers, status.data, data.hash, status.variable, status.good, status.bad, 25).then(function(status_data){
        self.colorAppMessage(status_data.color, status_data.hash);
      }, function(hash) {
        self.colorAppMessage(ColorAction.ERROR, hash);
      });
    }, function(hash) { 
        self.colorAppMessage(ColorAction.ERROR, hash);
    });

  },

  statusXHRRequest: function(button, url, headers, hash) {
    self.xhrStatus(button.status.method, url, headers, button.status.data, hash, button.status.variable, button.status.good, button.status.bad, 25).then(function(status_data){
      self.colorAppMessage(status_data.color, status_data.hash);
    }, function(hash) {
      self.colorAppMessage(ColorAction.ERROR, hash);
    });
  },

  xhrRequest: function(method, url, headers, data, origin_hash, maxRetries) {
    return new Promise(function(resolve, reject) {

      var xhrRetry = function(method, url, headers, data, origin_hash, maxRetries) {
        if (typeof(maxRetries) == 'number'){
          maxRetries = [maxRetries, maxRetries];
        }

        var request = new XMLHttpRequest();
        request.onload = function() {
          if(this.status < 400) {
            debug(1, "---- Status: " + this.status);
            var returnData = {};
            try {
              returnData = JSON.parse(this.responseText);
              debug(2, "Response data: " + JSON.stringify(returnData));
            } catch(e) {
              debug(1, "---- Status: JSON parse failure");
              return reject(origin_hash);
            }

            return resolve({ data: returnData, hash: origin_hash});

          } else {
            if (maxRetries[1] > 0) {
              setTimeout(function() { 
                xhrRetry(method, url, headers, data, origin_hash, [maxRetries[0], maxRetries[1] - 1]); 
              }, 307 * (maxRetries[0] - maxRetries[1]));
            } else {
              debug(1, "---- Status: Max retries reached");
              return reject(origin_hash);
            }
          }
        };

        debug(1, "XHR Type: Local");
        debug(1, "-- URL: " + url);
        debug(1, "-- Method: " + method);
        debug(1, "-- Data: " + JSON.stringify(data));

        request.onerror = request.ontimeout = function(e) { 
          return reject(origin_hash);
        };

        request.open(method, url);
        request.timeout = 5000;
        for (var key in headers) {
          if(headers.hasOwnProperty(key)) {
          debug(1, "-- Header: " + key + ": " + headers[key]);
          request.setRequestHeader(key, headers[key]);
          }
        }
        request.send(JSON.stringify(data)); 
      }
      xhrRetry(method, url, headers, data, origin_hash, maxRetries);
    });
  },

  xhrStatus: function(method, url, headers, data, origin_hash, variable, good, bad, maxRetries) {
    return new Promise(function(resolve, reject) {
      var xhrRetry = function(method, url, headers, data, origin_hash, variable, good, bad, maxRetries) {

        var request = new XMLHttpRequest();
        if (typeof(maxRetries) == 'number'){
          maxRetries = [maxRetries, maxRetries];
        }

        var repeatCall = function(hash) {
          if (maxRetries[1] > 0) {
            setTimeout(function() {
              xhrRetry(method, url, headers, data, hash, variable, good, bad, [maxRetries[0], maxRetries[1] - 1])
            }, 100 * (maxRetries[0] - maxRetries[1]));
          } else {
            return reject(origin_hash)
          }
        };

        request.onerror = request.ontimeout = function(e) { 
          debug(1, "---- Status: Timed out or Error");
          repeatCall(origin_hash);
        };

        request.onload = function() {
          if(this.status < 400) {
            debug(1, "---- Status: " + this.status);
            var returnData = {};
            try {
              returnData = self.objectByString(JSON.parse(this.responseText), variable);
              if (returnData === null) {
                debug(1, "---- Status: JSON response is empty");
                return reject(origin_hash);
              }
            } catch(e) {
              debug(1, "---- Status: JSON parse failure");
              return reject(origin_hash);
            }
            debug(2, "result: " + returnData + " maxRetries: " + maxRetries[1]);
            if (returnData == good) {
              debug(1, "---- Variable match: " + returnData);
              return resolve({color: ColorAction.GOOD, hash: origin_hash});
            } else if (returnData == bad) {
              debug(1, "---- Variable match: " + returnData);
              return resolve({color: ColorAction.BAD, hash: origin_hash});
            } else {
              debug(1, "---- Variable mismatch, expected \"" + good + "\" or \"" + bad + "\"");
              repeatCall(origin_hash);
            }
          } else {
            repeatCall(origin_hash);
          }
        };

        debug(1, "XHR Type: Status");
        debug(1, "-- URL: " + url);
        debug(1, "-- Method: " + method);
        debug(1, "-- Data: " + JSON.stringify(data));

        request.open(method, url);
        request.timeout = 5000;
        for (var key in headers) {
          if(headers.hasOwnProperty(key)) {
          debug(1, "-- Header: " + key + ": " + headers[key]);
          request.setRequestHeader(key, headers[key]);
          }
        }
        request.send(JSON.stringify(data));  
      }
      xhrRetry(method, url, headers, data, origin_hash, variable, good, bad, maxRetries);
    });
  },
  xhrArrayBuffer: function(url, maxRetries) {
    return new Promise(function(resolve, reject) {

      var xhrRetry = function(url, maxRetries) {
        if (typeof(maxRetries) == 'number'){
          maxRetries = [maxRetries, maxRetries];
        }
        var request = new XMLHttpRequest();
        request.onload = function() {
          if(this.status == 200) {
            debug(1, "---- Status: " + this.status);
            return resolve(this);
          } else {
            return reject(this);
          }
        };

        debug(1, "URL: " + url);

        request.onerror = request.ontimeout = function(e) { 
          if (maxRetries[1] > 0) {
            setTimeout(function() { 
              xhrRetry(url, [maxRetries[0], maxRetries[1] - 1]); 
            }, 307 * (maxRetries[0] - maxRetries[1]));
          } else {
            debug(1, "---- Status: Max retries reached");
            return reject(this);
          }
        };

        request.open('GET', url);
        request.timeout = 5000;
        request.responseType = 'arraybuffer';
        request.send(); 
      }
      xhrRetry(url, maxRetries);
    });
  },
};

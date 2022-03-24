var globals = require('./globals');
var Promise = require('bluebird');
for (var key in globals) {
  window[key] = globals[key];
}

var self = module.exports = {
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
      debug(1, "Button has multiple endpoints, using idx: " + button.index);
      if (button.data.length == 2) { highlight_idx = button.index; }
      button.index = (button.index + 1) % button.data.length;
    } else {
      debug(1, "Button has single endpoint");
      data = button.data;
    }
    debug(1, "highlight idx: " + highlight_idx);
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
      debug(1, "Button has multiple endpoints, using idx: " + button.index);
      button.index = (button.index + 1) % button.data.length;
      
    } else {
      debug(1, "Button has single endpoint");
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
            var returnData = {};
            try {
              returnData = JSON.parse(this.responseText);
              debug(2, "Response data: " + JSON.stringify(returnData));
            } catch(e) {
              debug(1, "JSON parse failure");
              reject(origin_hash);
            }

            debug(1, "Status: " + this.status);
            resolve({ data: returnData, hash: origin_hash});

          } else {
            if (maxRetries[1] > 0) {
              setTimeout(function() { 
                xhrRetry(method, url, headers, data, origin_hash, [maxRetries[0], maxRetries[1] - 1]); 
              }, 307 * (maxRetries[0] - maxRetries[1]));
            } else {
              debug(1, "Max retries reached");
              reject(origin_hash);
            }
          }
        };

        debug(2, "URL: " + url);
        debug(2, "Method: " + method);
        debug(2, "Data: " + JSON.stringify(data));

        request.onerror = request.ontimeout = function(e) { 
          reject(origin_hash);
        };

        request.open(method, url);
        request.timeout = 5000;
        for (var key in headers) {
          if(headers.hasOwnProperty(key)) {
          debug(2, "Setting header: " + key + ": " + headers[key]);
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
            reject(origin_hash)
          }
        };

        request.onerror = request.ontimeout = function(e) { 
          debug(1, "Timed out");
          repeatCall(origin_hash);
        };

        request.onload = function() {
          if(this.status < 400) {
            var returnData = {};
            try {
              returnData = JSON.parse(this.responseText);
              var variable_split = variable.split(".")
              for (var j in variable_split) {
              returnData = returnData[variable_split[j]];
              }
              debug(2, "Response data: " + JSON.stringify(returnData));
            } catch(e) {
              reject(origin_hash);
            }
            debug(1, "Status: " + this.status);
            debug(2, "result: " + returnData + " maxRetries: " + maxRetries[1]);
            if (returnData == good) {
              resolve({color: ColorAction.GOOD, hash: origin_hash});
            } else if (returnData == bad) {
              resolve({color: ColorAction.BAD, hash: origin_hash});
            } else {
              repeatCall(origin_hash);
            }
          } else {
            repeatCall(origin_hash);
          }
        };

        debug(2, "URL: " + url);
        debug(2, "Method: " + method);
        debug(2, "Data: " + JSON.stringify(data));

        request.open(method, url);
        request.timeout = 5000;
        for (var key in headers) {
          if(headers.hasOwnProperty(key)) {
          debug(2, "Setting header: " + key + ": " + headers[key]);
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
            debug(1, "Status: " + this.status);
            resolve(this);
          } else {
            reject(this);
          }
        };

        debug(1, "URL: " + url);

        request.onerror = request.ontimeout = function(e) { 
          if (maxRetries[1] > 0) {
            setTimeout(function() { 
              xhrRetry(url, [maxRetries[0], maxRetries[1] - 1]); 
            }, 307 * (maxRetries[0] - maxRetries[1]));
          } else {
            debug(1, "Max retries reached");
            reject(this);
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

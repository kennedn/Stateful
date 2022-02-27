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

var image = require('./modules/image')


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
  // image.load('https://kennedn.com/icons/tv_8bit.png');
  image.load('https://www.iconsdb.com/icons/preview/black/spotify-xxl.png', function(data) {
    switch(data.state) {
      case URLStatus.SUCCESS:
        debug(1, "Image download successful");
        break;
      case URLStatus.ERROR:
        debug(1, "Image Error with status: " + data.status)
        break;
      case URLStatus.DUPLICATE:
        debug(1, "Image already exists with hash " + data.hash)
        break;
    }
  });
  image.load('https://www.iconsdb.com/icons/preview/black/spotify-xxl.pn', function(data) {
    debug(1, localStorage.getItem('custom-icons'));
  });
  // image.load('https://www.iconsdb.com/icons/preview/black/spotify-xxl.pn');
  // image.load('https://i.imgur.com/Bwvvn3P.png');
  Pebble.sendAppMessage({"TransferType": TransferType.READY }, messageSuccess, messageFailure);
});


Pebble.addEventListener('showConfiguration', function(e) {

  var claySettings = JSON.parse(localStorage.getItem('clay-settings'));
  if (!claySettings) {claySettings = {}}
  claySettings['ClayJSON'] = JSON.stringify([
    require('./stateful'), [
    {"src": "data:image/webp;base64,UklGRoIAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSBcAAAABDzD/ERGCINtmBlO+/YcQ0f8JoJ1HCQBWUDggRAAAADADAJ0BKhIAEgA+nUCYSaWkIqE36ACwE4lpAACI5keDacAA/vtlb/5D9x2H5w56LybczrgYn/wCr8QL/QmieRjwAAAA","label": "Default","value": "c4ca4238"},
    {"src": "data:image/webp;base64,UklGRhYBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSCIAAAABDzD/ERECTW0ruWxsEIUIRjOayXQ3QUT/A8ZqJ+1yX/wBVlA4IM4AAABwBACdASoSABIAPrVOnkunJCKhqA1Q4BaJQApggdUWt8cJjc3wPI0RkRcsAAD+7pqz2QoQlBpumtTKyz+e6e3b/+TEo0ApoZh+m8p85aWWJJ/OtUgCa+48rol93/uv+39WOXWKLv3Z/zL/76TqARfucE//+JR+Vwj2a1Ahc4bRSI86mOPSbgzbgBGq8/fJKMO8+tvo0rW/7xsJY40jDSvqu7ZtP/tCZJl9pvCOfYE4es/MW5g1fGuOfJtu8o5y/dTYzp77Tx1bdOHnAAAAAA==","label": "Tv","value": "c81e728d"},
    {"src": "data:image/webp;base64,UklGRtgAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSCsAAAABDzD/ERFCUSQ50XA/kRApkQbSkBIJeWLgkhDR/zDBlT2+XDFh9QOYDYAEAFZQOCCGAAAAMAQAnQEqEgASAD61Tp5LJyQioagNUOAWiWkAA+I/x4FX6muF8vXnyzYAAPz91J71sGip0fVKrxWdizsBze9k+sDEThlniKyVcFdbIEfhpxI/4zEI0PcJa+oZ99aT8/QkHJK+fkhX3hcUcvLK127LrC2kO9olMEgp0/vbpajF/3Vanz2ToAA=","label": "Bulb","value": "eccbc87e"},
    {"src": "data:image/webp;base64,UklGRrgAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSB0AAAABDzD/ERHCVCQbK4FIqoskAf8SRPQ/sBc/nTpNAQBWUDggdAAAANADAJ0BKhIAEgA+sUSdSacjoqE39VgA4BYJaQAEO5CvaOEXQqRwAAD5O7igcfPyHnBGc1aXggZxbiCz5Zv0D0O++r/UmFkzNULR2+h4YP122R35tC20uudOnbVoTbD5v7Hv3SqyyDrH/x5LpF/xaTPosQAA","label": "Monitor","value": "a87ff679"},
    {"src": "data:image/webp;base64,UklGRgABAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSB0AAAABDzD/ERHCMBtJNVu0U1ukex7DEUT0P0rZuPnbAABWUDggvAAAAHAEAJ0BKhIAEgA+tVKfTKckoqIoCqjgFolpAAPj08lCjBYSsoXf3Z9IkdYAAP7png1UJdqZvQ0t2rJrMpgkPt2H9/o4MUI5cq0wLCySqgl49z1/9/0blkh7i609xPvBO8S4jAw7sMVQbVEYuLn/50fXuUQhk3ynLfX9W8pWo89ay0gUv/9ejyz9Y6qlT040n8jxn/5bQhOQ8G1fJGJfzUUvq6hY1AN3qQO9hznHahnZuFqyAJYZ+KL4AAAA","label": "Call","value": "e4da3b7f"},
    {"src": "data:image/webp;base64,UklGRrQAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSB0AAAABDzD/ERFCUdtGzP1K+4DvTSGi/xNAI+MhfmE8ZgBWUDggcAAAALADAJ0BKhIAEgA+tUqhSackIyEoDVDgFolpAAQ7nxZkMNcOt9J4AP75wl+29ea7Vj1q0CjT5QZMyT8mgmB99NClp/NgMKd1kXk3bMJf9xWnynHZt1+xejehlNk1hzx9G4w9OwbkbjGYf0dnPhIwAAA=","label": "Plus","value": "1679091c"},
    {"src": "data:image/webp;base64,UklGRooAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSBkAAAABDzD/ERFCTdsGTPljXl8VCBH9nwCx3gMDAFZQOCBKAAAAsAMAnQEqEgASAD6tSJtJpiSioTf1WADAFYlpAAQ4AK9raW0u9wAA/vpa1p+WkD582AxKko5D4K5y3V2cbGrbMyZX0qIPqL4AAAA=","label": "Minus","value": "8f14e45f"},
    {"src": "data:image/webp;base64,UklGRvoAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSDUAAAABDzD/ERGCUSRJimrhmAyRMZS2kuZ5zOchov+BAcMY4IpXGo5Tnac5TrWdTAPSMA3/llJIHQBWUDggngAAAFAEAJ0BKhIAEgA+tVKiTSckoyIoCADgFolpAASYDkAD4qC/eTINsY9CcAAA/rn957QtdV4FLRd997nXUE6IaQaGGM+hw/p9K2i8PykPOIO/axhowHUEuOv0kW9vJYE89iHS+iNH6xzFVHTMLSlrW/bLnkreoO2nU5Qu8T22Xok/r6dAldqXcFBnuuAI66Ks7vlb6hC5V38r076/aAAA","label": "Star","value": "c9f0f895"},
    {"src": "data:image/webp;base64,UklGRrQBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSKYAAAABgBvbtrLl/O6K1EBOBXTg7iUQWeaeOyFDypAT/1IDrg247pn/Xd7XQkQobNu2oeN0nCKbtsuXKQVkB5494uv1zdgxvGq6uldyPQPmnW6gkrXlxFkAOE/u4/Q67V8AR6/OjMz32C/w/gdsy9ISgDMlbcOFNOHVelrvCGDiVS9ahapzixlf73t+zPQ1UgP46dXQD/9iOiw1JrBS37eno7LpfLSeuiQJVlA4IOgAAACwBQCdASoSABIAPrVSo00nJKMiKAgA4BaJaQAD4cPYA3q9erlnpsPWcX3O3/85xswB3FKdUAAA/vFRlEbquilZ9sh3ogpP6Xntv/Up4w+quYdhApgneRIY7UUuWkf/bvZzf17Z34eN1mHvcXnGuRjoEaD55Erj/w1PMJFWuEbBTX5AvGik7864kvrHWeDjwEkAOovU8Yt9Qa566BEUNxF3sBmtcU0rzXV/5/6EYl9d8c3gJ83y2umMlankUBlbLIB1wKerjVm9Toei+NGEIMsfBpV19hMDnAVJnF73tSRjrzF3vo+AAAAA","label": "Power","value": "45c48cce"},
    {"src": "data:image/webp;base64,UklGRpQBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSJwAAAABgCNb2/Lkjbtb5e6edJ4gGwi1a83MN7QsgM5lB1plqBiWYF1qNuAOD/LbEiJiAkh7DuHfazQBsV+0LAq0IMEMgBsbt5dj8l/wclVGRCaO6Pz8fH8cODXzdLZ2dnZ2BgCGSa4zfHEC3481jgEE3sY50iuMMXYA4MJNHJRjjE2PA+tK4pkGcOU57BMJG5a56wJEStIT9UayjXdhd3NWUDgg0gAAAPAEAJ0BKhIAEgA+tVKjTSckoyIoCADgFolpAA4W/ZDkTfs5Lj++ZIe/Wur/hq3lAAD+3jWw/d5yf4Jv67e//m2ecfQeL3FldZFJ3MSs/PGtXRRhdrsINHtLMf3CiUAo3gr2fhX0SjZ9vNqt+es9Qf+I8rC4UpeD7TVec6tMfF66xM3JzpW535xilLLk6JPwYvsOTzdbYhb7lvqu5tnwfv37JSZ8S+6/TmvlVBpTe5/vovBmwDT4ERpotSghS/52y3qfbT5gB/yilTl7+fu1kAAAAA==","label": "Input","value": "d3d94468"},
    {"src": "data:image/webp;base64,UklGRhIBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSDEAAAABDzD/ERGCQSRJjeYYCRjGF3yQkiQgYG1E9D9oIENueSS9Ms2u/GRXpukVeeSWIQgNAFZQOCC6AAAAkAUAnQEqEgASAD61UqJNJySjIigIAOAWiWkABD6fGV8ceiRvgH65BZeluWUwFImEnXB4FgAA/c2ya9jWk3R12Yw1j279HiVGY/1kmBa1iXYlf877RdQXW3klOAPKNTHLflKIw7cVRvJY3lmPm0+GK7swNsIz2T05eGiJFF0xCbnhtO88CtPyv+t8s9s1F/LtAtKPuybdvOvz1/VmbnUBHkN1Zc3PPP49Acmfc5odtajQhgafD360sAAA","label": "Mute","value": "6512bd43"},
    {"src": "data:image/webp;base64,UklGRnYBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSGIAAAABcFzbttLcanAYM7RuXGqS+F3rFRf3BK8gIhS5bdtIp8yOZ1y71sD+2vH47roB5N3xsRxJGFqAE4ZVHxc9vanIT6WPJSLEIpLkQGCS3E0Zm0rkeQZgeV4x5T+Xo2cL8NHxAlZQOCDuAAAAMAYAnQEqEgASAD61UqJNJySjIigIAOAWiWkAE4AYxH/AU0B6NWfCbyXPlZryt/6aT0jqJ2kThmQwAAD8Ouqoov1YoTFGfHCyV8917LCkywmrO9qhJuJoGFHy1pjaJ8TUf9R+4hQEdRvNlCaCU8g5Lr8Mro5na7NXhttZMPeTHWBnfZwwzzXgchRFTRYs41pjdCULoDsp5LLY/E+L5md3lb3nOU/JH+cIIn//bsfmln5xR/2aZLGuzFG0AqwtWpj+ybQqVP5X+Z9zX9NR73G+4u24RqkUMtjqBAFbI1QPaFtn9VMGO2usqeZgAAAAAA==","label": "Aspect","value": "c20ad4d7"},
    {"src": "data:image/webp;base64,UklGRnwBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSK4AAAABgFrbtmpnf66AIai+/C4MjplJZeTayCdf5E8BKYCZoQGy2EBUFIN7tMWFtBAREwDzRKl/qdVo5TUgedxoWZY1L5UCyl2r9ByHswD2Jf85lP4NyOA7iUJAeRJYIElvDcckA/8lAoSuPZJcdMi/h4NOAKjf2t8/uP+5a0jin8s2TMtCCHFxLoQQZdU5Dc9VFU/nVVSjNBxRVZkUVXjTvUN75an8S53ta2xdi6tyWyRWUDggqAAAAFAEAJ0BKhIAEgA+tVKjTSckoyIoCADgFolpAAPjSQz2F09Loc5tS4hSdPAA/vaxCMDR6cSSX2rMOrHFZV3C/FPw2sM/EZN/YOrW390HPQJfL6Jwn7c0TVWPrjS8BqflMI9kXUfVwr/brvBCqLmHZfxmmIdEQ9kAc/OXsGJJMgqWyHNE+78ndH7d3mM/zOoLl5X/pBtfUM81r+PqG3W/b7xKvbJcMgAAAA==","label": "Plant","value": "c51ce410"}
    ]
  ]);
  console.log(JSON.stringify(claySettings));
  localStorage.setItem('clay-settings', JSON.stringify(claySettings));
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

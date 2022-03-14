require('./polyfills/strings');
var globals = require('./modules/globals');
for (var key in globals) {
  window[key] = globals[key];
}
var XHR = require('./modules/xhr')
var Data = require('./modules/data')
var ClayHelper = require('./modules/clay')
var LZString = require ('./vendor/LZString')


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
  // image.load('https://www.iconsdb.com/icons/preview/black/spotify-xxl.png', function(data) {
  //   switch(data.state) {
  //     case URLStatus.SUCCESS:
  //       debug(1, "Image download successful");
  //       break;
  //     case URLStatus.ERROR:
  //       debug(1, "Image Error with status: " + data.status)
  //       break;
  //     case URLStatus.DUPLICATE:
  //       debug(1, "Image already exists with hash " + data.hash)
  //       break;
  //   }
  // });
  // image.load('https://www.iconsdb.com/icons/preview/black/spotify-xxl.pn', function(data) {
  //   debug(1, localStorage.getItem('custom-icons'));
  // });
  // image.load('https://www.iconsdb.com/icons/preview/black/spotify-xxl.pn');
  // image.load('https://i.imgur.com/Bwvvn3P.png');
  var settingsStorage = JSON.parse(localStorage.getItem('clay-settings'));
  if (!settingsStorage) {
    settingsStorage = {};
    settingsStorage['ClayJSON'] = require('./stateful');
    localStorage.setItem('clay-settings', JSON.stringify(settingsStorage));
    ClayHelper.clayToTiles(clay);
  } else {
    Pebble.sendAppMessage({"TransferType": TransferType.READY,}, messageSuccess, messageFailure);
  }
});


Pebble.addEventListener('showConfiguration', function(e) {
  // var webP = new Image();     
  // webP.src = 'data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA';
  // webP.onload = webP.onerror = function () {
  //  debug(1, (webP.height === 2) ? "webP 0.2.0 supported!" : "webP not supported."); 
  // }; 
  debug(1, navigator.userAgent); 
  var claySettings = JSON.parse(localStorage.getItem('clay-settings'));
  if (!claySettings) {claySettings = {}}
  // claySettings['ClayJSON'] = LZString.compressToEncodedURIComponent(JSON.stringify([
  //   require('./stateful'), [
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/default.png","label": "Default","value": "c4ca4238"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/tv.png","label": "Tv","value": "c81e728d"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/bulb.png","label": "Bulb","value": "eccbc87e"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/monitor.png","label": "Monitor","value": "a87ff679"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/call.png","label": "Call","value": "e4da3b7f"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/plus.png","label": "Plus","value": "1679091c"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/minus.png","label": "Minus","value": "8f14e45f"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/star.png","label": "Star","value": "c9f0f895"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/power.png","label": "Power","value": "45c48cce"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/input.png","label": "Input","value": "d3d94468"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/mute.png","label": "Mute","value": "6512bd43"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/aspect.png","label": "Aspect","value": "c20ad4d7"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/plant.png","label": "Plant","value": "c51ce410"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/mail.png","label": "Mail","value": "aab32389"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/bolt.png","label": "Bolt","value": "9bf31c7f"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/notification.png","label": "Notification","value": "c74d97b0"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/flame.png","label": "Flame","value": "70efdf2e"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/unlock.png","label": "Unlock","value": "6f4922f4"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/lock.png","label": "Lock","value": "1f0e3dad"},
  //   {"src": "https://github.com/kennedn/Stateful/raw/working/resources/icons/droplet.png","label": "Droplet","value": "98f13708"}
  //   ]
  // ]));
  var j = {
    "src": {
      "url": "https://github.com/kennedn/Stateful/raw/working/resources/icons/default.png",
      "png2": "",
      "png8": "",
      "webp": "",
    },
    "resource": ""
    "label": "Default",
    "value": "c4ca4238"
  };
  claySettings['ClayJSON'] = LZString.compressToEncodedURIComponent(JSON.stringify([
    require('./stateful'), [
      {"src": "data:image/webp;base64,UklGRoIAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSBcAAAABDzD/ERGCINtmBlO+/YcQ0f8JoJ1HCQBWUDggRAAAADADAJ0BKhIAEgA+nUCYSaWkIqE36ACwE4lpAACI5keDacAA/vtlb/5D9x2H5w56LybczrgYn/wCr8QL/QmieRjwAAAA","label": "Default","value": "c4ca4238"},
      {"src": "data:image/webp;base64,UklGRhYBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSCIAAAABDzD/ERECTW0ruWxsEIUIRjOayXQ3QUT/A8ZqJ+1yX/wBVlA4IM4AAABwBACdASoSABIAPrVOnkunJCKhqA1Q4BaJQApggdUWt8cJjc3wPI0RkRcsAAD+7pqz2QoQlBpumtTKyz+e6e3b/+TEo0ApoZh+m8p85aWWJJ/OtUgCa+48rol93/uv+39WOXWKLv3Z/zL/76TqARfucE//+JR+Vwj2a1Ahc4bRSI86mOPSbgzbgBGq8/fJKMO8+tvo0rW/7xsJY40jDSvqu7ZtP/tCZJl9pvCOfYE4es/MW5g1fGuOfJtu8o5y/dTYzp77Tx1bdOHnAAAAAA==","label": "Tv","value": "c81e728d"},
      {"src": "data:image/webp;base64,UklGRhYBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSCsAAAABDzD/ERFCUW0r0QenpRGIQjSNZhQisHQ/R4jof5jAFbN9ucIEox69LIQFAFZQOCDEAAAAUAUAnQEqEgASAD61Tp1LpyQioagNUOAWiWwAtRdDJAFjTZw3loK9hXVHwA//IKdAvwhoAOJvYjWjHgVM6Q84Zw2Xo4NDcKDSL+68gf9WhdXpjfd83Opsl63PpPI9gUdB3yowvnYrZm3dUb9rRHVZUhEU9W4EG8yzpe0APXsSeoDPs2RLbrLfEvs3H6qs76qLUhhimvi+sqIUV+pbU1HS91t3swvC3/2R5oNfvR8+T7aZ1jLORlnPCwf0M8iwf0M7cAAAAA==","label": "Bulb","value": "eccbc87e"},
      {"src": "data:image/webp;base64,UklGRrgAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSB0AAAABDzD/ERHCVCQbK4FIqoskAf8SRPQ/sBc/nTpNAQBWUDggdAAAANADAJ0BKhIAEgA+sUSdSacjoqE39VgA4BYJaQAEO5CvaOEXQqRwAAD5O7igcfPyHnBGc1aXggZxbiCz5Zv0D0O++r/UmFkzNULR2+h4YP122R35tC20uudOnbVoTbD5v7Hv3SqyyDrH/x5LpF/xaTPosQAA","label": "Monitor","value": "a87ff679"},
      {"src": "data:image/webp;base64,UklGRgABAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSB0AAAABDzD/ERHCMBtJNVu0U1ukex7DEUT0P0rZuPnbAABWUDggvAAAAHAEAJ0BKhIAEgA+tVKfTKckoqIoCqjgFolpAAPj08lCjBYSsoXf3Z9IkdYAAP7png1UJdqZvQ0t2rJrMpgkPt2H9/o4MUI5cq0wLCySqgl49z1/9/0blkh7i609xPvBO8S4jAw7sMVQbVEYuLn/50fXuUQhk3ynLfX9W8pWo89ay0gUv/9ejyz9Y6qlT040n8jxn/5bQhOQ8G1fJGJfzUUvq6hY1AN3qQO9hznHahnZuFqyAJYZ+KL4AAAA","label": "Call","value": "e4da3b7f"},
      {"src": "data:image/webp;base64,UklGRrQAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSB0AAAABDzD/ERFCUdtGzP1K+4DvTSGi/xNAI+MhfmE8ZgBWUDggcAAAALADAJ0BKhIAEgA+tUqhSackIyEoDVDgFolpAAQ7nxZkMNcOt9J4AP75wl+29ea7Vj1q0CjT5QZMyT8mgmB99NClp/NgMKd1kXk3bMJf9xWnynHZt1+xejehlNk1hzx9G4w9OwbkbjGYf0dnPhIwAAA=","label": "Plus","value": "1679091c"},
      {"src": "data:image/webp;base64,UklGRooAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSBkAAAABDzD/ERFCTdsGTPljXl8VCBH9nwCx3gMDAFZQOCBKAAAAsAMAnQEqEgASAD6tSJtJpiSioTf1WADAFYlpAAQ4AK9raW0u9wAA/vpa1p+WkD582AxKko5D4K5y3V2cbGrbMyZX0qIPqL4AAAA=","label": "Minus","value": "8f14e45f"},
      {"src": "data:image/webp;base64,UklGRvoAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSDUAAAABDzD/ERGCUSRJimrhmAyRMZS2kuZ5zOchov+BAcMY4IpXGo5Tnac5TrWdTAPSMA3/llJIHQBWUDggngAAAFAEAJ0BKhIAEgA+tVKiTSckoyIoCADgFolpAASYDkAD4qC/eTINsY9CcAAA/rn957QtdV4FLRd997nXUE6IaQaGGM+hw/p9K2i8PykPOIO/axhowHUEuOv0kW9vJYE89iHS+iNH6xzFVHTMLSlrW/bLnkreoO2nU5Qu8T22Xok/r6dAldqXcFBnuuAI66Ks7vlb6hC5V38r076/aAAA","label": "Star","value": "c9f0f895"},
      {"src": "data:image/webp;base64,UklGRmIBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSEUAAAABDzD/ERGCTW3tTb6cOkZCpEQOLooDJGCj92aDjZWtd0xE9D9A4UoEFpIZ103ymfrj7/VU1VQVVA/UTNReyHFjcTAZDBoAVlA4IPYAAABQBgCdASoSABIAPrVUo00nJKMiKAgA4BaJaQATiU57XNZ7Sepj6QHqr/WYKz35BLOvik7oimH2+9zGIAD+7PO42JjZs07oHrXL847UzBjf7f+c05Xd4ZBxwM1FXx6/Hx6w3Gly7o5k/M+5tJLN/BAMQIdLaQ9lZHm+moCNmmfuDuqpWRnnLD+JQtPzNlSd1krqwmW+os8MGOy/+6cgbPw90SacTY+UbWt/CVfXNxS8sxT+NHi1ai0kh/9XkA0iVAm9bNAXMet9R861mf83rdnP+3GvA6I1L+D69vejXs+tfLrw2c91Az8wjT8V8Ip0lATD+zcAAAA=","label": "Power","value": "45c48cce"},
      {"src": "data:image/webp;base64,UklGRjYBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSC4AAAABDzD/ERGCUSRJimKjbK24Fcb8XEN4qCGi/zE2P9KjPSqxGrs/q6ES2iM9Y/8IVlA4IOIAAABwBgCdASoSABIAPrVUpE0nJKOiKAgA4BaJaQATiU81f+Z8/LOVmkb4B+swejaenleFV/wbq0OJTbwNWYAA/k0tFbw26R+sg4pGz/1mhoJmyc8uz9ANjZRayHs4hlVm0ocmi/yXwwCZjRgcBLrNtGx7tH/8s6F+hsdboi0F3oQFG6HQOpM5QXx04HCKjeRGU87tjoPrX0mFtNl8g4pGkuKee/8nSc5AZx7Ft/2D/zD1W4rTUv618PiPsf5c1W1y0p16dZqbI4Ai/qM/+s2/Xlgil1qcW0Ao6cd1N4B1wxqVAAAA","label": "Input","value": "d3d94468"},
      {"src": "data:image/webp;base64,UklGRhIBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSDEAAAABDzD/ERGCQSRJjeYYCRjGF3yQkiQgYG1E9D9oIENueSS9Ms2u/GRXpukVeeSWIQgNAFZQOCC6AAAAkAUAnQEqEgASAD61UqJNJySjIigIAOAWiWkABD6fGV8ceiRvgH65BZeluWUwFImEnXB4FgAA/c2ya9jWk3R12Yw1j279HiVGY/1kmBa1iXYlf877RdQXW3klOAPKNTHLflKIw7cVRvJY3lmPm0+GK7swNsIz2T05eGiJFF0xCbnhtO88CtPyv+t8s9s1F/LtAtKPuybdvOvz1/VmbnUBHkN1Zc3PPP49Acmfc5odtajQhgafD360sAAA","label": "Mute","value": "6512bd43"},
      {"src": "data:image/webp;base64,UklGRjwBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSCMAAAABDzD/ERFCQRtJyoGA8+/mhDH8a4jo/wSk8YfoD5yi/JH2AwBWUDgg8gAAAFAFAJ0BKhIAEgA+tUyfSyckIqGoDVDgFolpABOJTngs1U7vBNWEfBJvxbWOpKviow/4AADOP3Wherr96jVmm/wfJIuR/+HY9izLgLYFRQb09I7gx9+dF//En4kOelnGblKcFPQ1PvhS/v3mdP/OUoazyZpA4p2EvnR+WyqSTQnJImk/523+YyeU/IyLRfxD0tEvzKNHuHSKY40dDQ080DVGqH9KP7F8ld17UTab+v+DzcLd5EAe9d9omGBlNBR0xf5Z+gVXE6/v45xsW/TuQIHANVRVBApvuVnJ/iZvkwVfqh6g4K9e5J31i3+QQ34PkAAA","label": "Aspect","value": "c20ad4d7"},
      {"src": "data:image/webp;base64,UklGRgIBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSC8AAAABDzD/ERGCUSRJkWpihCAFZ2AVCTzvm10NEf0PgKQksU1cow2aIykIKMnfaP+CuQBWUDggrAAAABAEAJ0BKhIAEgA+tVSkTScko6IoCADgFolpAAPjqQmhMnbJrg10fNmAAP7y5tKFxT089MHastihTs10x0msVrSAD8FFTWpZGyGW2F0ZFQw8PIaZ3jG2GCrZyCcoriYbcC1hf1xckCxVuSidzEV0fJSspDxECkHDzIMs35gzKkehfzBgjkgfF8I3eO8ZlrvhCn/MbHwfh/bN9ztRxoftPAMjmNG+ld5ilgAAAAA=","label": "Plant","value": "c51ce410"},
      {"src": "data:image/webp;base64,UklGRv4AAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSBsAAAABDzD/ERFCUdtGTAd/zL31OgQR/Z8AnInf4AQAVlA4ILwAAAAQBQCdASoSABIAPrVQoEwnJKMiKAqo4BaJaQAD47/NHok7oAHZg2P8xAX25HfHxvGgAP7dvlD3LuVVAt1STPB1gCd6bJ6Jx27/3+Y4zC5NqjTFNQd4QEkUU7QmXsMsljd6m1QUvF/3FTMqC8EdskiT0aNh/U9jAWNn895i6zfqTdRkb3/5uocdP/U2SguZIGcc58M2/u1lgEL0Xn+h2JZrupLN6TuJGlgaIe4458ha2bAyb25LyPt50QAAAA==","label": "Mail","value": "aab32389"},
      {"src": "data:image/webp;base64,UklGRswAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSC8AAAABDzD/ERGCQSQpbDa9JxKwEmlIQwqyIvofP0UOcpKb/AgZKvSnNz2pTW5srNzsAABWUDggdgAAABAEAJ0BKhIAEgA+tUyfSyckIqGoDVDgFolpAAPgAQxobetzU6nd+dmAAP75wSmpM9HtaiLIHbJRvB+/iDjx6x+m8ahIKV38iUm8Hf/IpP1Gn1xO5Loq3X5RF1T6QtYealsUmolH16SF+cpWjWbKX8gw/zYgAAA=","label": "Bolt","value": "9bf31c7f"},
      {"src": "data:image/webp;base64,UklGRuYAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSC0AAAABDzD/ERECUWzbOEYAEVTQQCUNVBNFBEsrdlSI6H+IRCOZ2ap2/5/r3PDQKAAAVlA4IJIAAADwAwCdASoSABIAPrVOnkunJCKhqA1Q4BaJaQAD4PDxlBuKeCcKrWAAAPnrc/gztRkrEn17golvNtHjKK+iD7qtpPFPe/LLG/ZSz+iicGVL3pCBZPIPx0+UiH+V9suiVI74LDR5FfGXypgQPZ6k4NF5FHhNt1Q6v9okzcNr+7/bxNl/5Y3bRfcjQK38snxo/AAAAA==","label": "Notification","value": "c74d97b0"},
      {"src": "data:image/webp;base64,UklGRvIAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSC4AAAABDzD/ERFCUSSp0eR+IgEpSAvSkIIEnnEQCxH9DwYc/BBCKmmU8e6/jFRC8AMDVlA4IJ4AAADwAwCdASoSABIAPrVSo00nJKMiKAgA4BaJaQAEQH8YozZ3vv9pP3OgAP4Wa5wbgmpPPRVs642f2kRavWqEofgqb/lpnOZrnZMgdwEfy8ddvf4pT8sc2FvHOEDoNx3/UsyD3/bQAyqZvXPB/BFelJvgNXq777/8kdarrhGIc/vD2zTlzkvvwq+GO8je9eYtPX8t/OXNS/irhvRywAAAAA==","label": "Flame","value": "70efdf2e"},
      {"src": "data:image/webp;base64,UklGRjgBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSDIAAAABDzD/ERGCTSTbbU48Eg11n5IYfKJKEFRG260hRPQ/emAIU4kJCzlwhau8n/lzP6YyBFZQOCDgAAAAMAUAnQEqEgASAD61VKNNJySjIigIAOAWiWkABD/PFrmm9SUMxOwW/dH2mmZvZIXfGRAA/sD9GQdRm6WaHkEl5k7ytozwaNyJ96p5/kWiUDvL+/S8Wv2v/9Nj4QQvekFk/d0p1vjpvJ78MZOtruPtHeBv/4I3s8xbvm6VzfpQglPHH/67iBH/NTyJ336+qygh1it2LJkf5c7/9HBi/2t19hfOFCaDd9ktxbYQdT/EdgCxox6m7P//gAwPApa8QHYLGp7y3fu1k3Dlp3hg/wPcN7pKHxKiivDy9WQf6+kAAAA=","label": "Unlock","value": "6f4922f4"},
      {"src": "data:image/webp;base64,UklGRnABAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSDIAAAABDzD/ERGCUSRbjQYfyQY3LOEAo9HBctyck4SI/kc1NEcfsB5ZiR3zdq2b+DNv9IHmAFZQOCAYAQAAMAYAnQEqEgASAD61VKNNJySjIigIAOAWiWYApLmuuz/kFuAaafmdzRerAGYnYLYZJniAM3skLviQAAD+wP0Rcfqbxth8PdUqe9q57nXFK1DLST/8v5skdrvv0vFr9r//TY+EEL3o2lFvW+rDSsLVf8RW6L/+Ilit68JVdf/wRShh76vec7tTdo2qUjf/00kIJt3O7oYPX5gwGfrzzqoT5MS/6ud/+REM3YtWwcYFzAjKFHevJ6jkU3OCF8pZueSsuck+WaeIfrvsNV//9KVlkLemPAH3E8PmxbRQ3CsnON1/brdCXHx/+B7OvWHAfAz6GfBVRcG06/5wT98Z6//keH/Zd+f/yTH9AIMR0qGr/nYPj3vR4AAAAA==","label": "Lock","value": "1f0e3dad"},
      {"src": "data:image/webp;base64,UklGRgQBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSDAAAAABDzD/ERGCUSRZrZZ8RAJSkAbSkIIEjjn9aCGi/wEGr+6gEQ2SvbNDX//ZIdk7GgBWUDggrgAAAFAEAJ0BKhIAEgA+tVSjTSckoyIoCADgFolpAAPg8M1mQvQcM2nqL1yxXAAA/SHFUT4B526WtVsj21NQSdb2cyoKoDtX/1VCXXKY07C43ZLsm0LID8EaiLEVYL9OBl+zXPnrdIb64/rQdebaa/Mhv7XCykSRTdMBqqCm8yGIQd4M3eWAEmT3jPinoPjNkfWojfKLOej186ESiN8APzwyYfo6zg/x+hW5Sm4eEsQAAA==","label": "Droplet","value": "98f13708"},
    ]
  ]));
  console.log("Payload size: " + (claySettings['ClayJSON'].length / 1024).toFixed(2) + "kB");
  localStorage.setItem('clay-settings', JSON.stringify(claySettings));
  Pebble.openURL(clay.generateUrl());
});


Pebble.addEventListener('webviewclosed', function(e) {
  if (e && !e.response) {
    return;
  }
  // Get the keys and values from each config item
  var response = JSON.parse(LZString.decompressFromEncodedURIComponent(e.response));
  // var clayJSON = JSON.parse(dict[messageKeys.ClayJSON]);

  switch(response.action) {
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
      var settingsStorage = {};
      var tiles = response.payload;
      settingsStorage['ClayJSON'] = tiles;
      debug(1, JSON.stringify(tiles, null, 2));
      // // flatten the settings for localStorage
      // var settingsStorage = {};
      // settings.forEach(function(e) {
      //   if (typeof e === 'object' && e.id) {
      //     settingsStorage[e.id] = e.value;
      //   } else {
      //     settingsStorage[e.id] = e;
      //   }
      // });
      localStorage.setItem('clay-settings', JSON.stringify(settingsStorage));
      ClayHelper.clayToTiles(clay);
      break;
  }
});

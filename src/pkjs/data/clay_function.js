module.exports = function(minified) {

  var clayConfig = this;
  var _ = minified._;
  var $ = minified.$;
  var HTML = minified.HTML;
  var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();

  
clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {

  function validateForm() {
    return true;
    var inputs = document.getElementsByTagName('input');
    for (var i in inputs) {
      try {
        if (!inputs[i].reportValidity()) {return false;}
      } catch(e) {
        continue;
      }
    }
    return true;
  }

  function buttonToIndex(value) {
    switch(value) {
      case "up": return 0;
      case "up_hold": return 1;
      case "mid": return 2;
      case "mid_hold": return 3;
      case "down": return 4;
      case "down_hold": return 5;
    }
  }

  function Item(id, tileEntry, tiles) {
    var self = this;
    self.id = id;
    self.clay = clayConfig.getItemById(id);
    self.tileEntry = tileEntry;
    self.tiles = tiles;

    self.objectByString = function(str, val) {
      var object = self.tiles;
      if (typeof(str) !== 'string') {return str;}
      str = str.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      str = str.replace(/^\./, '');           // strip a leading dot
      var a = str.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i];
          if (k in object) {
              if (i == n - 1 && typeof(val) !== 'undefined') {
                object[k] = val;
                console.log("tiles." + str + ": " + JSON.stringify(val));
              }
              object = object[k];
          } else {
              return str;
          }
      }
      return object;
    }

    self.jsonObject = (typeof(self.objectByString(self.tileEntry)) === 'object');

    self.set = function(value) {
      if (self.tileEntry === null) {
        return;
      }

      self.clay.off(self.sync);

      if (typeof(value) === 'undefined') {
        value = self.objectByString(self.tileEntry)
      }

      if (typeof(value) === 'object') {
        self.clay.set(JSON.stringify(value));
      } else {
        self.clay.set(value);
      }
      self.clay.on('change', self.sync);
    }

    self.setTileEntry = function(value) {
      self.tileEntry = value;
      self.set();
    }

    self.sync = function() {
      if (self.jsonObject) {
        try {
          self.objectByString(self.tileEntry, JSON.parse(self.clay.get()));
          return true;
        } catch(e) {
          return false;
        }
      } else {
        var val = self.clay.get();
        if (self.clay.config.type == "color") {val = "#" + val.toString(16).padStart(6, "0"); console.log("Color: " + val);}
        self.objectByString(self.tileEntry, val);
        return true;
      }
    }

    self.clay.on('change', self.sync);
    self.set();
  }

  function Section(headingItem, items, tileEntries, tiles) {
    var self = this;
    this.headingItem = clayConfig.getItemById(headingItem);
    this.tiles = tiles;

    if (items.length !== tileEntries.length) { throw new Error('items and tileEntries array lengths must match');}
    var protoItems = items.map(function(elm, i) {return [elm,tileEntries[i]];})
    this.items = protoItems.map(function(item) {
      return new Item(item[0], item[1], self.tiles);
    });


    this.find = function(id) {
      return this.items.filter(function(elm) {
        return (elm.id == id);
      })[0];
    }

    this.getVisibility = function() {
      return !this.headingItem.$element.get("$").endsWith('hidden');
    };
    this.visible = this.getVisibility();

    this.setVisibility = function(visible, includeHeading) {
      if (!includeHeading) {
        this.headingItem.show();
      } else {
        if (visible) {
          this.headingItem.show();
        } else {
          this.headingItem.hide();
        }
      }

      if (visible) {
        this.headingItem.$element.set("$", "-hidden")
        this.items.forEach(function(item) {item.clay.show();});
      } else {
        this.headingItem.$element.set("$", "+hidden")
        this.items.forEach(function(item) {item.clay.hide();});
      }
      this.visible = visible;
    };

    this.headingItem.on('click', function(event) {
      self.setVisibility(!self.visible, false);
    });
    // self.setVisibility(false, false);
  }

  var submitButton = clayConfig.getItemById('ClaySubmit');
  var clayJSON = clayConfig.getItemById('ClayJSON');
  var globalSelector = clayConfig.getItemById('GlobalIndex');
  var tileSelector = clayConfig.getItemById('TileIndex');
  var buttonSelector = clayConfig.getItemById('ButtonIndex');
  var buttonTypeSelector = clayConfig.getItemById('ButtonType');

  var previoustile = "0";

  var payload = JSON.parse(LZString.decompressFromEncodedURIComponent(clayJSON.get()));
  var tiles = payload[0];
  var icons = payload[1];
  clayJSON.hide();

  var iconItems = clayConfig.getAllItems().filter(function(item) {
      return (item.id.endsWith('Icon') && !item.id.endsWith('Heading'));
    });

  iconItems.forEach(function(item) {
    item.$manipulatorTarget[0][0].remove()  // Remove dummy value
    for (var i in icons) {
      var icon = icons[i];
      var option = new Option(icon.label, icon.value);
      $(option).set("@src", icon.src);
      item.$manipulatorTarget.add(option);
    }
    item.$manipulatorTarget.set('value', icons[0].value);
    item.$manipulatorTarget.trigger('change');
  });
  var globalSection = new Section(['GlobalHeading'], ['GlobalIndex', 'GlobalToggle', 'GlobalURL', 'GlobalHeaders'],
                                  ["default_idx", "open_default", "base_url",  "headers"], tiles);
  globalSection.setVisibility(false,false);
  
  var tileSection = new Section(['TileHeading'], ['TileIndex', 'TileName', 'TileColor', 'TileHighlight', 'TileIcon'],
                                [null, "tiles[0].payload.texts[6]", "tiles[0].payload.color", 
                                "tiles[0].payload.highlight",  "tiles[0].payload.icon_keys[6]"]
                                , tiles);
  tileSection.setVisibility(false,false);

  var buttonSection = new Section(['ButtonHeading'], ['ButtonIndex', 'ButtonType', 'ButtonName', 'ButtonIcon'],
                                [null, "tiles[0].buttons.up.type", "tiles[0].payload.texts[" + buttonToIndex('up') + "]", 
                                "tiles[0].payload.icon_keys[" + buttonToIndex('up') + "]"], tiles);
  buttonSection.setVisibility(false,false);

  var onTileIndexChange = function() {
    if (this.get() == 'remove') {
      alert("Remove Tile")
      tileSelector.$manipulatorTarget.set('value', previoustile);
      tileSelector.off(onTileIndexChange);
      tileSelector.$manipulatorTarget.trigger('change');
      tileSelector.on('change', onTileIndexChange);
      previoustile = this.get();
      return;
    }

    if (!validateForm()) {
      tileSelector.$manipulatorTarget.set('value', previoustile);
      tileSelector.off(onTileIndexChange);
      tileSelector.$manipulatorTarget.trigger('change');
      tileSelector.on('change', onTileIndexChange);
      previoustile = this.get();
      return;
    }

    if (this.get() == 'add') {
      alert("Add Tile");
      tileSelector.$manipulatorTarget.set('value', previoustile);
      tileSelector.off(onTileIndexChange);
      tileSelector.$manipulatorTarget.trigger('change');
      tileSelector.on('change', onTileIndexChange);
      previoustile = this.get();
      return;
    }

    this.$manipulatorTarget.get('options')[1].text = "Remove tile (" + this.get() + ")";
    tileSection.find('TileName').setTileEntry("tiles[" + this.get('value') + "].payload.texts[6]");
    tileSection.find('TileColor').setTileEntry("tiles[" + this.get('value') + "].payload.color");
    tileSection.find('TileHighlight').setTileEntry("tiles[" + this.get('value') + "].payload.highlight");
    tileSection.find('TileIcon').setTileEntry("tiles[" + this.get('value') + "].payload.icon_keys[6]");
    buttonSelector.trigger('change');
  };

  tileSelector.$manipulatorTarget.add(new Option("Add tile", 'add'));
  tileSelector.$manipulatorTarget.add(new Option("Remove tile (0)", 'remove'));
  for (var i in tiles.tiles) {
    var tile = tiles.tiles[i];
    tileSelector.$manipulatorTarget.add(new Option(i, i));
    globalSelector.$manipulatorTarget.add(new Option(i, i));
  }
  tileSelector.$manipulatorTarget.set('value', 0);
  tileSelector.$manipulatorTarget.trigger('change');
  globalSelector.$manipulatorTarget.set('value', 0);
  globalSelector.$manipulatorTarget.trigger('change');


  var onButtonIndexChange = function() {
    buttonSection.find('ButtonType').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".type");
    buttonSection.find('ButtonName').setTileEntry("tiles[" + tileSelector.get('value') + "].payload.texts[" + buttonToIndex(this.get())+"]");
    buttonSection.find('ButtonIcon').setTileEntry("tiles[" + tileSelector.get('value') + "].payload.icon_keys[" + buttonToIndex(this.get())+"]");
  };

  buttonSelector.on('change', onButtonIndexChange);
  tileSelector.on('change', onTileIndexChange);

  submitButton.on('click', function () {
    if (!validateForm()) {return;}
    var t_json = {"action": "Submit", "payload": tiles};
    var ret_url = window.returnTo || "pebblejs://close#";
    location.href = ret_url + LZString.compressToEncodedURIComponent(JSON.stringify(t_json));
    });
  });
};

module.exports = function(minified) {

  var clayConfig = this;
  var _ = minified._;
  var $ = minified.$;
  var HTML = minified.HTML;
  var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();

  
clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {

  function submitWithData(data) {
    var ret_url = window.returnTo || "pebblejs://close#";
    location.href = ret_url + LZString.compressToEncodedURIComponent(JSON.stringify(data));
  }

  function confirm(message) {
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    var ret = (window.frames[0].window.confirm(message));
    iframe.parentNode.removeChild(iframe);
    return ret;
  }

  function validateSections(sections) {
    return (sections.filter(function(section) {
      return section.validate();
    }).length == sections.length); 
  }

  function safeSelectSet(clayItem, selectFunction, value, callback) {
    setTimeout(function(){
      clayItem.$manipulatorTarget.set('value', value);
      clayItem.off(selectFunction);
      clayItem.$manipulatorTarget.trigger('change');
      clayItem.on('change', selectFunction);
      if (callback) {return callback();}
    }, 0);
  }

  function optionWithSrc(label, value, src) {
    var option = new Option(label, value);
    $(option).set('@src', src);
    return option;
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
    self.visible = true;

    self.setVisibility = function(visible) {
      self.visible = visible
      if (visible) {
        self.clay.show();
      } else {
        self.clay.hide();
      }
    }

    self.hide = function() {
      self.clay.hide();
    }

    self.show = function() {
      if (self.visible) {
        self.clay.show();
      }
    }

    self.objectByString = function(str, val) {
      var object = self.tiles;
      if (typeof(str) !== 'string') {return str;}
      str = str.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      str = str.replace(/^\./, '');           // strip a leading dot
      if  (str === '') {
        if (typeof(val) !== 'undefined') {
          self.tiles = val;
          console.log("tiles: " + JSON.stringify(val));
        }
      } else {
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
                return '';
            }
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
        self.clay.set(JSON.stringify(value, null, 2));
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
      if (self.jsonObject && self.tileEntry !== null) {
        try {
          self.objectByString(self.tileEntry, JSON.parse(self.clay.get()));
          $(self.clay.$manipulatorTarget[0]).set('$background-color', 'rgba(0,170,0,0.2)');
          setTimeout(function() {$(self.clay.$manipulatorTarget[0]).set('$background-color', '#333333');}, 2500);

          self.clay.$manipulatorTarget[0].setCustomValidity('')
          return true;
        } catch(e) {
          $(self.clay.$manipulatorTarget[0]).set('$background-color', 'rgba(255,0,85,0.2)');
          self.clay.$manipulatorTarget[0].setCustomValidity('JSON parse error')
          self.clay.$manipulatorTarget[0].reportValidity();
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
      return this.items.find(function(elm) {
        return (elm.id == id);
      });
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
        this.items.forEach(function(item) {item.show();});
      } else {
        this.headingItem.$element.set("$", "+hidden")
        this.items.forEach(function(item) {item.hide();});
      }
      this.visible = visible;
    };

    this.validate = function() {
      for (var i in self.items) {
        var item = self.items[i];
        if (!item.visible) {continue;}
        var type = item.clay.config.type;
        if (type != 'input' && type != 'textarea') {continue;}
        try {
          if (!item.clay.$manipulatorTarget[0].checkValidity()) {
            if (self.headingItem.$element.get("\$\$show")) {
              self.setVisibility(true, false);
              item.clay.$manipulatorTarget[0].reportValidity();
              return false;
            }
          }
        } catch(e) {
          continue;
        }
      }
      return true;
    };

    this.headingItem.on('click', function(event) {
      self.setVisibility(!self.visible, false);
      if(self.visible) {
        self.items.forEach(function(item){
          if(item.clay.config.type == 'textarea') {
            item.clay.trigger('input');
          }
        });
      }
    });
  }

  var isAplite = (clayConfig.meta.activeWatchInfo.platform == "aplite");
  var isBlackWhite = (clayConfig.meta.activeWatchInfo.platform == "aplite" || clayConfig.meta.activeWatchInfo.platform == "diorite");
  var submitButton = clayConfig.getItemById('ClaySubmit');
  var jsonButton = clayConfig.getItemById('JSONSubmit');
  var iconButton = clayConfig.getItemById('IconSubmit');
  var clayJSON = clayConfig.getItemById('ClayJSON');
  var clayAction = clayConfig.getItemById('ClayAction');
  var messageText = clayConfig.getItemById('MessageText');
  var globalSelector = clayConfig.getItemById('GlobalIndex');
  var tileSelector = clayConfig.getItemById('TileIndex');
  var buttonSelector = clayConfig.getItemById('ButtonIndex');
  var buttonTypeSelector = clayConfig.getItemById('ButtonType');
  var customIconSelector = clayConfig.getItemById('IconIndex');


  var payload = JSON.parse(LZString.decompressFromEncodedURIComponent(clayJSON.get()));
  var tiles = payload[0];
  var importTiles = JSON.parse(JSON.stringify(payload[0]));
  var defaultIcons = payload[1][0];
  var customIcons = payload[1][1];
  var icons = (isAplite) ? defaultIcons : defaultIcons.concat(customIcons);
  var fallbackIcon = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  var previousTile = "0";
  var previousButton = "up";
  var previousIcon = (customIcons.length > 0) ? customIcons[0].value : "add";
  clayJSON.hide();
  clayAction.hide();
  if (messageText.get() === "") {messageText.hide();}

  var iconItems = clayConfig.getAllItems().filter(function(item) {
      return (item.id.endsWith('Icon') && !item.id.endsWith('Heading'));
    });

  iconItems.forEach(function(item) {
    item.$manipulatorTarget[0][0].remove()  // Remove dummy value
    for (var i in icons) {
      var icon = icons[i];
      item.$manipulatorTarget.add(optionWithSrc(icon.label, icon.value, icon.src));
    }
    item.$manipulatorTarget.set('value', icons[0].value);
    item.$manipulatorTarget.trigger('change');
  });

  if (!isAplite) {
    setTimeout(function() {
      customIconSelector.$manipulatorTarget.add(optionWithSrc("Add icon", "add", fallbackIcon));
      customIconSelector.$manipulatorTarget.add(optionWithSrc("Remove icon", 'remove', fallbackIcon));
      customIconSelector.$manipulatorTarget[0][0].remove()  // Remove dummy value
      for (var i in customIcons) {
        var icon = customIcons[i];
        customIconSelector.$manipulatorTarget.add(optionWithSrc(icon.label, icon.value, icon.src));
      }
      customIconSelector.$manipulatorTarget.set('value', (customIcons.length > 0) ? (clayAction.get() == "2") ? customIcons[customIcons.length - 1].value : customIcons[0].value : 'add');
      customIconSelector.trigger('change');
    },0);
  } 


  var JSONSection = new Section(['JSONHeading'], ['JSONInput', 'JSONSubmit'], ['.', null], importTiles);

  var iconSection = (isAplite) ? null : new Section(['IconHeading'], ['IconIndex', 'IconURL', 'IconName', 'IconSubmit'],
                                [null, null, null, null], tiles);

  var globalSection = new Section(['GlobalHeading'], ['GlobalIndex', 'GlobalToggle', 'GlobalURL', 'GlobalHeaders'],
                                  ["default_idx", "open_default", "base_url",  "headers"], tiles);
  
  var tileSection = (isBlackWhite) ? new Section(['TileHeading'], ['TileIndex', 'TileName', 'TileIcon'],
                                [null, "tiles[0].payload.texts[6]", "tiles[0].payload.icon_keys[6]"]
                                , tiles) : 
                                new Section(['TileHeading'], ['TileIndex', 'TileName', 'TileColor', 'TileHighlight', 'TileIcon'],
                                [null, "tiles[0].payload.texts[6]", "tiles[0].payload.color", 
                                "tiles[0].payload.highlight",  "tiles[0].payload.icon_keys[6]"]
                                , tiles);

  var buttonSection = new Section(['ButtonHeading'], ['ButtonIndex', 'ButtonType', 'ButtonName', 'ButtonIcon'],
                                [null, "tiles[0].buttons.up.type", "tiles[0].payload.texts[" + buttonToIndex('up') + "]", 
                                "tiles[0].payload.icon_keys[" + buttonToIndex('up') + "]"], tiles);

  var buttonActionSection = new Section(['ButtonActionHeading'], ['ButtonMethod', 'ButtonURL', 'ButtonHeaders', 'ButtonData'],
                                ["tiles[0].buttons.up.method", "tiles[0].buttons.up.url", "tiles[0].buttons.up.headers", 
                                 "tiles[0].buttons.up.data"], tiles);

  var buttonStatusSection = new Section(['ButtonStatusHeading'], ['ButtonStatusMethod', 'ButtonStatusURL', 'ButtonStatusHeaders', 
                                         'ButtonStatusData', 'ButtonStatusVariable', 'ButtonStatusGood', 'ButtonStatusBad'],
                                        ["tiles[0].buttons.up.status.method", "tiles[0].buttons.up.status.url", "tiles[0].buttons.up.status.headers", 
                                         "tiles[0].buttons.up.status.data", "tiles[0].buttons.up.status.variable", "tiles[0].buttons.up.status.good", 
                                         "tiles[0].buttons.up.status.bad"], tiles);

  if (clayAction.get() != 1) {
    JSONSection.setVisibility(false,false);
  } else {
    JSONSection.find("JSONInput").clay.$manipulatorTarget[0].focus();
  }

  if(!isAplite) {
    iconSection.find('IconSubmit').setVisibility((customIcons.length == 0));
    if (clayAction.get() != 2 && clayAction.get() != 3) {
      iconSection.setVisibility(false,false);
    } else {
      iconSection.find("IconName").clay.$manipulatorTarget[0].focus();
    }
  }

  if (clayAction.get() == 4 || clayAction.get() == 5) {
    globalSection.setVisibility(false, false);
    tileSection.find("TileName").clay.$manipulatorTarget[0].focus();
  } 

  var textAreas = clayConfig.getItemsByType('textarea');
  var onTextAreaChange = function() {
    var t = $(this.$manipulatorTarget);
    t.set("$height", "auto")
    var scrollHeight = t.get('scrollHeight');
    if (scrollHeight == 0) { return; }
    var maxHeight = screen.height / 3;

    $(this.$manipulatorTarget[0]).set('$background-color', '#333333');
    t.set('$height',  Math.min(scrollHeight, maxHeight) + "px");
    t.set('$overflow-y', "auto");
  };
  textAreas.forEach(function(item){
    item.on('input', onTextAreaChange);
    item.trigger('input');
  });

  var onCustomIconIndexChange = function() {
    if (this.get() == 'remove') {
      safeSelectSet(customIconSelector, onCustomIconIndexChange, previousIcon, function() {
        customIconSelector.trigger('change');
      });
      if (customIcons.length == 0) {return;}
      var iconName = "'" + customIcons.find(function(element){return (element.value == previousIcon);}).label + "'";
      if (confirm("Are you sure you want to remove icon " + iconName + " ?")) {
        submitWithData({"action": "RemoveIcon", "param": previousIcon});
      }
    } else if (this.get() == 'add') {
      if (!iconSection.visible) {
        iconSection.find("IconSubmit").visible = true;
      } else {
        iconSection.find("IconSubmit").setVisibility(true);
      }
      var tempItem = iconSection.find("IconName");
      tempItem.clay.$manipulatorTarget[0].removeAttribute('readonly');
      tempItem.clay.set('');
      tempItem = iconSection.find("IconURL");
      tempItem.clay.$manipulatorTarget[0].removeAttribute('readonly');
      tempItem.clay.set('');
      if (customIcons.length == 0) {previousIcon = this.get();}
    } else {
      previousIcon = this.get();
      var customIcon = customIcons.find(function(element){return (element.value == previousIcon);});
      this.$manipulatorTarget.get('options')[1].text = "Remove icon (" + customIcon.label + ")";
      iconSection.find("IconSubmit").setVisibility(false);
      var tempItem = iconSection.find("IconName");
      tempItem.clay.$manipulatorTarget.set("@readonly", '');
      tempItem.clay.set(customIcon.label);
      tempItem = iconSection.find("IconURL");
      tempItem.clay.$manipulatorTarget.set("@readonly", '');
      tempItem.clay.set(customIcon.src);
    }
  }

  var onTileIndexChange = function() {
    
    if (this.get() == 'remove') {
      safeSelectSet(tileSelector, onTileIndexChange, previousTile);
      if (confirm("Are you sure you want to remove '" + this.$manipulatorTarget.get('options')[this.$manipulatorTarget.get('selectedIndex')].text + "' ?")) {
        submitWithData({"action": "RemoveTile", "param": previousTile, "payload": tiles});
      } 
      return;
    }

    if (this.get() == 'add') {
      safeSelectSet(tileSelector, onTileIndexChange, previousTile);
      if (!validateSections([globalSection, tileSection, buttonSection, buttonActionSection, buttonStatusSection])) {return;}
      submitWithData({"action": "AddTile", "payload": tiles});
      return;
    }

    
    if (!validateSections([tileSection, buttonSection, buttonActionSection, buttonStatusSection])) {
      safeSelectSet(tileSelector, onTileIndexChange, previousTile);
      return;
    }

    this.$manipulatorTarget.get('options')[1].text = "Remove tile (" + this.$manipulatorTarget.get('options')[this.$manipulatorTarget.get('selectedIndex')].text + ")";
    tileSection.find('TileName').setTileEntry("tiles[" + this.get('value') + "].payload.texts[6]");
    if (!isBlackWhite) {
      tileSection.find('TileColor').setTileEntry("tiles[" + this.get('value') + "].payload.color");
      tileSection.find('TileHighlight').setTileEntry("tiles[" + this.get('value') + "].payload.highlight");
    }
    tileSection.find('TileIcon').setTileEntry("tiles[" + this.get('value') + "].payload.icon_keys[6]");
    buttonSelector.trigger('change');
    previousTile = this.get();
  };

  tileSelector.$manipulatorTarget.add(new Option("Add tile", 'add'));
  tileSelector.$manipulatorTarget.add(new Option("", 'remove'));
  for (var i in tiles.tiles) {
    var tile = tiles.tiles[i];
    var label = (tile.payload.texts[6] !== "") ? tile.payload.texts[6] : "Unnamed Tile";
    tileSelector.$manipulatorTarget.add(new Option(label, i));
    globalSelector.$manipulatorTarget.add(new Option(label, i));
  }
  tileSelector.$manipulatorTarget.set('value', (clayAction.get() == 4) ? tiles.tiles.length - 1 : 0);
  tileSelector.$manipulatorTarget.trigger('change');
  tileSelector.$manipulatorTarget.get('options')[1].text = "Remove tile (" + tileSelector.$manipulatorTarget.get('options')[tileSelector.$manipulatorTarget.get('selectedIndex')].text + ")";
  globalSelector.$manipulatorTarget.set('value', 0);
  globalSelector.$manipulatorTarget.trigger('change');


  var onButtonIndexChange = function() {
    if (!validateSections([buttonSection, buttonActionSection, buttonStatusSection])) {
      safeSelectSet(buttonSelector, onButtonIndexChange, previousButton);
      return;
    }
    
    buttonSection.find('ButtonType').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".type");
    buttonSection.find('ButtonName').setTileEntry("tiles[" + tileSelector.get('value') + "].payload.texts[" + buttonToIndex(this.get())+"]");
    buttonSection.find('ButtonIcon').setTileEntry("tiles[" + tileSelector.get('value') + "].payload.icon_keys[" + buttonToIndex(this.get())+"]");

    buttonActionSection.find('ButtonMethod').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".method");
    buttonActionSection.find('ButtonURL').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".url");
    buttonActionSection.find('ButtonHeaders').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".headers");
    buttonActionSection.find('ButtonData').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".data");

    buttonStatusSection.find('ButtonStatusMethod').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".status.method");
    buttonStatusSection.find('ButtonStatusURL').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".status.url");
    buttonStatusSection.find('ButtonStatusHeaders').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".status.headers");
    buttonStatusSection.find('ButtonStatusData').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".status.data");
    buttonStatusSection.find('ButtonStatusVariable').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".status.variable");
    buttonStatusSection.find('ButtonStatusGood').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".status.good");
    buttonStatusSection.find('ButtonStatusBad').setTileEntry("tiles[" + tileSelector.get('value') + "].buttons." + this.get() + ".status.bad");
    
    textAreas.forEach(function(item){
      item.trigger('input');
    });
    buttonTypeSelector.trigger('change');
    previousButton = this.get();
  };

  var onButtonTypeIndexChange = function() {
    switch(this.get()) {
      case '0':
        buttonStatusSection.setVisibility(false, true);
        buttonActionSection.setVisibility(false, false);
        buttonSection.setVisibility(true, false);
        buttonSection.find('ButtonName').setVisibility(true);
        buttonSection.find('ButtonIcon').setVisibility(true);
        break;
      case '1':
        buttonStatusSection.setVisibility(false, false);
        buttonActionSection.setVisibility(false, false);
        buttonSection.setVisibility(true, false);
        buttonSection.find('ButtonName').setVisibility(true);
        buttonSection.find('ButtonIcon').setVisibility(true);
        break;
      case '2':
        buttonStatusSection.setVisibility(false, false);
        buttonActionSection.setVisibility(false, true);
        buttonSection.setVisibility(true, false);
        buttonSection.find('ButtonName').setVisibility(true);
        buttonSection.find('ButtonIcon').setVisibility(true);
        break;
      case '3':
        buttonStatusSection.setVisibility(false, true);
        buttonActionSection.setVisibility(false, true);
        buttonSection.setVisibility(true, false);
        buttonSection.find('ButtonName').setVisibility(false);
        buttonSection.find('ButtonIcon').setVisibility(false);
        break;
    }
  }

  if (!isAplite) {customIconSelector.on('change', onCustomIconIndexChange);}
  buttonTypeSelector.on('change', onButtonTypeIndexChange);
  buttonSelector.on('change', onButtonIndexChange);
  tileSelector.on('change', onTileIndexChange);
  tileSelector.trigger('change');
  buttonTypeSelector.trigger('change');


  submitButton.on('click', function () {
    if (!validateSections([globalSection, tileSection, buttonSection, buttonActionSection, buttonStatusSection])) {return;}
    submitWithData({"action": "Submit", "payload": tiles});
  });

  jsonButton.on('click', function () {
    if (!validateSections([JSONSection])) {return;}
    submitWithData({"action": "Submit", "payload": JSONSection.find("JSONInput").tiles});
  });

  iconButton.on('click', function () {
    if (!validateSections([iconSection])) {return;}
    var iconURL = iconSection.find("IconURL").clay.get();
    var iconLabel = iconSection.find("IconName").clay.get();
    submitWithData({"action": "AddIcon", "param": {"url": iconURL, "label": iconLabel}});
  });

});
};

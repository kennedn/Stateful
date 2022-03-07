module.exports = function(minified) {

  var clayConfig = this;
  var _ = minified._;
  var $ = minified.$;
  var HTML = minified.HTML;
  
clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {

  
  function setClayItem(item, value) {
    if (typeof(value) === 'undefined') {
      item.set('');
      return;
    }

    if (typeof(value) === 'object') {
      item.set(JSON.stringify(value));
    } else {
      item.set(value);
    }
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
                console.log("tiles." + str + ": " + val);
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

  var submitButton = clayConfig.getItemById('ClayDummySubmit');
  var clayJSON = clayConfig.getItemById('ClayJSON');
  var claySubmit = clayConfig.getItemById('ClaySubmit');
  var tileSelector = clayConfig.getItemById('TileIndex');
  var buttonSelector = clayConfig.getItemById('ButtonIndex');
  var buttonTypeSelector = clayConfig.getItemById('ButtonType');

  var payload = JSON.parse(clayJSON.get());
  var tiles = payload[0];
  var icons = payload[1];
  clayJSON.hide();
  claySubmit.hide();

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
  
  var headingItems = clayConfig.getAllItems().filter(function(item) {
      return (item.id.endsWith('Heading'));
    });
  var buttonItems = clayConfig.getAllItems().filter(function(item) {
      return (['ButtonIndex', 'ButtonType', 'ButtonName', 'ButtonIcon'].indexOf(item.id) != -1);
    });
  var tileSection = new Section(['TileHeading'], ['TileIndex', 'TileName', 'TileColor', 'TileHighlight', 'TileIcon'],
                                [0, "tiles[0].payload.texts[6]", "tiles[0].payload.color", 
                                "tiles[0].payload.highlight",  "tiles[0].payload.icon_keys[6]"]
                                , tiles);
  // var buttonSection = new Section(['ButtonHeading'], ['ButtonIndex', 'ButtonType', 'ButtonName', 'ButtonIcon']);
  // buttonSection.setVisibility(false, false);
  var actionItems = clayConfig.getAllItems().filter(function(item) {
      return (['ButtonActionHeading', 'ButtonMethod', 'ButtonURL', 
               'ButtonHeaders', 'ButtonData'].indexOf(item.id) != -1);
    });
  var statusItems = clayConfig.getAllItems().filter(function(item) {
      return (['ButtonStatusHeading', 'ButtonStatusMethod', 'ButtonStatusURL', 
               'ButtonStatusHeaders', 'ButtonStatusData', 'ButtonStatusVariable',
               'ButtonStatusGood', 'ButtonStatusBad'].indexOf(item.id) != -1);
    });
  var tileItems = clayConfig.getAllItems().filter(function(item) {
      return (item.id.startsWith('Tile') && !item.id.endsWith('Heading'));
    });
  var concatItems = buttonItems.concat(actionItems).concat(statusItems);
  var buttonDict = {};
  for (var i in concatItems) {
    var button = concatItems[i];
    buttonDict[button.id.replace("Button","").toLowerCase()] = button;
  }



  // buttonTypeSelector.on('change', function() {
  //   var buttonVisible = !clayConfig.getItemById('ButtonHeading').$element.get("$").endsWith('hidden');
  //   var actionVisible = !clayConfig.getItemById('ButtonActionHeading').$element.get("$").endsWith('hidden');
  //   var statusVisible = !clayConfig.getItemById('ButtonStatusHeading').$element.get("$").endsWith('hidden');
  //   buttonItems.forEach(function(item) {item.hide();})
  //   actionItems.forEach(function(item) {item.hide();})
  //   statusItems.forEach(function(item) {item.hide();})

  //   if (buttonVisible) {
  //     buttonDict['index'].show();
  //     buttonDict['type'].show();
  //     switch(this.get('value')) {
  //       case "0": // Local
  //         buttonDict['name'].show();
  //         buttonDict['icon'].show();
  //         break;
  //       case "1":
  //         buttonDict['name'].show();
  //         buttonDict['icon'].show();
  //         break;
  //       case "2":
  //         buttonDict['name'].show();
  //         buttonDict['icon'].show();
  //         break;
  //       case "3":
  //         break;
  //     }
  //   }

  //   if (actionVisible) {
  //     switch(this.get('value')) {
  //       case "0": // Local
  //         buttonDict['actionheading'].show();
  //         buttonDict['method'].show();
  //         buttonDict['url'].show();
  //         buttonDict['headers'].show();
  //         buttonDict['data'].show();
  //         break;
  //       case "1":
  //         buttonDict['actionheading'].show();
  //         buttonDict['statusheading'].show();
  //         buttonDict['method'].show();
  //         buttonDict['url'].show();
  //         buttonDict['headers'].show();
  //         buttonDict['data'].show();
  //         break;
  //       case "2":
  //         buttonDict['statusheading'].show();
  //       case "3":
  //         break;
  //     }
  //   }

  //   if (statusVisible) {
  //     switch(this.get('value')) {
  //       case "0":
  //         buttonDict['actionheading'].show();
  //         break;
  //       case "1":
  //         buttonDict['actionheading'].show();
  //         buttonDict['statusheading'].show();
  //         buttonDict['statusmethod'].show();
  //         buttonDict['statusurl'].show();
  //         buttonDict['statusdata'].show();
  //         buttonDict['statusheaders'].show();
  //         buttonDict['statusvariable'].show();
  //         buttonDict['statusgood'].show();
  //         buttonDict['statusbad'].show();
  //         break;
  //       case "2":
  //         buttonDict['statusheading'].show();
  //         buttonDict['statusmethod'].show();
  //         buttonDict['statusurl'].show();
  //         buttonDict['statusdata'].show();
  //         buttonDict['statusheaders'].show();
  //         buttonDict['statusvariable'].show();
  //         buttonDict['statusgood'].show();
  //         buttonDict['statusbad'].show();
  //       case "3":
  //         break;
  //     }
  //   }
  // });
  // buttonTypeSelector.trigger('change');


  tileSelector.on('change', function() {
    // clayConfig.getItemById('TileHeading').set("Tile <font style='color:#ff4700;'>[" + this.$manipulatorTarget.get('options')[this.$manipulatorTarget.get('selectedIndex')].text + "]</font>");
    // clayConfig.getItemById('TileName').set(tiles.tiles[this.get('value')].payload.texts[6]);
    // clayConfig.getItemById('TileColor').set(tiles.tiles[this.get('value')].payload.color);
    // clayConfig.getItemById('TileHighlight').set(tiles.tiles[this.get('value')].payload.highlight);
    // clayConfig.getItemById('TileIcon').set(tiles.tiles[this.get('value')].payload.icon_keys[6]);
    // buttonSelector.trigger('change');
    tileSection.find('TileName').setTileEntry("tiles[" + this.get('value') + "].payload.texts[6]");
    tileSection.find('TileColor').setTileEntry("tiles[" + this.get('value') + "].payload.color");
    tileSection.find('TileHighlight').setTileEntry("tiles[" + this.get('value') + "].payload.highlight");
    tileSection.find('TileIcon').setTileEntry("tiles[" + this.get('value') + "].payload.icon_keys[6]");
  });

  for (var i in tiles.tiles) {
    var tile = tiles.tiles[i];
    tileSelector.$manipulatorTarget.add(new Option(tile.payload.texts[6], i));
  }
  // tileSelector.set('value', 0);
  tileSelector.$manipulatorTarget.set('value', 0);
  tileSelector.$manipulatorTarget.trigger('change');


  // buttonSelector.on('change', function() {
  //   var button = tiles.tiles[tileSelector.get('value')].buttons[this.get('value')];
  //   var name = tiles.tiles[tileSelector.get('value')].payload.texts[buttonToIndex(this.get('value'))];
  //   var icon = tiles.tiles[tileSelector.get('value')].payload.icon_keys[buttonToIndex(this.get('value'))];
  //   var buttonInputItems = ['method', 'url', 'headers', 'data', 'statusmethod', 'statusurl', 'statusdata', 'statusheaders', 'statusvariable', 'statusgood', 'statusbad'];
  //   buttonInputItems.forEach(function(item) {buttonDict[item].set('');})
  //   clayConfig.getItemById('ButtonHeading').set("Button <font style='color:#ff4700;'>[" + this.$manipulatorTarget.get('options')[this.$manipulatorTarget.get('selectedIndex')].text + "]</font>");
  //   buttonTypeSelector.$manipulatorTarget.set('value', button.type);
  //   buttonTypeSelector.$manipulatorTarget.trigger('change');
  //   setClayItem(buttonDict['name'], name);
  //   buttonDict['icon'].$manipulatorTarget.set('value', icon);
  //   buttonDict['icon'].trigger('change');
  //   switch(button.type) {
  //     case 0: // Local
  //       setClayItem(buttonDict['method'], button.method);
  //       setClayItem(buttonDict['url'], button.url);
  //       setClayItem(buttonDict['headers'], button.headers);
  //       setClayItem(buttonDict['data'], button.data);
  //       break;
  //     case 1:
  //       setClayItem(buttonDict['method'], button.method);
  //       setClayItem(buttonDict['url'], button.url);
  //       setClayItem(buttonDict['headers'], button.headers);
  //       setClayItem(buttonDict['data'], button.data);
  //       setClayItem(buttonDict['statusmethod'], button.status.method);
  //       setClayItem(buttonDict['statusurl'], button.status.url);
  //       setClayItem(buttonDict['statusdata'], button.status.data);
  //       setClayItem(buttonDict['statusheaders'], button.status.headers);
  //       setClayItem(buttonDict['statusvariable'], button.status.variable);
  //       setClayItem(buttonDict['statusgood'], button.status.good);
  //       setClayItem(buttonDict['statusbad'], button.status.bad);
  //       break;
  //     case 2:
  //       setClayItem(buttonDict['statusmethod'], button.status.method);
  //       setClayItem(buttonDict['statusurl'], button.status.url);
  //       setClayItem(buttonDict['statusdata'], button.status.data);
  //       setClayItem(buttonDict['statusheaders'], button.status.headers);
  //       setClayItem(buttonDict['statusvariable'], button.status.variable);
  //       setClayItem(buttonDict['statusgood'], button.status.good);
  //       setClayItem(buttonDict['statusbad'], button.status.bad);
  //       break;
  //     case 3:
  //       break;
  //     default:
  //       break;
  //   }
  // });
  // buttonSelector.trigger('change');

  // headingItems.forEach(function(heading) {
  //   heading.on('click', function() {
  //     var visible = !(this.$element.get("$").endsWith('hidden'));
  //     switch(this.id) {
  //       case "TileHeading":
  //         tileItems.forEach(function(item) {
  //           visibility(item, visible);
  //         });
  //         break;
  //       case "ButtonHeading":
  //         buttonItems.forEach(function(item) {
  //           visibility(item, visible);
  //         });
  //         if (visible) { buttonTypeSelector.trigger('change'); }
  //         break;
  //       case "ButtonActionHeading":
  //         actionItems.forEach(function(item) {
  //           if (!visible && item.id == 'ButtonActionHeading') {return;}
  //           visibility(item, visible);
  //         });
  //         if (visible) { buttonTypeSelector.trigger('change'); }
  //         break;
  //       case "ButtonStatusHeading":
  //         statusItems.forEach(function(item) {
  //           if (!visible && item.id == 'ButtonStatusHeading') {return;}
  //           visibility(item, visible);
  //         });
  //         if (visible) { buttonTypeSelector.trigger('change'); }
  //         break;
  //     }
  //   });
  // });


  submitButton.on('click', function () {
      var t_json = {"action": "Submit", "payload": tiles};
      // t_json.payload.push({"id": "ClayJSON", "value": tiles})
      
      // var items = clayConfig.getAllItems();
      // items.forEach(function(item, index) {
      //   var t_dict = { "id": item.id, "value": item.get() };
      //   console.log(JSON.stringify(t_dict));
      //    t_json.payload.push(t_dict);
      //  });
      // clayJSON.set(JSON.stringify(t_json));
      var ret_url = window.returnTo || "pebblejs://close#";
      location.href = ret_url + encodeURIComponent(JSON.stringify(t_json));
      // claySubmit.trigger('submit');
    });
  });
};

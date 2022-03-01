module.exports = function(minified) {

  var clayConfig = this;
  var _ = minified._;
  var $ = minified.$;
  var HTML = minified.HTML;
window.onload = function() {
  
}
clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {

  function visibility(item, visible) {
    if (visible) {
      item.show();
    } else {
      item.hide();
    }
  }
  
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

  var submitButton = clayConfig.getItemById('ClayDummySubmit');
  var clayJSON = clayConfig.getItemById('ClayJSON');
  var claySubmit = clayConfig.getItemById('ClaySubmit');
  var tileSelector = clayConfig.getItemById('TileIndex');
  var buttonSelector = clayConfig.getItemById('ButtonIndex');
  var buttonTypeSelector = clayConfig.getItemById('ButtonType');

  
  var headingItems = clayConfig.getAllItems().filter(function(item) {
      return (item.id.endsWith('Heading'));
    });
  var buttonItems = clayConfig.getAllItems().filter(function(item) {
      return (item.id.startsWith('Button') && !item.id.endsWith('Heading'));
    });
  var tileItems = clayConfig.getAllItems().filter(function(item) {
      return (item.id.startsWith('Tile') && !item.id.endsWith('Heading'));
    });
  var iconItems = clayConfig.getAllItems().filter(function(item) {
      return (item.id.endsWith('Icon') && !item.id.endsWith('Heading'));
    });

  var buttonDict = {};
  for (var i in buttonItems) {
    var button = buttonItems[i];
    buttonDict[button.id.replace("Button","").toLowerCase()] = button;
  }

  clayJSON.hide();
  var payload = JSON.parse(clayJSON.get());
  var tiles = payload[0];
  var icons = payload[1];
  claySubmit.hide();

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

  buttonTypeSelector.on('change', function() {
    if(clayConfig.getItemById('ButtonHeading').$element.get("$").endsWith('hidden')) { return; } // Heading is hidden, so don't show anything
    buttonItems.forEach(function(item) {item.hide();})
    buttonDict['index'].show();
    buttonDict['type'].show();
    switch(this.get('value')) {
      case "0": // Local
        buttonDict['name'].show();
        buttonDict['icon'].show();
        buttonDict['method'].show();
        buttonDict['url'].show();
        buttonDict['headers'].show();
        buttonDict['data'].show();
        break;
      case "1":
        buttonDict['name'].show();
        buttonDict['icon'].show();
        buttonDict['method'].show();
        buttonDict['url'].show();
        buttonDict['headers'].show();
        buttonDict['data'].show();
        buttonDict['statusmethod'].show();
        buttonDict['statusurl'].show();
        buttonDict['statusdata'].show();
        buttonDict['statusheaders'].show();
        buttonDict['statusvariable'].show();
        buttonDict['statusgood'].show();
        buttonDict['statusbad'].show();
        break;
      case "2":
        buttonDict['name'].show();
        buttonDict['icon'].show();
        buttonDict['statusmethod'].show();
        buttonDict['statusurl'].show();
        buttonDict['statusheaders'].show();
        buttonDict['statusdata'].show();
        buttonDict['statusvariable'].show();
        buttonDict['statusgood'].show();
        buttonDict['statusbad'].show();
        break;
      case "3":
        break;
      default:
        buttonItems.forEach(function(item) {item.show();})
        break
    }
  });
  buttonTypeSelector.trigger('change');


  tileSelector.on('change', function() {
    clayConfig.getItemById('TileHeading').set("Tile <font style='color:#ff4700;'>[" + this.$manipulatorTarget.get('options')[this.$manipulatorTarget.get('selectedIndex')].text + "]</font>");
    clayConfig.getItemById('TileName').set(tiles.tiles[this.get('value')].payload.texts[6]);
    clayConfig.getItemById('TileColor').set(tiles.tiles[this.get('value')].payload.color);
    clayConfig.getItemById('TileHighlight').set(tiles.tiles[this.get('value')].payload.highlight);
    clayConfig.getItemById('TileIcon').set(tiles.tiles[this.get('value')].payload.icon_keys[6]);
    buttonSelector.trigger('change');
  });

  for (var i in tiles.tiles) {
    var tile = tiles.tiles[i];
    tileSelector.$manipulatorTarget.add(new Option(tile.payload.texts[6], i));
  }
  tileSelector.$manipulatorTarget.set('value', 0);
  tileSelector.$manipulatorTarget.trigger('change');


  buttonSelector.on('change', function() {
    var button = tiles.tiles[tileSelector.get('value')].buttons[this.get('value')];
    var name = tiles.tiles[tileSelector.get('value')].payload.texts[buttonToIndex(this.get('value'))];
    var icon = tiles.tiles[tileSelector.get('value')].payload.icon_keys[buttonToIndex(this.get('value'))];
    var buttonInputItems = ['method', 'url', 'headers', 'data', 'statusmethod', 'statusurl', 'statusdata', 'statusheaders', 'statusvariable', 'statusgood', 'statusbad'];
    buttonInputItems.forEach(function(item) {buttonDict[item].set('');})
    clayConfig.getItemById('ButtonHeading').set("Button <font style='color:#ff4700;'>[" + this.$manipulatorTarget.get('options')[this.$manipulatorTarget.get('selectedIndex')].text + "]</font>");
    buttonTypeSelector.$manipulatorTarget.set('value', button.type);
    buttonTypeSelector.$manipulatorTarget.trigger('change');
    setClayItem(buttonDict['name'], name);
    buttonDict['icon'].$manipulatorTarget.set('value', icon);
    buttonDict['icon'].trigger('change');
    switch(button.type) {
      case 0: // Local
        setClayItem(buttonDict['method'], button.method);
        setClayItem(buttonDict['url'], button.url);
        setClayItem(buttonDict['headers'], button.headers);
        setClayItem(buttonDict['data'], button.data);
        break;
      case 1:
        setClayItem(buttonDict['method'], button.method);
        setClayItem(buttonDict['url'], button.url);
        setClayItem(buttonDict['headers'], button.headers);
        setClayItem(buttonDict['data'], button.data);
        setClayItem(buttonDict['statusmethod'], button.status.method);
        setClayItem(buttonDict['statusurl'], button.status.url);
        setClayItem(buttonDict['statusdata'], button.status.data);
        setClayItem(buttonDict['statusheaders'], button.status.headers);
        setClayItem(buttonDict['statusvariable'], button.status.variable);
        setClayItem(buttonDict['statusgood'], button.status.good);
        setClayItem(buttonDict['statusbad'], button.status.bad);
        break;
      case 2:
        setClayItem(buttonDict['statusmethod'], button.status.method);
        setClayItem(buttonDict['statusurl'], button.status.url);
        setClayItem(buttonDict['statusdata'], button.status.data);
        setClayItem(buttonDict['statusheaders'], button.status.headers);
        setClayItem(buttonDict['statusvariable'], button.status.variable);
        setClayItem(buttonDict['statusgood'], button.status.good);
        setClayItem(buttonDict['statusbad'], button.status.bad);
        break;
      case 3:
        break;
      default:
        break;
    }
  });
  buttonSelector.trigger('change');

  headingItems.forEach(function(heading) {
    heading.on('click', function() {
      var visible = !(this.$element.get("$").endsWith('hidden'));
      switch(this.id) {
        case "TileHeading":
          tileItems.forEach(function(item) {
            visibility(item, visible);
          });
          break;
        case "ButtonHeading":
          buttonItems.forEach(function(item) {
            visibility(item, visible);
            if (visible) { buttonTypeSelector.trigger('change'); }
          });
          break;
      }
    });
  });


  submitButton.on('click', function () {
      var t_json = {"action": "Submit", "payload": []};
      var items = clayConfig.getAllItems();
      items.forEach(function(item, index) {
        var t_dict = { "id": item.id, "value": item.get() };
        console.log(JSON.stringify(t_dict));
         t_json.payload.push(t_dict);
       });
      clayJSON.set(JSON.stringify(t_json));
      claySubmit.trigger('submit');
    });
  });
};

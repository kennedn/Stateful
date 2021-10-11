module.exports = function(minified) {

  var clayConfig = this;
  var _ = minified._;
  var $ = minified.$;
  var HTML = minified.HTML;
window.onload = function() {
  
}
clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {

  var textarea = $("textarea");
  $(textarea).on('input', function() {
    this.set('$height', 'auto');
    this.set('$height', this[0].scrollHeight + "px");
  });
  $(textarea).trigger('input');

  var pebblekit_header = clayConfig.getItemById('pebblekit_header')
  var pebblekit_message = clayConfig.getItemById('pebblekit_message')
  var json_header = clayConfig.getItemById('json_header')
  var json_string = clayConfig.getItemById('json_string')

  pebblekit_header.on('click', function() {
    if (pebblekit_message.$element.get("$display") == 'none') {
      pebblekit_message.show(); 
    } else {
      pebblekit_message.hide();
    }
  });

  json_header.on('click', function() {
    if (json_string.$element.get("$display") == 'none') {
      json_string.show(); 
    } else {
      json_string.hide();
    }
  });


  var submitButton = clayConfig.getItemById('Submit');
  var clayJSON = clayConfig.getItemById('ClayJSON');
  var claySubmit = clayConfig.getItemById('ClaySubmit');
  clayJSON.hide();
  clayJSON.set('');
  claySubmit.hide();

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

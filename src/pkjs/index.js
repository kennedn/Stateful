
var rest_data = [["PUT", "tvcom/power", ["status", "on", "off"]],
                 ["PUT", "pc",          ["status", "power"]],
                 ["PUT", "bulb",        ["off", "on"]]];

// Called when the message send attempt succeeds
function messageSuccessHandler() {
  console.log("Message send succeeded.");  
}

// Called when the message send attempt fails
function messageFailureHandler() {
  console.log("Message send failed.");
}

function reply_to_query(responseText) {
  var response = JSON.parse(responseText);
  console.log("Status: " + response[Object.keys(response)[0]]);
  Pebble.sendAppMessage({"status": response[Object.keys(response)[0]]}, messageSuccessHandler, messageFailureHandler);
}

function xhr_request(method, url, params) {
   var request = new XMLHttpRequest();
   request.onload = function() {
   	if(this.status < 300)
    	reply_to_query(this.responseText);
    else
    	reply_to_query('{ "message": "Error" }');
  };
   console.log("Trying " +url +"?"+params + " with method " + method);
   request.open(method, url +"?"+params);   
   request.send();  
}

// Called when JavaScript is ready
Pebble.addEventListener("ready", function(e) {
  console.log("JS is ready!");
});
												
// Called when incoming message from the Pebble is received
Pebble.addEventListener("appmessage", function(e) {
  var dict = e.payload;
  
  console.log('Got message: ' + JSON.stringify(dict));
  
  if (!("endpoint" in dict) || !("param" in dict)) {
    console.log("didn't recieve expected data");
    return;
  }

  var method = rest_data[dict.endpoint][0];
  var url = "http://" + rest_data[dict.endpoint][1]; 
  var param = "code=" + rest_data[dict.endpoint][2][dict.param];
  xhr_request(method, url, param);
  
});
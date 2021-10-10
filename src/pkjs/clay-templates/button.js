module.exports = [
  {
    "type": "select",
    "label": "$$$label$$$",
    "id": "$$$button$$$type$$$index$$$",
    "defaultValue": "3",
    "options": [
      {
        "label": "Local",
        "value": 0
      },
      {
        "label": "Stateful",
        "value": 1
      },
      {
        "label": "Status only",
        "value": 2
      },
      {
        "label": "Disabled",
        "value": 3
      }
    ],
    "group": "tile.0"
  },
  {
    "type": "input",
    "id": "$$$button$$$name$$$index$$$",
    "label": "Name",
    "group": "tile.0"
  },
  {
    "type": "select2",
    "label": "Icon",
    "id": "$$$button$$$icon$$$index$$$",
    "defaultValue": "77de68da",
    "options": [
          {"src": "https://kennedn.com/icons/tv.png",
          "label": "tv",
          "value": "da4b9237"},
          {"src": "https://kennedn.com/icons/bulb.png",
          "label": "bulb",
          "value": "77de68da"}
        ],
    "group": "tile.0"
  },
  {
    "type": "select",
    "id": "$$$button$$$method$$$index$$$",
    "defaultValue": "PUT",
    "label": "Method",
    "options": [
      { "label": "GET", "value": "GET"},
      { "label": "POST", "value": "POST"},
      { "label": "PUT", "value": "PUT"},
      { "label": "DELETE", "value": "DELETE"}
    ],
    "group": "tile.0"
  },
  {
    "type": "input",
    "id": "$$$button$$$url$$$index$$$",
    "label": "URL",
    "group": "tile.0",
    "attributes": {
      "autocapitalize": "off",
      "autocorrect": "off",
      "autocomplete": "off",
      "spellcheck": "false"
    }
  },
  {
    "type": "input",
    "id": "$$$button$$$headers$$$index$$$",
    "label": "Headers",
    "defaultValue": "{}",
    "group": "tile.0",
    "attributes": {
      "autocapitalize": "off",
      "autocorrect": "off",
      "autocomplete": "off",
      "spellcheck": "false"
    }
  },
  {
    "type": "input",
    "id": "$$$button$$$data$$$index$$$",
    "label": "Data",
    "defaultValue": "{}",
    "group": "tile.0",
    "attributes": {
      "autocapitalize": "off",
      "autocorrect": "off",
      "autocomplete": "off",
      "spellcheck": "false"
    }
    
  },
  {
    "type": "select",
    "id": "$$$button$$$status_method$$$index$$$",
    "defaultValue": "PUT",
    "label": "Status Method",
    "options": [
      { "label": "GET", "value": "GET"},
      { "label": "POST", "value": "POST"},
      { "label": "PUT", "value": "PUT"},
      { "label": "DELETE", "value": "DELETE"}
    ],
    "group": "tile.0"
  },
  {
    "type": "input",
    "id": "$$$button$$$status_url$$$index$$$",
    "label": "Status URL",
    "group": "tile.0",
    "attributes": {
      "autocapitalize": "off",
      "autocorrect": "off",
      "autocomplete": "off",
      "spellcheck": "false"
    }
  },
  {
    "type": "input",
    "id": "$$$button$$$status_headers$$$index$$$",
    "label": "Status headers",
    "defaultValue": "{}",
    "group": "tile.0",
    "attributes": {
      "autocapitalize": "off",
      "autocorrect": "off",
      "autocomplete": "off",
      "spellcheck": "false"
    }
  },
  {
    "type": "input",
    "id": "$$$button$$$status_data$$$index$$$",
    "label": "Data",
    "defaultValue": "{}",
    "group": "tile.0",
    "attributes": {
      "autocapitalize": "off",
      "autocorrect": "off",
      "autocomplete": "off",
      "spellcheck": "false"
    }
    
  },
  {
    "type": "input",
    "id": "$$$button$$$status_variable$$$index$$$",
    "label": "Status variable",
    "group": "tile.0",
    "attributes": {
      "autocapitalize": "off",
      "autocorrect": "off",
      "autocomplete": "off",
      "spellcheck": "false"
    }
  },
  {
    "type": "input",
    "id": "$$$button$$$status_good$$$index$$$",
    "label": "Status <font style='color:green;'>good value</font>",
    "group": "tile.0",
    "attributes": {
      "autocapitalize": "off",
      "autocorrect": "off",
      "autocomplete": "off",
      "spellcheck": "false"
    }
  },
  {
    "type": "input",
    "id": "$$$button$$$status_bad$$$index$$$",
    "label": "Status <font style='color:red;'>bad value</font>",
    "group": "tile.0",
    "attributes": {
      "autocapitalize": "off",
      "autocorrect": "off",
      "autocomplete": "off",
      "spellcheck": "false"
    }
  }
]
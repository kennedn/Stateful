module.exports = 
 [
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "PebbleKit Message",
        "id": "pebblekit_header"
      },
      {
        "type": "input",
        "id": "pebblekit_message",
        "defaultValue": "No JSON loaded",
        "attributes": {
          "readonly": true
        }
      }
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Tiles JSON",
        "id": "json_header"
      },
      {
        "type": "textarea",
        "id": "json_string",
        "attributes": {
          "word-break": "break-word"
        }
      }
    ]
     
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Global Settings"
      },
      {
        "type": "select",
        "label": "Default tile",
        "id": "default_idx",
        "defaultValue": "0",
        "options": [
          {
            "label": "0",
            "value": "0"
          }
        ]
      },
      {
        "type": "toggle",
        "id": "open_default",
        "label": "Open default tile on launch",
        "defaultValue": false
      },
      {
        "type": "input",
        "id": "base_url",
        "label": "Base URL",
        "attributes": {
          "type": "url"
        }
      },
      {
        "type": "input",
        "id": "headers",
        "defaultValue": "{}",
        "label": "Headers",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        }
      }
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "tile ",
        "id": "tile"
      },
      {
        "type": "select",
        "label": "Tile Index",
        "id": "tile_index",
        "description": "Tile index to edit below",
        "defaultValue": "0",
        "options": [
          {
            "label": "0",
            "value": 0
          },
          {
            "label": "1",
            "value": 1
          },
          {
            "label": "2",
            "value": 2
          },
          {
            "label": "3",
            "value": 3
          }
        ],
        "group": "tile,up"
      },
      {
        "type": "input",
        "id": "name",
        "label": "<font style='color:#ff4700;'>* </font>Name",
        "attributes": {
          "required": true,
          "maxLength": 13
        },
        "group": "tile"
      },
      {
        "type": "color",
        "id": "color",
        "defaultValue": "0055aa",
        "label": "Color",
        "layout": "COLOR",
        "sunlight": false,
        "group": "tile"
      },
      {
        "type": "color",
        "id": "highlight",
        "defaultValue": "00aaff",
        "label": "Highlight",
        "layout": "COLOR",
        "sunlight": false,
        "group": "tile"
      },
      {
        "type": "select2",
        "label": "Icon",
        "id": "icon",
        "defaultValue": "da4b9237",
        "options": [
          {
            "src": "https://kennedn.com/icons/bulb.webp",
            "label": "tv",
            "value": "da4b9237"
          },
          {
            "src": "https://kennedn.com/icons/bulb.png",
            "label": "bulb",
            "value": "77de68da"
          }
        ],
        "group": "tile"
      },
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Up Button",
        "id": "up_tile"
      },
      {
        "type": "select",
        "label": "Type",
        "id": "up_type",
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
        "group": "tile,up"
      },
      {
        "type": "input",
        "id": "up_name",
        "label": "Name",
        "group": "tile,up"
      },
      {
        "type": "select2",
        "label": "Icon",
        "id": "up_icon",
        "defaultValue": "77de68da",
        "options": [
          {
            "src": "https://kennedn.com/icons/tv.png",
            "label": "tv",
            "value": "da4b9237"
          },
          {
            "src": "https://kennedn.com/icons/bulb.png",
            "label": "bulb",
            "value": "77de68da"
          }
        ],
        "group": "tile,up"
      },
      {
        "type": "select",
        "id": "up_method",
        "defaultValue": "PUT",
        "label": "Method",
        "options": [
          {
            "label": "GET",
            "value": "GET"
          },
          {
            "label": "POST",
            "value": "POST"
          },
          {
            "label": "PUT",
            "value": "PUT"
          },
          {
            "label": "DELETE",
            "value": "DELETE"
          }
        ],
        "group": "tile,up,local,stateful"
      },
      {
        "type": "input",
        "id": "up_url",
        "label": "URL",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        },
        "group": "tile,up,local,stateful"
      },
      {
        "type": "input",
        "id": "up_headers",
        "label": "Headers",
        "defaultValue": "{}",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        },
        "group": "tile,up,local,stateful"
      },
      {
        "type": "input",
        "id": "up_data",
        "label": "Data",
        "defaultValue": "{}",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        },
        "group": "tile,up,local,stateful"
      },
      {
        "type": "select",
        "id": "up_status_method",
        "defaultValue": "PUT",
        "label": "Status Method",
        "options": [
          {
            "label": "GET",
            "value": "GET"
          },
          {
            "label": "POST",
            "value": "POST"
          },
          {
            "label": "PUT",
            "value": "PUT"
          },
          {
            "label": "DELETE",
            "value": "DELETE"
          }
        ],
        "group": "tile,up,status,stateful"
      },
      {
        "type": "input",
        "id": "up_status_url",
        "label": "Status URL",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        },
        "group": "tile,up,status,stateful"
      },
      {
        "type": "input",
        "id": "up_status_headers",
        "label": "Status headers",
        "defaultValue": "{}",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        },
        "group": "tile,up,status,stateful"
      },
      {
        "type": "input",
        "id": "up_status_data",
        "label": "Data",
        "defaultValue": "{}",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        },
        "group": "tile,up,status,stateful"
      },
      {
        "type": "input",
        "id": "up_status_variable",
        "label": "Status variable",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        },
        "group": "tile,up,status,stateful"
      },
      {
        "type": "input",
        "id": "up_status_good",
        "label": "Status <font style='color:green;'>good value</font>",
        "group": "tile.0",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        },
        "group": "tile,up,status,stateful"
      },
      {
        "type": "input",
        "id": "up_status_bad",
        "label": "Status <font style='color:red;'>bad value</font>",
        "group": "tile.0",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        },
        "group": "tile,up,status,stateful"
      },
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "button",
        "id": "Submit",
        "defaultValue": "Submit",
        "primary": true,
        "group": "submits"
      },
      {
        "type": "submit",
        "id": "ClaySubmit",
        "defaultValue": "",
        "group": "submits"
      },
      {
        "type": "input",
        "messageKey": "ClayJSON",
        "id": "ClayJSON",
        "attributes": {
          "type": "text",
          "style": "display: none;"
        }
      }
    ]
  }
]

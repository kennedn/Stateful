module.exports = 
 [
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Tile",
        "id": "TileHeading"
      },
      {
        "type": "select",
        "label": "Tile Selection",
        "id": "TileIndex",
        "defaultValue": "0",
        "options": [
        ],
      },
      {
        "type": "input",
        "id": "TileName",
        "label": "<font style='color:#ff4700;'>* </font>Name",
        "attributes": {
          "required": true,
          "maxLength": 13,
        },
      },
      {
        "type": "color",
        "id": "TileColor",
        "defaultValue": "000000",
        "label": "Color",
        "layout": "COLOR",
        "sunlight": true,
      },
      {
        "type": "color",
        "id": "TileHighlight",
        "defaultValue": "ffffff",
        "label": "Highlight",
        "layout": "COLOR",
        "sunlight": true,
      },
      {
        "type": "select2",
        "id": "TileIcon",
        "defaultValue": 0,
        "label": "Icon",
        "options": [
          {"src": "#", "label": "", "value": 0}
        ],
      }
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Button",
        "id": "ButtonHeading"
      },
      {
        "type": "select",
        "label": "Button Selection",
        "id": "ButtonIndex",
        "defaultValue": "up",
        "options": [
          {"label": "Up", "value": "up"},
          {"label": "Middle", "value": "mid"},
          {"label": "Down", "value": "down"},
          {"label": "Up Overflow", "value": "up_hold"},
          {"label": "Middle Overflow", "value": "mid_hold"},
          {"label": "Down Overflow", "value": "down_hold"},
        ],
      },
      {
        "type": "select",
        "label": "Button Type",
        "id": "ButtonType",
        "defaultValue": "3",
        "options": [
          { "label": "Local", "value": 0 }, 
          { "label": "Stateful", "value": 1 }, 
          { "label": "Status only", "value": 2 }, 
          { "label": "Disabled", "value": 3 }
        ],
      },
      {
        "type": "input",
        "id": "ButtonName",
        "label": "<font style='color:#ff4700;'>* </font>Name",
        "attributes": {
          "required": true,
          "maxLength": 18,
        },
      },
      {
        "type": "select2",
        "id": "ButtonIcon",
        "defaultValue": 0,
        "label": "Icon",
        "options": [
          {"src": "#", "label": "", "value": 0}
        ],
      }
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Button <font style='color:#ff4700;'>[ACTION]</font>",
        "id": "ButtonActionHeading"
      },
      {
        "type": "select",
        "id": "ButtonMethod",
        "defaultValue": "PUT",
        "label": "<font style='color:#ff4700;'>*</font> Method",
        "options": [
          { "label": "GET", "value": "GET"},
          { "label": "POST", "value": "POST"},
          { "label": "PUT", "value": "PUT"},
          { "label": "DELETE", "value": "DELETE"}
        ],
      },
      {
        "type": "input",
        "id": "ButtonURL",
        "label": "<font style='color:#ff4700;'>*</font> URL",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        }
      },
      {
        "type": "input",
        "id": "ButtonHeaders",
        "label": "Headers",
        "defaultValue": "{}",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        }
      },
      {
        "type": "input",
        "id": "ButtonData",
        "label": "Data",
        "defaultValue": "{}",
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
        "defaultValue": "Button <font style='color:#ff4700;'>[STATUS]</font>",
        "id": "ButtonStatusHeading"
      },
      {
        "type": "select",
        "id": "ButtonStatusMethod",
        "defaultValue": "PUT",
        "label": "<font style='color:#ff4700;'>*</font> Method",
        "options": [
          { "label": "GET", "value": "GET"},
          { "label": "POST", "value": "POST"},
          { "label": "PUT", "value": "PUT"},
          { "label": "DELETE", "value": "DELETE"}
        ],
      },
      {
        "type": "input",
        "id": "ButtonStatusURL",
        "label": "<font style='color:#ff4700;'>*</font> URL",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        }
      },
      {
        "type": "input",
        "id": "ButtonStatusHeaders",
        "label": "Status Headers",
        "defaultValue": "{}",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        }
      },
      {
        "type": "input",
        "id": "ButtonStatusData",
        "label": "Status Data",
        "defaultValue": "{}",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        }
        
      },
      {
        "type": "input",
        "id": "ButtonStatusVariable",
        "label": "<font style='color:#ff4700;'>*</font> Variable",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        }
      },
      {
        "type": "input",
        "id": "ButtonStatusGood",
        "label": "<font style='color:#ff4700;'>*</font> <font style='color:green;'>Good Value</font>",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        }
      },
      {
        "type": "input",
        "id": "ButtonStatusBad",
        "label": "<font style='color:#ff4700;'>*</font> <font style='color:red;'>Bad Value</font>",
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
        "type": "button",
        "id": "ClayDummySubmit",
        "defaultValue": "Submit",
        "primary": true,
      },
      {
        "type": "submit",
        "id": "ClaySubmit",
        "defaultValue": "",
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

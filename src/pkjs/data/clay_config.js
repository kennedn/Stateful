module.exports = 
 [
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "JSON Manager",
        "id": "JSONHeading"
      },
      {
        "type": "textarea",
        "id": "JSONInput",
        "label": "JSON",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        }
      },
      {
        "type": "button",
        "id": "JSONSubmit",
        "defaultValue": "Import",
        "primary": true,
      },
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Icon Manager",
        "id": "IconHeading",
        "capabilities": ["NOT_PLATFORM_APLITE"]
      },
      {
        "type": "select2",
        "label": "Custom Icons",
        "id": "IconIndex",
        "defaultValue": "0",
        "options": [
          {"src": "#", "label": "", "value": 0}
        ],
        "capabilities": ["NOT_PLATFORM_APLITE"]
      },
      {
        "type": "input",
        "id": "IconURL",
        "label": "<font style='color:#ff4700;'>* </font>URL",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "type": "url",
          "spellcheck": "false"
        },
        "capabilities": ["NOT_PLATFORM_APLITE"]
      },
      {
        "type": "input",
        "id": "IconName",
        "label": "Name",
        "defaultValue": "{}",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        },
        "capabilities": ["NOT_PLATFORM_APLITE"]
      },
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Global",
        "id": "GlobalHeading"
      },
      {
        "type": "select",
        "label": "Default Index",
        "id": "GlobalIndex",
        "defaultValue": "0",
        "options": [
        ],
      },
      {
        "type": "toggle",
        "label": "Open Default",
        "id": "GlobalToggle",
      },
      {
        "type": "input",
        "id": "GlobalURL",
        "label": "Base URL",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "type": "url",
          "spellcheck": "false"
        }
      },
      {
        "type": "textarea",
        "id": "GlobalHeaders",
        "label": "Global Headers",
        "defaultValue": "{}",
        "attributes": {
          "autocapitalize": "off",
          "autocorrect": "off",
          "autocomplete": "off",
          "spellcheck": "false"
        }
      },
    ]
  },
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
        "capabilities": ["COLOR"]
      },
      {
        "type": "color",
        "id": "TileHighlight",
        "defaultValue": "ffffff",
        "label": "Highlight",
        "layout": "COLOR",
        "sunlight": true,
        "capabilities": ["COLOR"]
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
          "spellcheck": "false",
          "required": true,
        }
      },
      {
        "type": "textarea",
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
        "type": "textarea",
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
          "required": true,
          "spellcheck": "false"
        }
      },
      {
        "type": "textarea",
        "id": "ButtonStatusHeaders",
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
        "type": "textarea",
        "id": "ButtonStatusData",
        "label": "Data",
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
          "required": true,
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
          "required": true,
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
          "required": true,
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
        "id": "ClaySubmit",
        "defaultValue": "Submit",
        "primary": true,
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

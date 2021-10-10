module.exports = 
 [
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "PebbleKit Message"
      },
      {
        "type": "input",
        "id": "pebblekit_message",
        "defaultValue": "This is an error",
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
        "id": "tile$0"
      },
      {
        "type": "input",
        "id": "name$0",
        "label": "<font style='color:#ff4700;'>* </font>Name",
        "attributes": {
          "required": true,
          "maxLength": 13
        }
      },
      {
        "type": "color",
        "id": "color$0",
        "defaultValue": "0055aa",
        "label": "Color",
        "layout": "COLOR",
        "sunlight": true
      },
      {
        "type": "color",
        "id": "highlight$0",
        "defaultValue": "00aaff",
        "label": "Highlight",
        "layout": "COLOR",
        "sunlight": true
      },
      {
        "type": "select2",
        "label": "Icon",
        "id": "icon$0",
        "defaultValue": "da4b9237",
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
        "group": "tile.0"
      },
      [
        {
          "type": "select",
          "label": "UP BUTTON",
          "id": "up$type$0",
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
          "id": "up$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$url$0",
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
          "id": "up$headers$0",
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
          "id": "up$data$0",
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
          "id": "up$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$status_url$0",
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
          "id": "up$status_headers$0",
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
          "id": "up$status_data$0",
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
          "id": "up$status_variable$0",
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
          "id": "up$status_good$0",
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
          "id": "up$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "UP OVERFLOW BUTTON",
          "id": "up_hold$type$0",
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
          "id": "up_hold$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up_hold$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up_hold$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$url$0",
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
          "id": "up_hold$headers$0",
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
          "id": "up_hold$data$0",
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
          "id": "up_hold$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$status_url$0",
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
          "id": "up_hold$status_headers$0",
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
          "id": "up_hold$status_data$0",
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
          "id": "up_hold$status_variable$0",
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
          "id": "up_hold$status_good$0",
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
          "id": "up_hold$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID BUTTON",
          "id": "mid$type$0",
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
          "id": "mid$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$url$0",
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
          "id": "mid$headers$0",
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
          "id": "mid$data$0",
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
          "id": "mid$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$status_url$0",
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
          "id": "mid$status_headers$0",
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
          "id": "mid$status_data$0",
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
          "id": "mid$status_variable$0",
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
          "id": "mid$status_good$0",
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
          "id": "mid$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID OVERFLOW BUTTON",
          "id": "mid_hold$type$0",
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
          "id": "mid_hold$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid_hold$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid_hold$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$url$0",
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
          "id": "mid_hold$headers$0",
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
          "id": "mid_hold$data$0",
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
          "id": "mid_hold$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$status_url$0",
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
          "id": "mid_hold$status_headers$0",
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
          "id": "mid_hold$status_data$0",
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
          "id": "mid_hold$status_variable$0",
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
          "id": "mid_hold$status_good$0",
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
          "id": "mid_hold$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN BUTTON",
          "id": "down$type$0",
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
          "id": "down$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$url$0",
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
          "id": "down$headers$0",
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
          "id": "down$data$0",
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
          "id": "down$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$status_url$0",
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
          "id": "down$status_headers$0",
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
          "id": "down$status_data$0",
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
          "id": "down$status_variable$0",
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
          "id": "down$status_good$0",
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
          "id": "down$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN OVERFLOW BUTTON",
          "id": "down_hold$type$0",
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
          "id": "down_hold$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down_hold$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down_hold$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$url$0",
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
          "id": "down_hold$headers$0",
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
          "id": "down_hold$data$0",
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
          "id": "down_hold$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$status_url$0",
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
          "id": "down_hold$status_headers$0",
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
          "id": "down_hold$status_data$0",
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
          "id": "down_hold$status_variable$0",
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
          "id": "down_hold$status_good$0",
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
          "id": "down_hold$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "UP BUTTON",
          "id": "up$type$0",
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
          "id": "up$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$url$0",
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
          "id": "up$headers$0",
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
          "id": "up$data$0",
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
          "id": "up$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$status_url$0",
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
          "id": "up$status_headers$0",
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
          "id": "up$status_data$0",
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
          "id": "up$status_variable$0",
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
          "id": "up$status_good$0",
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
          "id": "up$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "UP OVERFLOW BUTTON",
          "id": "up_hold$type$0",
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
          "id": "up_hold$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up_hold$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up_hold$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$url$0",
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
          "id": "up_hold$headers$0",
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
          "id": "up_hold$data$0",
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
          "id": "up_hold$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$status_url$0",
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
          "id": "up_hold$status_headers$0",
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
          "id": "up_hold$status_data$0",
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
          "id": "up_hold$status_variable$0",
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
          "id": "up_hold$status_good$0",
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
          "id": "up_hold$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID BUTTON",
          "id": "mid$type$0",
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
          "id": "mid$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$url$0",
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
          "id": "mid$headers$0",
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
          "id": "mid$data$0",
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
          "id": "mid$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$status_url$0",
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
          "id": "mid$status_headers$0",
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
          "id": "mid$status_data$0",
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
          "id": "mid$status_variable$0",
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
          "id": "mid$status_good$0",
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
          "id": "mid$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID OVERFLOW BUTTON",
          "id": "mid_hold$type$0",
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
          "id": "mid_hold$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid_hold$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid_hold$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$url$0",
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
          "id": "mid_hold$headers$0",
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
          "id": "mid_hold$data$0",
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
          "id": "mid_hold$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$status_url$0",
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
          "id": "mid_hold$status_headers$0",
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
          "id": "mid_hold$status_data$0",
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
          "id": "mid_hold$status_variable$0",
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
          "id": "mid_hold$status_good$0",
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
          "id": "mid_hold$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN BUTTON",
          "id": "down$type$0",
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
          "id": "down$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$url$0",
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
          "id": "down$headers$0",
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
          "id": "down$data$0",
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
          "id": "down$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$status_url$0",
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
          "id": "down$status_headers$0",
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
          "id": "down$status_data$0",
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
          "id": "down$status_variable$0",
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
          "id": "down$status_good$0",
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
          "id": "down$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN OVERFLOW BUTTON",
          "id": "down_hold$type$0",
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
          "id": "down_hold$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down_hold$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down_hold$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$url$0",
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
          "id": "down_hold$headers$0",
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
          "id": "down_hold$data$0",
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
          "id": "down_hold$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$status_url$0",
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
          "id": "down_hold$status_headers$0",
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
          "id": "down_hold$status_data$0",
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
          "id": "down_hold$status_variable$0",
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
          "id": "down_hold$status_good$0",
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
          "id": "down_hold$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "UP BUTTON",
          "id": "up$type$0",
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
          "id": "up$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$url$0",
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
          "id": "up$headers$0",
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
          "id": "up$data$0",
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
          "id": "up$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$status_url$0",
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
          "id": "up$status_headers$0",
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
          "id": "up$status_data$0",
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
          "id": "up$status_variable$0",
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
          "id": "up$status_good$0",
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
          "id": "up$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "UP OVERFLOW BUTTON",
          "id": "up_hold$type$0",
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
          "id": "up_hold$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up_hold$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up_hold$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$url$0",
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
          "id": "up_hold$headers$0",
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
          "id": "up_hold$data$0",
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
          "id": "up_hold$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$status_url$0",
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
          "id": "up_hold$status_headers$0",
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
          "id": "up_hold$status_data$0",
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
          "id": "up_hold$status_variable$0",
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
          "id": "up_hold$status_good$0",
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
          "id": "up_hold$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID BUTTON",
          "id": "mid$type$0",
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
          "id": "mid$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$url$0",
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
          "id": "mid$headers$0",
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
          "id": "mid$data$0",
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
          "id": "mid$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$status_url$0",
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
          "id": "mid$status_headers$0",
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
          "id": "mid$status_data$0",
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
          "id": "mid$status_variable$0",
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
          "id": "mid$status_good$0",
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
          "id": "mid$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID OVERFLOW BUTTON",
          "id": "mid_hold$type$0",
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
          "id": "mid_hold$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid_hold$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid_hold$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$url$0",
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
          "id": "mid_hold$headers$0",
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
          "id": "mid_hold$data$0",
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
          "id": "mid_hold$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$status_url$0",
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
          "id": "mid_hold$status_headers$0",
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
          "id": "mid_hold$status_data$0",
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
          "id": "mid_hold$status_variable$0",
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
          "id": "mid_hold$status_good$0",
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
          "id": "mid_hold$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN BUTTON",
          "id": "down$type$0",
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
          "id": "down$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$url$0",
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
          "id": "down$headers$0",
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
          "id": "down$data$0",
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
          "id": "down$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$status_url$0",
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
          "id": "down$status_headers$0",
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
          "id": "down$status_data$0",
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
          "id": "down$status_variable$0",
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
          "id": "down$status_good$0",
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
          "id": "down$status_bad$0",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN OVERFLOW BUTTON",
          "id": "down_hold$type$0",
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
          "id": "down_hold$name$0",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down_hold$icon$0",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down_hold$method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$url$0",
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
          "id": "down_hold$headers$0",
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
          "id": "down_hold$data$0",
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
          "id": "down_hold$status_method$0",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$status_url$0",
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
          "id": "down_hold$status_headers$0",
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
          "id": "down_hold$status_data$0",
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
          "id": "down_hold$status_variable$0",
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
          "id": "down_hold$status_good$0",
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
          "id": "down_hold$status_bad$0",
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
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "tile ",
        "id": "tile$1"
      },
      {
        "type": "input",
        "id": "name$1",
        "label": "<font style='color:#ff4700;'>* </font>Name",
        "attributes": {
          "required": true,
          "maxLength": 13
        }
      },
      {
        "type": "color",
        "id": "color$1",
        "defaultValue": "0055aa",
        "label": "Color",
        "layout": "COLOR",
        "sunlight": true
      },
      {
        "type": "color",
        "id": "highlight$1",
        "defaultValue": "00aaff",
        "label": "Highlight",
        "layout": "COLOR",
        "sunlight": true
      },
      {
        "type": "select2",
        "label": "Icon",
        "id": "icon$1",
        "defaultValue": "da4b9237",
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
        "group": "tile.0"
      },
      [
        {
          "type": "select",
          "label": "UP BUTTON",
          "id": "up$type$1",
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
          "id": "up$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$url$1",
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
          "id": "up$headers$1",
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
          "id": "up$data$1",
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
          "id": "up$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$status_url$1",
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
          "id": "up$status_headers$1",
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
          "id": "up$status_data$1",
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
          "id": "up$status_variable$1",
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
          "id": "up$status_good$1",
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
          "id": "up$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "UP OVERFLOW BUTTON",
          "id": "up_hold$type$1",
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
          "id": "up_hold$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up_hold$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up_hold$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$url$1",
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
          "id": "up_hold$headers$1",
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
          "id": "up_hold$data$1",
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
          "id": "up_hold$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$status_url$1",
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
          "id": "up_hold$status_headers$1",
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
          "id": "up_hold$status_data$1",
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
          "id": "up_hold$status_variable$1",
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
          "id": "up_hold$status_good$1",
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
          "id": "up_hold$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID BUTTON",
          "id": "mid$type$1",
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
          "id": "mid$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$url$1",
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
          "id": "mid$headers$1",
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
          "id": "mid$data$1",
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
          "id": "mid$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$status_url$1",
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
          "id": "mid$status_headers$1",
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
          "id": "mid$status_data$1",
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
          "id": "mid$status_variable$1",
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
          "id": "mid$status_good$1",
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
          "id": "mid$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID OVERFLOW BUTTON",
          "id": "mid_hold$type$1",
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
          "id": "mid_hold$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid_hold$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid_hold$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$url$1",
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
          "id": "mid_hold$headers$1",
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
          "id": "mid_hold$data$1",
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
          "id": "mid_hold$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$status_url$1",
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
          "id": "mid_hold$status_headers$1",
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
          "id": "mid_hold$status_data$1",
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
          "id": "mid_hold$status_variable$1",
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
          "id": "mid_hold$status_good$1",
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
          "id": "mid_hold$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN BUTTON",
          "id": "down$type$1",
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
          "id": "down$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$url$1",
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
          "id": "down$headers$1",
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
          "id": "down$data$1",
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
          "id": "down$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$status_url$1",
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
          "id": "down$status_headers$1",
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
          "id": "down$status_data$1",
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
          "id": "down$status_variable$1",
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
          "id": "down$status_good$1",
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
          "id": "down$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN OVERFLOW BUTTON",
          "id": "down_hold$type$1",
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
          "id": "down_hold$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down_hold$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down_hold$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$url$1",
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
          "id": "down_hold$headers$1",
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
          "id": "down_hold$data$1",
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
          "id": "down_hold$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$status_url$1",
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
          "id": "down_hold$status_headers$1",
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
          "id": "down_hold$status_data$1",
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
          "id": "down_hold$status_variable$1",
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
          "id": "down_hold$status_good$1",
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
          "id": "down_hold$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "UP BUTTON",
          "id": "up$type$1",
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
          "id": "up$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$url$1",
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
          "id": "up$headers$1",
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
          "id": "up$data$1",
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
          "id": "up$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$status_url$1",
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
          "id": "up$status_headers$1",
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
          "id": "up$status_data$1",
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
          "id": "up$status_variable$1",
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
          "id": "up$status_good$1",
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
          "id": "up$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "UP OVERFLOW BUTTON",
          "id": "up_hold$type$1",
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
          "id": "up_hold$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up_hold$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up_hold$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$url$1",
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
          "id": "up_hold$headers$1",
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
          "id": "up_hold$data$1",
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
          "id": "up_hold$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$status_url$1",
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
          "id": "up_hold$status_headers$1",
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
          "id": "up_hold$status_data$1",
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
          "id": "up_hold$status_variable$1",
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
          "id": "up_hold$status_good$1",
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
          "id": "up_hold$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID BUTTON",
          "id": "mid$type$1",
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
          "id": "mid$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$url$1",
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
          "id": "mid$headers$1",
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
          "id": "mid$data$1",
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
          "id": "mid$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$status_url$1",
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
          "id": "mid$status_headers$1",
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
          "id": "mid$status_data$1",
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
          "id": "mid$status_variable$1",
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
          "id": "mid$status_good$1",
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
          "id": "mid$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID OVERFLOW BUTTON",
          "id": "mid_hold$type$1",
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
          "id": "mid_hold$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid_hold$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid_hold$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$url$1",
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
          "id": "mid_hold$headers$1",
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
          "id": "mid_hold$data$1",
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
          "id": "mid_hold$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$status_url$1",
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
          "id": "mid_hold$status_headers$1",
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
          "id": "mid_hold$status_data$1",
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
          "id": "mid_hold$status_variable$1",
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
          "id": "mid_hold$status_good$1",
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
          "id": "mid_hold$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN BUTTON",
          "id": "down$type$1",
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
          "id": "down$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$url$1",
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
          "id": "down$headers$1",
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
          "id": "down$data$1",
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
          "id": "down$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$status_url$1",
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
          "id": "down$status_headers$1",
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
          "id": "down$status_data$1",
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
          "id": "down$status_variable$1",
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
          "id": "down$status_good$1",
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
          "id": "down$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN OVERFLOW BUTTON",
          "id": "down_hold$type$1",
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
          "id": "down_hold$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down_hold$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down_hold$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$url$1",
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
          "id": "down_hold$headers$1",
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
          "id": "down_hold$data$1",
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
          "id": "down_hold$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$status_url$1",
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
          "id": "down_hold$status_headers$1",
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
          "id": "down_hold$status_data$1",
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
          "id": "down_hold$status_variable$1",
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
          "id": "down_hold$status_good$1",
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
          "id": "down_hold$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "UP BUTTON",
          "id": "up$type$1",
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
          "id": "up$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$url$1",
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
          "id": "up$headers$1",
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
          "id": "up$data$1",
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
          "id": "up$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$status_url$1",
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
          "id": "up$status_headers$1",
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
          "id": "up$status_data$1",
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
          "id": "up$status_variable$1",
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
          "id": "up$status_good$1",
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
          "id": "up$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "UP OVERFLOW BUTTON",
          "id": "up_hold$type$1",
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
          "id": "up_hold$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up_hold$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up_hold$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$url$1",
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
          "id": "up_hold$headers$1",
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
          "id": "up_hold$data$1",
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
          "id": "up_hold$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$status_url$1",
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
          "id": "up_hold$status_headers$1",
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
          "id": "up_hold$status_data$1",
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
          "id": "up_hold$status_variable$1",
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
          "id": "up_hold$status_good$1",
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
          "id": "up_hold$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID BUTTON",
          "id": "mid$type$1",
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
          "id": "mid$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$url$1",
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
          "id": "mid$headers$1",
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
          "id": "mid$data$1",
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
          "id": "mid$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$status_url$1",
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
          "id": "mid$status_headers$1",
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
          "id": "mid$status_data$1",
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
          "id": "mid$status_variable$1",
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
          "id": "mid$status_good$1",
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
          "id": "mid$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID OVERFLOW BUTTON",
          "id": "mid_hold$type$1",
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
          "id": "mid_hold$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid_hold$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid_hold$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$url$1",
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
          "id": "mid_hold$headers$1",
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
          "id": "mid_hold$data$1",
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
          "id": "mid_hold$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$status_url$1",
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
          "id": "mid_hold$status_headers$1",
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
          "id": "mid_hold$status_data$1",
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
          "id": "mid_hold$status_variable$1",
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
          "id": "mid_hold$status_good$1",
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
          "id": "mid_hold$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN BUTTON",
          "id": "down$type$1",
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
          "id": "down$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$url$1",
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
          "id": "down$headers$1",
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
          "id": "down$data$1",
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
          "id": "down$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$status_url$1",
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
          "id": "down$status_headers$1",
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
          "id": "down$status_data$1",
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
          "id": "down$status_variable$1",
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
          "id": "down$status_good$1",
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
          "id": "down$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN OVERFLOW BUTTON",
          "id": "down_hold$type$1",
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
          "id": "down_hold$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down_hold$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down_hold$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$url$1",
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
          "id": "down_hold$headers$1",
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
          "id": "down_hold$data$1",
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
          "id": "down_hold$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$status_url$1",
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
          "id": "down_hold$status_headers$1",
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
          "id": "down_hold$status_data$1",
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
          "id": "down_hold$status_variable$1",
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
          "id": "down_hold$status_good$1",
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
          "id": "down_hold$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "UP BUTTON",
          "id": "up$type$1",
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
          "id": "up$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$url$1",
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
          "id": "up$headers$1",
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
          "id": "up$data$1",
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
          "id": "up$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up$status_url$1",
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
          "id": "up$status_headers$1",
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
          "id": "up$status_data$1",
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
          "id": "up$status_variable$1",
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
          "id": "up$status_good$1",
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
          "id": "up$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "UP OVERFLOW BUTTON",
          "id": "up_hold$type$1",
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
          "id": "up_hold$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "up_hold$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "up_hold$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$url$1",
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
          "id": "up_hold$headers$1",
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
          "id": "up_hold$data$1",
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
          "id": "up_hold$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "up_hold$status_url$1",
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
          "id": "up_hold$status_headers$1",
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
          "id": "up_hold$status_data$1",
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
          "id": "up_hold$status_variable$1",
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
          "id": "up_hold$status_good$1",
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
          "id": "up_hold$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID BUTTON",
          "id": "mid$type$1",
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
          "id": "mid$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$url$1",
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
          "id": "mid$headers$1",
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
          "id": "mid$data$1",
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
          "id": "mid$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid$status_url$1",
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
          "id": "mid$status_headers$1",
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
          "id": "mid$status_data$1",
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
          "id": "mid$status_variable$1",
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
          "id": "mid$status_good$1",
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
          "id": "mid$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "MID OVERFLOW BUTTON",
          "id": "mid_hold$type$1",
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
          "id": "mid_hold$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "mid_hold$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "mid_hold$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$url$1",
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
          "id": "mid_hold$headers$1",
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
          "id": "mid_hold$data$1",
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
          "id": "mid_hold$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "mid_hold$status_url$1",
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
          "id": "mid_hold$status_headers$1",
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
          "id": "mid_hold$status_data$1",
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
          "id": "mid_hold$status_variable$1",
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
          "id": "mid_hold$status_good$1",
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
          "id": "mid_hold$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN BUTTON",
          "id": "down$type$1",
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
          "id": "down$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$url$1",
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
          "id": "down$headers$1",
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
          "id": "down$data$1",
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
          "id": "down$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down$status_url$1",
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
          "id": "down$status_headers$1",
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
          "id": "down$status_data$1",
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
          "id": "down$status_variable$1",
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
          "id": "down$status_good$1",
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
          "id": "down$status_bad$1",
          "label": "Status <font style='color:red;'>bad value</font>",
          "group": "tile.0",
          "attributes": {
            "autocapitalize": "off",
            "autocorrect": "off",
            "autocomplete": "off",
            "spellcheck": "false"
          }
        }
      ],
      [
        {
          "type": "select",
          "label": "DOWN OVERFLOW BUTTON",
          "id": "down_hold$type$1",
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
          "id": "down_hold$name$1",
          "label": "Name",
          "group": "tile.0"
        },
        {
          "type": "select2",
          "label": "Icon",
          "id": "down_hold$icon$1",
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
          "group": "tile.0"
        },
        {
          "type": "select",
          "id": "down_hold$method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$url$1",
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
          "id": "down_hold$headers$1",
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
          "id": "down_hold$data$1",
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
          "id": "down_hold$status_method$1",
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
          "group": "tile.0"
        },
        {
          "type": "input",
          "id": "down_hold$status_url$1",
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
          "id": "down_hold$status_headers$1",
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
          "id": "down_hold$status_data$1",
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
          "id": "down_hold$status_variable$1",
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
          "id": "down_hold$status_good$1",
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
          "id": "down_hold$status_bad$1",
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
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "button",
        "id": "AddTile",
        "defaultValue": "Add Tile",
        "primary": true,
        "group": "submits"
      },
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

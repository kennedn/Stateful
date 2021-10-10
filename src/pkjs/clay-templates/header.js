module.exports = [
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
] 

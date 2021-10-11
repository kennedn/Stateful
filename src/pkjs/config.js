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

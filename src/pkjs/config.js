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
        "defaultValue": "API Login"
      },
      {
        "type": "text",
        "defaultValue": "Use this section to define a username and password that will be POSTed to the login URL to obtain a token. All values must be defined to be used."
      },
      {
        "type": "input",
        "label": "API Username",
        "id": "api_username"
      },
      {
        "type": "input",
        "label": "API Password",
        "id": "api_password",
        "attributes": {
          "type": "password"
        }
      },
      {
        "type": "input",
        "label": "Login URL",
        "description": "After base_url, without leading slash",
        "id": "login_url"
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

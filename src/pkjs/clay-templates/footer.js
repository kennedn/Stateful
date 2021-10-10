module.exports = [
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
      },

    ]
  }
]
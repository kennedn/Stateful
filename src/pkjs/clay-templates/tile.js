module.exports = [
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "tile ",
        "id": "tile$$$index$$$"
      },
      {
        "type": "input",
        "id": "name$$$index$$$",
        "label": "<font style='color:#ff4700;'>* </font>Name",
        "attributes": {
          "required": true,
          "maxLength": 13,
        },
      },
      {
        "type": "color",
        "id": "color$$$index$$$",
        "defaultValue": "0055aa",
        "label": "Color",
        "layout": "COLOR",
        "sunlight": true,
      },
      {
        "type": "color",
        "id": "highlight$$$index$$$",
        "defaultValue": "00aaff",
        "label": "Highlight",
        "layout": "COLOR",
        "sunlight": true,
      },
      {
        "type": "select2",
        "label": "Icon",
        "id": "icon$$$index$$$",
        "defaultValue": "da4b9237",
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
    ]
  }
]
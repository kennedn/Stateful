# Table of Contents

- [Table of Contents](#table-of-contents)
- [About Stateful](#about-stateful)
- [Interface](#interface)
- [JSON Structure](#json-structure)
- [Global Settings](#global-settings)
  - [Authentication](#authentication)
- [Tiles](#tiles)
  - [Payload](#payload)
  - [Buttons](#buttons)
    - [Local Type](#local-type)
    - [Stateful Type](#stateful-type)
    - [Status-Only Type](#status-only-type)
    - [Disabled Type](#disabled-type)
  - [Icon Keys](#icon-keys)
- [Example JSON](#example-json)
  

# About Stateful

`Stateful` is a pebble watchapp designed to control RESTful API's with minimal clicks. 

![](resources/images/example1.png)
![](resources/images/example2.png)
![](resources/images/example3.png)
![](resources/images/example4.png)

# Interface

The watch interface is split up into distinct 'tiles'. A tile in `stateful` is a grouping of up to 6 button clicks, each of which can call a RESTful endpoint with arbitrary data.

Each tile has an overflow menu that can be accessed by long pressing the middle button.

Multiple tiles can coexist. There is a menu system which allows navigation between tiles:

![](resources/images/menuing.gif)

# JSON Structure

Currently due to limitations in how clay config works, I have opted to directly parse JSON provided via clay config in lieu of a user friendly configuration interface. This will likely change in the future, but for the moment in order to use stateful an understanding of the JSON structure is a pre-requisite. 

![](resources/images/clay.png)

# Global Settings

`Global Settings` are top level keys that affect every tile or the system in general.

```json
{
  "default_idx": 0, 
  "open_default": false,
  "keep_alive": false,
  "base_url": "",
  "headers": {},
  "tiles": [],
  "authentication": {...}
}
```

|Key          |Expected type|Description|
|-------------|-------------|-----------|
|default_idx  |`number`     |Configures which menu item is initially selected when the app is started|
|open_default |`boolean`    |Automatically enters the selected menu item when the app starts|
|keep_alive   |`boolean`    |Sends a 'keep-alive' XHR GET request every 5 seconds to `base_url` with `headers`.<br>This is to work around battery optimizations on android which limit connectivity when the screen is off.
|base_url     |`string`     |Prepended to all tile urls if specified|
|headers      |`Object`     |Will set XHR headers for every request if specified|
|tiles        |`Objects[]`  |An array of tile objects, see [Tiles](#tiles)|

Example:

```json
{
  "default_idx": 0, 
  "open_default": true,
  "keep_alive": true,
  "base_url": "https://cool.api/api/v1.0/",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Basic Tm9zZXkgb25lIGFyZW50IHlvdSA6KQ=="
  },
  "tiles": [
    {...}
  ]
}
```

## Authentication

The authentication key is an optional key in the global section of the config that allows you to configure a login endpoint for storing a token to interact with the rest of your endpoints. At minimum, `method`, `url` and `data` are required in order for authentication to be used in the application.


```json
 "authentication": {
    "method": "",
    "url": "",
    "data": {},
    "headers": {},
    "variable": "",
    "prefix": ""
  }
```

|Key          |Expected type|Description|
|-------------|-------------|-----------|
|method       |`string`     |XHR Method to use for authentication endpoint. |
|url          |`string`     |Partial or full url, see `base_url` in [global settings](#global-settings)|
|data         |`Object`     |Data object to send to the endpoint. (Such as credentials) |
|headers      |`Object`     |Optional headers to send alongside data, overidden by `headers` in [global settings](#global-settings)|
|prefix       |`string`     |The prefix before the token in the header, defaults to `"Bearer "`|
|variable     |`string`     |A variable to extract from the return data, use dot notation to traverse a nested object. Defaults to `"access_token"`. |

Example: 
```json
 "authentication": {
    "method": "POST",
    "url": "login",
    "data": {"username": "user", "password": "password123"},
    "headers": {"Content-Type": "application/json"},
    "variable": "access_token",
    "prefix": "Bearer "
  }
```


# Tiles

A tile object defiles one tile entry within stateful. It is split into two parts, [payload](#payload) and [buttons](#buttons):

```json
{
  "payload": {},
  "buttons": {}
}
```

## Payload

The payload object contains all tile specific items. These values are packed and sent down to the watch app:

```json
{
  "color": "",
  "highlight": "",
  "texts": [],
  "icon_keys": []
}
```

|Key          |Expected type|Description|
|-------------|-------------|-----------|
|color        |`hex-string` |A 6 digit hex string, defines the main color for the tile / menu item|
|highlight    |`boolean`    |A 6 digit hex string, defines the highlight color for the tile / menu item|
|texts        |`string[]`   |An array of 7 strings representing 6 button clicks and 1 menu title:<br>up, up_hold, mid, mid_hold, down, down_hold, title|
|icon_keys    |`string[]`   |An array of 7 strings representing 6 icon_keys for each button and 1 menu icon_key:<br>up, up_hold, mid, mid_hold, down, down_hold, title<br>See [Icon Keys](#icon-keys)|

**Note: texts & icon_keys must always have 7 values, any buttons that are disabled should specify an empty string, as shown in the below example.**

Example:

```json
{
  "color": "#0055aa",
  "highlight": "#00aaff",
  "texts": [
    "office",
    "attic",
    "bedroom",
    "hall down",
    "hall up",
    "",
    "lights"
  ],
  "icon_keys": [
    "77de68da",
    "77de68da",
    "77de68da",
    "77de68da",
    "77de68da",
    "",
    "77de68da"
  ]
}
```

## Buttons

```json
"buttons": {
  "up": {...},
  "up_hold": {...},
  "mid": {...},
  "mid_hold": {...},
  "down": {...},
  "down_hold": {...}
}
```

The `buttons` object consists of 6 buttons. Each of these specifies the values required to call a REST endpoint for a specific click. 

`up`, `mid` and `down` are accessible immediatly after entering a given tile, `up_hold`, `mid_hold` and `down_hold` are 'swapped in' when `mid` is held for 500ms, this can be done any number of times to toggle between the two sets.

There are four types of button:


|Button Type  |Value        |Description|
|-------------|-------------|-----------|
|[Local](#local-type)        |0            |Send a simple XHR request and optionally maintain a local tracker|
|[Stateful](#stateful-type)     |1            |Send an XHR request and derive a status afterwards from an additional XHR request|
|[Status Only](#status-only-type)  |2            |Directly derive a status from an initial XHR request |
|[Disabled](#disabled-type)     |3            |Disables the buttons functionality|

**Note: Six button objects should exist for each tile, if a button is not to be used, the type should be specified as `3` (Disabled).**

### Local Type
```json
"up": {
  "type": 0,
  "method": "",
  "url": "",
  "headers": {},
  "data": []/{},
},
```
Local buttons are specifically for endpoints that cannot provide a status or where it does not make sense to request a status. Some examples may be turning the volume up on a tv or triggering an infrared bulb that cannot describe what state it is in.

|Key          |Expected type|Description|
|-------------|-------------|-----------|
|type         |`number`     |Button Type|
|method       |`string`     |XHR Method |
|url          |`string`     |Partial or full url, see `base_url` in [global settings](#global-settings)|
|headers      |`Object`     |Optional headers to send alongside data, overidden by `headers` in [global settings](#global-settings)|
|data        |`Objects[]` or `Object`  |One or more data object to send to the endpoint|

<br>The buttons behaviour will change based on the number of elements provided in the `data` key:

| Number | Side Effects |
|------  |-----------|
|1       | None, simply calls an XHR request|
|2       | Each click will additionally increment to the next data field,<br>when index 0 fires, a <font style='color:#00AA00;'>green</font> background will display on watch,<br>when index 1 fires, a <font style='color:#FF0055'>red</font> background will display on watch|
|3+      |Each click will additionally increment to the next data field|

Examples:

```json
"up": {
  "type": 0,
  "method": "PUT",
  "url": "tvcom/ir_key",
  "data": {"code": "vol_up"} // 1 data item
},
"up_hold": {
  "type": 0,
  "method": "PUT",
  "url": "bulb",
  "data": [
    {"code": "on"},  // 2 data items
    {"code": "off"}
  ]
},
"mid": {
  "type": 0,
  "method": "PUT",
  "url": "tvcom/input_select",
  "data": [
    {"code": "hdmi_1"},  // 3 data items
    {"code": "hdmi_2"},
    {"code": "hdmi_3"}
  ]
},

```
### Stateful Type
```json
"down": {
  "type": 1,
  "method": "",
  "url": "",
  "headers": {},
  "data": {}/[],
  "status": {
    "method": "",
    "url": "",
    "data": {},
    "variable": "",
    "good": ,
    "bad": 
  }
},
```
Stateful buttons are for endpoints that provide a status, so their current state can be derived. Some examples are a wifi bulb or a televisions power state.

The buttons behaviour will change based on the number of elements provided in the `data` key:

| Number | Side Effects |
|------  |-----------|
|1       | None, simply call an XHR request and then call an additional status XHR request|
|2       | Each click will additionally increment to the next data field |


|Key          |Expected type|Description|
|-------------|-------------|-----------|
|type         |`number`     |Button Type|
|method       |`string`     |XHR Method |
|url          |`string`     |Partial or full url, see `base_url` in [global settings](#global-settings)|
|headers      |`Object`     |Optional headers to send alongside data, overidden by `headers` in [global settings](#global-settings)|
|data        |`Objects[]` or `Object`  |One or more data object to send to the endpoint|
|status.method       |`string`     |XHR status method |
|status.url          |`string`     |Partial or full status url, see `base_url` in [global settings](#global-settings)|
|status.data        |`Object`  |A single object to send to the endpoint|
|status.variable  | `string` |A variable to extract from the return data, use dot notation to descend into a nested object|
|status.good | `var` | If this matches the extracted `status.variable`, display green background on watch<br>**Be conscious of type**|
|status.bad | `var` | If this matches the extracted `status.variable`, display red background on watch<br>**Be conscious of type**|


Examples:

```json
"mid": {
  "type": 1,
  "method": "PUT",
  "url": "wifi_bulb/bedroom",
  "data": {"code": "toggle"},  // 1 data item
  "status": {
    "method": "PUT",
    "url": "wifi_bulb/bedroom",
    "data": {"code": "status"},
    "variable": "onoff",
    "good": 1,
    "bad": 0
  }
},
"mid_hold": {
  "type": 1,
  "method": "PUT",
  "url": "tvcom/power",
  "data": [
    {"code": "on"},  // 2 data items
    {"code": "off"}
  ],
  "status": {
    "method": "PUT",
    "url": "tvcom/power",
    "data": {"code": "status"},
    "variable": "status.power_state",
    "good": "on",
    "bad": "off"
  }
},

```

### Status-Only Type
```json
"mid": {
  "type": 2,
  "method": "",
  "url": "",
  "headers": {}
  "data": {},
  "variable": "",
  "good": ,
  "bad": 
},
```
Status only buttons are similar to stateful buttons, but they are intended for situations where you do not want to change anything but simply want to understand what state something is in. An Example may be if a computer is on or off.

|Key          |Expected type|Description|
|-------------|-------------|-----------|
|type         |`number`     |Button Type|
|method       |`string`     |XHR Method |
|url          |`string`     |Partial or full url, see `base_url` in [global settings](#global-settings)|
|headers      |`Object`     |Optional Headers to send alongside data, overidden by `headers` in [global settings](#global-settings)|
|data        |`Object`  |A single data object to send to the endpoint|
|variable  | `string` |A variable to extract from the return data, use dot notation to traverse a nested object|
|good | `var` | If this matches the extracted `status.variable`, display <font style='color:#00AA00;'>green</font> background on watch<br>**Be consious of type**|
|bad | `var` | If this matches the extracted `status.variable`, display <font style='color:#FF0055'>red</font> background on watch<br>**Be consious of type**|

Example:

```json
"mid": {
  "type": 2,
  "method": "PUT",
  "url": "pc",
  "data": {"code": "status"},
  "variable": "status",
  "good": "on",
  "bad": "off"
},
```

### Disabled Type
```
"down": {
  "type": 3
},
```

Button not in use, specify type `3` and ensure payload texts / icon_keys have empty string values.

## Icon Keys

The icon key front-end system is currently hard coded with only the following valid values:

|Key          |Icon         |
|-------------|-------------|
|356a192b     |![](resources/icons/default.png)|
|da4b9237     |![](resources/icons/tv.png)|
|77de68da     |![](resources/icons/bulb.png)|
|1b645389     |![](resources/icons/monitor.png)|
|ac3478d6     |![](resources/icons/test.png)|

The back-end system does support custom base64 encoded images but there is currently no way to provide this via the front door.

# Example JSON

Fully constructed JSON objects can be pasted directly into clay config to parse. Example:

```json
{
  "default_idx": 0, 
  "open_default": true,
  "keep_alive": true,
  "base_url": "https://cool.api/api/v1.0/",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Basic Tm9zZXkgb25lIGFyZW50IHlvdSA6KQ=="
  },
  "tiles": [
     {
      "payload": {
        "color": "#0055aa",
        "highlight": "#00aaff",
        "texts": [
          "office",
          "attic",
          "bedroom",
          "hall down",
          "hall up",
          "",
          "lights"
        ],
        "icon_keys": [
          "77de68da",
          "77de68da",
          "77de68da",
          "77de68da",
          "77de68da",
          "",
          "77de68da"
        ]
      },
      "buttons": {
        "up": {
          "type": 1,
          "method": "PUT",
          "url": "wifi_bulb/office",
          "headers": "",
          "data": {"code": "toggle"},
          "status": {
            "method": "PUT",
            "url": "wifi_bulb/office",
            "headers": "",
            "data": {"code": "status"},
            "variable": "onoff",
            "good": 1,
            "bad": 0
          }
        },
        "up_hold": {
          "type": 1,
          "method": "PUT",
          "url": "wifi_bulb/attic",
          "data": {"code": "toggle"},
          "status": {
            "method": "PUT",
            "url": "wifi_bulb/attic",
            "data": {"code": "status"},
            "variable": "onoff",
            "good": 1,
            "bad": 0
          }
        },
        "mid": {
          "type": 1,
          "method": "PUT",
          "url": "wifi_bulb/bedroom",
          "data": {"code": "toggle"},
          "status": {
            "method": "PUT",
            "url": "wifi_bulb/bedroom",
            "data": {"code": "status"},
            "variable": "onoff",
            "good": 1,
            "bad": 0
          }
        },
        "mid_hold": {
          "type": 1,
          "method": "PUT",
          "url": "wifi_bulb/hall_down",
          "data": {"code": "toggle"},
          "status": {
            "method": "PUT",
            "url": "wifi_bulb/hall_down",
            "data": {"code": "status"},
            "variable": "onoff",
            "good": 1,
            "bad": 0
          }
        },
        "down": {
          "type": 1,
          "method": "PUT",
          "url": "wifi_bulb/hall_up",
          "data": {"code": "toggle"},
          "status": {
            "method": "PUT",
            "url": "wifi_bulb/hall_up",
            "data": {"code": "status"},
            "variable": "onoff",
            "good": 1,
            "bad": 0
          }
        },
        "down_hold": {
          "type": 3
        }
      }
    },
    {
      "payload": {
        "color": "#550055",
        "highlight": "#5500aa",
        "texts": [
          "bulb",
          "vol up",
          "lamp",
          "input",
          "tv",
          "vol down",
          "livingroom"
        ],
        "icon_keys": [
          "77de68da",
          "da4b9237",
          "77de68da",
          "da4b9237",
          "da4b9237",
          "da4b9237",
          "da4b9237"
        ]
      },
      "buttons": {
        "up": {
          "type": 0,
          "method": "PUT",
          "url": "bulb",
          "data": [
            {"code": "on"},
            {"code": "off"}
          ]
        },
        "up_hold": {
          "type": 0,
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "vol_up"}
        },
        "mid": {
          "type": 0,
          "method": "PUT",
          "url": "lamp",
          "data": [
            {"code": "on"},
            {"code": "off"}
          ]
        },
        "mid_hold": {
          "type": 0,
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "input"}
        },
        "down": {
          "type": 1,
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "power"},
          "status": {
            "method": "PUT",
            "url": "tvcom/power",
            "data": {"code": "status"},
            "variable": "status",
            "good": "on",
            "bad": "off"
          }
        },
        "down_hold": {
          "type": 0,
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "vol_down"}
        }
      }
    },
    {
      "payload": {
        "color": "#000000",
        "highlight": "#aaaaaa",
        "texts": [
          "pc",
          "shitcube",
          "pc status",
          "shitcube status",
          "",
          "",
          "computers"
        ],
        "icon_keys": [
          "1b645389",
          "1b645389",
          "1b645389",
          "1b645389",
          "",
          "",
          "1b645389"
        ]
      },
      "buttons": {
        "up": {
          "type": 0,
          "method": "PUT",
          "url": "pc",
          "data": {"code": "power"}
        },
        "up_hold": {
          "type": 0,
          "method": "PUT",
          "url": "shitcube",
          "data": {"code": "power"}
        },
        "mid": {
          "type": 2,
          "method": "PUT",
          "url": "pc",
          "data": {"code": "status"},
          "variable": "status",
          "good": "on",
          "bad": "off"
        },
        "mid_hold": {
          "type": 2,
          "method": "PUT",
          "url": "shitcube",
          "data": {"code": "status"},
          "variable": "status",
          "good": "on",
          "bad": "off"
        },
        "down": {
          "type": 3
        },
        "down_hold": {
          "type": 3
        }
      }
    }
  ]
}
```

Which produces the following in the watch app:

![](resources/images/full_json.gif)
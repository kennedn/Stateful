var Buffer = require('buffer/').Buffer;
var headers = require('../../headers.json');
var DEBUG = 0;
//var IMG_URL = 'https://i.imgur.com/gzLWQXf.png'; //bulb
//var IMG_URL = 'https://i.imgur.com/tQOn2aw.png'; //tv
//var IMG_URL = 'http://pc.int:8080/tv.png';
var IMG_URL = 'https://kennedn.com/images/deleted.png'
var MAX_CHUNK_SIZE = 7800;  // Needs to be slightly smaller than app_message_inbox_size_maximum()

// Called when the message send attempt succeeds
function messageSuccessCallback() {
  if (DEBUG > 1) console.log("Message send succeeded.");  
}

// Called when the message send attempt fails
function messageFailureCallback() {
  if (DEBUG > 1) console.log("Message send failed.");
}

//todo find out how uploaded icons and pre-packaged differ on c side
// Fade status color back to default?
const Icons = {
  "ICON_DEFAULT": 0,
  "ICON_TV": 1,
  "ICON_BULB": 2,
  "ICON_MONITOR": 3,
  "ICON_TEST": 4
}
const text_size = 12
const TransferType = {
  "ICON": 0,
  "TILE": 1,
  "XHR": 2,
  "COLOR": 3,
  "ERROR": 4,
  "ACK": 5,
  "READY": 6
};
const Color = {
  "GOOD": 0,
  "BAD": 1,
  "ERROR": 2,
};
const Button = {
  "0": "up",
  "1": "up_hold",
  "2": "mid",
  "3": "mid_hold",
  "4": "down",
  "5": "down_hold"
};

const XHRType = {
  "NORMAL": 0,
  "CALLBACK": 1
};
// let icons = [
//   /* default */ 1,
//   /* tv */"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",
//   /*bulb*/ "iVBORw0KGgoAAAANSUhEUgAAABIAAAASAgMAAAAroGbEAAAPonpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjatZppltswroX/cxW9BM7Dcjie83bwlt8fSMnlmlJVqXScWI4kgyAuhgvIav7//y31H/4En63yIeVYYtT88cUXW/mQ9flT9rvRfr+f/9jrmnl9Xj0uWE45ju78N9Xr/sr58PKFew3TXp9X+bpi8yXounALdLKyLDaeleS8PeeNvwSVeT7EktOzqu3StF83blWuf+tWK52D/F89n/AJK43AQs7a6YzT+z0fDZz8M65yLLzzWe7jVZ13SXFw7tYEg7za3n3U+tlAr4x8f1Jvrf/49Mb4tl7n3RtbxstGfPjwggkfG3+b+Glh99DIvrngbhw+MPIaea15dld9xKLx8qhtbHOL4caGyd3+WuSV+Bf4nPar8Mq66s5SQ3fdeHVTjAWVpYw3w1SzzNzHbjoqejtt4mhtBxw5l12yxXYQM2DEyyybQG+4DG7dTiWYOfvQxex1y16vm8zKw3CrNQgzG+xPXupPF3/yUmt1MZHR+WEr9LLi16ghyMk7dwGBWRduYRv4fl3w6yf/wVVBMGwzZzZYdTsiWjAvvuU2zo77AseDsVFpXAIwEWsHlDF4gNHRuGCi0cnaZAx2zABU0dw6bxsImBDsQEnrnYtWJZutrM13ktn32mCjldPkJoAILroENsQXYHkf8J/kMz5Ugws+hBBDClmFEmp00ccQY0xRklxNLvkUUkwp5VRSzS77HHLMKedcci22OHJgKLGkkksptVpVWagiq3J/5UyzzTXfQosttdxKqx336b6HHnvquZdehx1ukCZGHGnkUUadRk0yxfQzzDjTzLPMuvC15ZZfYcWVVl5l1QdqF6rvXj9AzVyo2Y2U3JceqHFWpXSLMJJOgmAGYtYbEE+CAA5tBTOdjfdWkBPMdLEERbAoGQQbNYwgBoR+GhuWeWD3gty3cFMhfws3+xVySqD7F8gpoHuP2weoDalzfSN2olBsqh3Rxz3VZsU/rXl7d5xmLm6bVt4zWagPH2fsLBLGsnPWEaVKR7+a9VOl2NivydHbqKfObiAJ6/aU1rJ+saMmoqKuTRQzbGcRk2n4NW1fuZF7/fBqddPqFJPP1mYMsuuyktHdlkVW7mw45oG1e/Fdd1CvI/UmmT2Y0MisbekWVXPYCKV9IxvOvuZIKZjuo+iMnzhJvdq4QupNIZpVBtdFR119m5aPQ7ex1CquxSUXepJNISrX5fW2TBDP4uPMAYP1MlradgP4tFDZrpz3GU+GTAvIxrbDMh1sQKzaNkBkGl9S906uVZP2PTbFse/Ncyt2q6WEZrR96ajGLW9VeyiGLls1tD/KPammtm7evijGbZ8qdtQ6SsnW54u11Iu5/tJaobeVi1Pdjoo3EFkmz+447XCwMHwhwEtwuGEh9j0EawZdzAj4T/Da5O35x1nZDUQL78SpOtkAtastEevpumph82kZbKBLjYla6x1VuuMfvbXawnBzTFOKmx2NJE82U3M0FFhC3OrlxUKBYGk5Nf3w3RUMUaybE0kdSbWQvXLYcrIafZICgyEtkIcsW6xzfhZ/nx2JcoVLrUV5B5uwd5yBxBf2ahcGLSPmltyMhP/qtRNDI8UpqW4l50pfaeuvVUXSiVCcLeBEEqORIKpyBoIywjxOoYfbSwUrJCnIfS0Q/5iYXaod2UNcPbgRWi+4yWTVZEdfJbSWYh9zkuRmgoXlPnkjYk1ZPpBOMwkxrThka4lUY1OftwjUSQUJR4ThCN0QEYlkHuZxRo29t36O3czgFHtqcUi+SZPV8NsgW+asDphKoozKjjek2fjqNORac/w6IMGaltnIapQjlphg5UQPfMwvKEJJPg5KKNdG79GZMdvwfwJPPU4svGjFTAAUm1NNwjwpC8fkzZLi3Qpzm9sYPOsEk+3kDD3aVJU1W1tRLxuHiaP1Sohgo9Jdw8KYLqxJnBNBAxsvm0mMc4tZx1DbTAo7begx1IWkgGDTgXFj4BpBKDAeDOJE1xk2Bpi/R96ch/lXQwScDU2zvafpivsR6SOgHlaeRrJWwGu7ZycTIoNQNxMlLRIIrSxlWWKMRTl3kXDR4iYsomM7WRPZEtP1ZJ5ey9Y/VvHnqk94rJyMusID9NnYdHdwaBakeDyCgzXg4Ts4+GJaEhyx4idVWr1dIK8PHx0pTxoxDo08BtheBSw1b1P72FugIFOc8CzVPCanZMHh185K5uTmUaJkSYo46WSSSjRf0LAYso4jwIeFiOCMkEyYxFwqdvhOLia6UslnpgzpPmltyDEEXqCXM9OWjQcF4kbkwmMvuRFRUxwHy2QdZB3TQmnkUzvYP8W9JqhJziDDyjZm2AoECDYhNRRkLJQkpFqDkvY28PcHRykDKR+Kge1I/QQdyb8l/J5Qq43IAs1GEE5tEkEZyGuRrPNsjDitf22L3LCFemWMZfEXkAiyyiXMRzEw4V+RX03tzS/IHaSPzUFoBi2A7VlB57TLmZ4MYghhI7lKURsSwcncBq6UUYlhL8SmmbAjeLmn1KM+yT3fyfqv8oX6LGHs5YYZdy7360RhoNhjUfAU0rEEeSl8VJHNyk5aF1YWNitrFyvbJU1WTOUR0CHsgK4iauY7DNSn8fHFcaLIVXs2P1RSfA49lI09CCKquHZMjTIwCLFjGElUiVLCXiFybPQCyLbRO0iOjYK+bVS2jd5ior4DyuUCeyMXLu9QUeMUoK3PukDZbvAWltsagsuFyjbGhYu6gbmscSJ7AyOYvIHmD0f1LWj+SNwPLmo9YDk+8hkwX4WK+qJMfztU1Fe19buhoh6g/DJU/jpE3uKh7lj5baioO1Z+GyrqJ/nrT6GinmD5Vaiot8D8baioH0Hzh1BRD2B+GSrqbVn521BR36WhX4WKukGBJnQn0wIEQuDpyWWOsfasYMQRraeB2rMCnaJoYujMa/QTMjBik5y9TRDd3ZylRKeWKcyP5gw+1Sos+9GcoWnPw9rTmxXe/FJeWrwpvd6ig96USzgVuwvw3MPM6hBI9sRAGMmHR/XxBRk13AML14Zz9Fcv84ow2DiE4jGvyHoqeFIx18CidK1lYCHd4kcc6IkCyfzEPg1hJiQC9lgfUxhnR5zVPqYw2iXr9DWEwbwGEk+HevxU+oVRunT6VRlUvDy1gDhUNbxQ1ebyGRfAVb3bXNWKo44MKyvrOQbUV/lrwyDus2Ew9kR+iLMdINoO0wDz7ykL390WoUkwtOvYIyZsWfhMA5bhZnQQMG5IXCumetw96bCss1inCe/1Cp5Hzyg479a2xljg+3S+RSSlSIduHA7qthzXQNWwuNDEhC/OErqjb0yqfaNznD6vDNe2hZDp1sGKpZscCYDwT5hkLGpCNdsq9I0x9C5e6mQoSuQnqOmS5JEDVpChy8SVj/FBTmY1SXZFqxySUzQ0eZmWMrEQnTQqs2sgmgNPC6PQSs2Jy0GL0Zw2albafTxyiCPUT5saOq9l3Mp0kvR7euJL2zmWeAkLtRDPOGolZ32RHpOecPSgpDubATuI8YcEh/jPc6eD955eZ3c6TQKQHj6u7rpMlPLOnFWdQpPp97Nnc20ZzxemnTgCxJ9vp8QmWwsZP/VE2+o15UVseEIfOXi4jzR+RcArbZjtB1jz8oMyi4xPnz3K2Ff+lPWTO6m9pby+bKPYPDppGSqJp9PW4gQDI9I8e7uskvSXgqbXlfa6hb4TYKcAZfxvSgYUeGZN/3PGNiRPF1UW7fw0kxyEQzsZ10h8+RbHjHOM0RxGCmPkvic19PnyRHbnzu7cCWI/xh77FE90z7GjT/o7KVud6pDdmTfIswPS+qLZXzI+aKuTKEOLNHeEyAzRkUYQ0Jw0+a3gUnwiVAXI0/Vfwx3npBQ2wgabVmn425SyVSRxEuebH7UkN1W2LA8gPuo8pf/e4yyClbLQtv7mRR6bq0rGDFH8vh0daPPvHZogcUEHPPUZvcpohhTR4/NkZqIDDba6RzPWuvejmRnO1PLMLN+MLKVY46d9hwyosckaZWxaz8g34ohJZiq+75kKZ0qBLZRxZioURqzskkC6aIstWYGCq878zcrYwf+GmKrnE8tcVmp7IwKGuKAJu5aQlIWVOb3J5Z0hJA3LVSVVb6eIKkPaKIlqvQb2Da6pHx4ivti3lDgv+GV0kPXHtegC9wNsH1KFc/qhUK/XcbKgjBL9HtKIjLLuMsoupYqyx7K34eWB0WOPol2mO9rb3GXUtl1Ga66b6/3M5OrrG78HgfoYg59DoLo1VNfWao+Z5bCEn0T5iGYmaFyXuT1pPpDMZVIYixyE9gTIzXl0QGbPXe2yR8iLItGdmaSRmT6hMc6oSEb2aTotNaMSasBuct8AQV0uYUqk/Qth6lbtj8JuJ/Tj9pbtK3KGqN3zRwUWUuMGBLTiflP3GA+lq80JnUspZLJjr5LTBk4p+bL0JdynNXmwGGXIqqize+KqZ5m7WXCznYnja2/cgG9O98obH5xO/RNv/Ab1I72vvFrFJ4I80TGxy1MKGPOcE/IUhodF0H8oHCaWkO0qQTgyrid+ko089WMHVfCCLh28ZEIneCV/8PKHyQdhbN2LATKEeAMX/AEO0j4EOuP890Qpnf6NKCVq/QtR6uzw96LUbawvRe2BKRlv2CS/hWhdS2ivWuVpbIpUkRYr/UaFdsBuvO/kz5rpPeTnOlM4FBlA4svX7z0X+bujOLYhFj1dtiHkTochpFWIGqWywRyhGaQyY2ijG2U4uSZ5rU0HJSO8zfWMC/qmd/TDBWhRCK+0H2zS6IVdG+b1GOyFOcg5Nql3wqy7VJOA+1YD1PQQu861H6B23J1aLz23PqWIju0IbtezWrYijfmJoIc4deT9Xpx6Vu+9uNakZ+a/25RWixOTxYVokFu4WNKMiQpglMGGizS/nxos6TLFSFB3cx42r3Z4Yr/qy67PbTe1Up4fGKpfgf+pIOkuppU24/TOJFkc4ORvJ232GWPAzJYMKKYwU1QG00CqdXjFgt2780Awxg16pfPZfZB8adBHno2wofThfeq+caMk186VfRq03kiQ5/wf3pXVb7R43Id3KHhk2ibJ9JOU8t34CZ3W+8Hx/qKYI8Q+Hut36CSXvTzF/9+i9i62Z8IolaLtW49hmi6PvmuL8nud2WRa1gztXZE2y+Kp+wF4gtX2VKKnF6I7nH6cmdrSrZ14llDp7vR14fr9RJxZOmB5LhJSC0PY4YkqcuRs8jMG6uT+QYS0r/cvNfL1AKNev9SQR+00BywE/CTXJr2QMTRakkjjiDJOg0oIS6erom/PgTI4chg5WcIjT4/3SkpZ+2cT2aqwtk50k+iUL53Ktk9bP7D5q1/7iG+Pgpf+F4ZiqFR3FjhRAAABhWlDQ1BJQ0MgcHJvZmlsZQAAeJx9kT1Iw0AYht+mSlUqDlYUcchQnayIijhqFYpQIdQKrTqYXH+hSUOS4uIouBYc/FmsOrg46+rgKgiCPyBubk6KLlLid0mhRYx3HPfw3ve+3H0HCLUSU822cUDVLCMRi4qp9KoYeEUn+mj2Y0xmpj4nSXF4jq97+Ph+F+FZ3nV/ju5M1mSATySeZbphEW8QT29aOud94hAryBnic+JRgy5I/Mh1xeU3znmHBZ4ZMpKJeeIQsZhvYaWFWcFQiaeIwxlVo3wh5XKG8xZntVRhjXvyFwaz2soy12kNIYZFLEGCCAUVFFGChQjtGikmEnQe9fAPOn6JXAq5imDkWEAZKmTHD/4Hv3tr5iYn3KRgFGh/se2PYSCwC9Srtv19bNv1E8D/DFxpTX+5Bsx8kl5tauEjoGcbuLhuasoecLkDDDzpsiE7kp+WkMsB72f0TWmg9xboWnP71jjH6QOQpF7Fb4CDQ2AkT9nrHu/uaO3bvzWN/v0AmIZytlZoAPEAAAAJUExURQAAAP///wAAAHPGg3EAAAABdFJOUwBA5thmAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB+UJFRUvJaN/aPwAAAA5SURBVAjXY2DQWtXAwMCwNHQBAwPT1NAMIBkaGoGHBKuBqGfQDAPp5QxjgJNcqxjggGkFgs0AVA4AJqsQAHvN45QAAAAASUVORK5CYII=",
//   /*test */ 4,
//   /* monitor */ "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",
//   /* monitor */ 3
// ];

let icons = {
  "356a192b7913b04c54574d18c28d46e6395428ab": 1,
  "b1e988088881baf2c4792017aceea0f7bf6be1b2": "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": "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",
  "1b6453892473a467d07372d45eb05abc2031647a": 4,
  "84d30b572200d1bfa828f4a24cb0ed840e16ad4f": "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",
  "77de68daecd823babbb58edb1c8e14d7106e83bb": 3
}

// let tmp_icons = {}
// for (icon of icons) {
//   let digest = SHA1(icon.toString())
//   tmp_icons[digest] = icon;
// }

// icons = tmp_icons;

let tiles = {
  "default_idx": 0, 
  "open_default": false,
  "tiles": [
     {
      "headers": headers,
      "payload": {
        "id": 1,
        "color": "0055aa",
        "highlight": "00aaff",
        "texts": [
          "office",
          "attic",
          "bedroom",
          "tv",
          "hall up",
          "hall down",
          "lights"
        ],
        "icon_keys": [
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "84d30b572200d1bfa828f4a24cb0ed840e16ad4f",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
        ]
      },
      "buttons": {
        "base_url": "https://kennedn.com/api/v1.0/",
        "up": {
          "method": "PUT",
          "url": "wifi_bulb/office",
          "data": {"code": "toggle"},
          "status": {
            "method": "PUT",
            "url": "wifi_bulb/office",
            "data": {"code": "status"},
            "variable": "onoff",
            "good": 1,
            "bad": 0
          }
        },
        "up_hold": {
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
        "down": {
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "power"},
          "status": {
            "method": "PUT",
            "url": "tvcom/power",
            "data": {"code": "status"},
            "variable": "status",
            "good": 'on',
            "bad": 'off'
          }
        },
        "down_hold": {
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
        }
      }
    },
    {
      "headers": headers,
      "payload": {
        "id": 2,
        "color": "550055",
        "highlight": "5500aa",
        "texts": [
          "bulb",
          "bulb off",
          "lamp on",
          "lamp off",
          "tv",
          "input",
          "livingroom"
        ],
        "icon_keys": [
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "1b6453892473a467d07372d45eb05abc2031647a",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "b1e988088881baf2c4792017aceea0f7bf6be1b2",
          "84d30b572200d1bfa828f4a24cb0ed840e16ad4f",
          "b1e988088881baf2c4792017aceea0f7bf6be1b2",
        ]
      },
      "buttons": {
        "base_url": "https://kennedn.com/api/v1.0/",
        "up": {
          "method": "PUT",
          "url": "bulb_old",
          "multi_data": {
            "index": 0,
            "good": 0,
            "bad": 1,
            "data": [
              {"code": "on"},
              {"code": "off"}
            ]
          }
        },
        "up_hold": {
          "method": "PUT",
          "url": "bulb_old",
          "data": {"code": "off"},
        },
        "mid": {
          "method": "PUT",
          "url": "bulb",
          "data": {"code": "on"},
        },
        "mid_hold": {
          "method": "PUT",
          "url": "bulb",
          "data": {"code": "off"},
        },
        "down": {
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "power"},
          "status": {
            "method": "PUT",
            "url": "tvcom/power",
            "data": {"code": "status"},
            "variable": "status",
            "good": 'on',
            "bad": 'off'
          }
        },
        "down_hold": {
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "input"}
        }
      }
    },
     {
      "headers": headers,
      "payload": {
        "id": 3,
        "color": "00aa00",
        "highlight": "55aa00",
        "texts": [
          "office",
          "attic",
          "bedroom",
          "hall up",
          "tv",
          "hall down",
          "thermostat"
        ],
        "icon_keys": [
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "b1e988088881baf2c4792017aceea0f7bf6be1b2",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "1b6453892473a467d07372d45eb05abc2031647a",
          "84d30b572200d1bfa828f4a24cb0ed840e16ad4f",
          "77de68daecd823babbb58edb1c8e14d7106e83bb",
          "356a192b7913b04c54574d18c28d46e6395428ab"
        ]
      },
      "buttons": {
        "base_url": "https://kennedn.com/api/v1.0/",
        "up": {
          "method": "PUT",
          "url": "wifi_bulb/office",
          "data": {"code": "toggle"},
          "status": {
            "method": "PUT",
            "url": "wifi_bulb/office",
            "data": {"code": "status"},
            "variable": "onoff",
            "good": 1,
            "bad": 0
          }
        },
        "up_hold": {
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
        "down": {
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "power"},
          "status": {
            "method": "PUT",
            "url": "tvcom/power",
            "data": {"code": "status"},
            "variable": "status",
            "good": 'on',
            "bad": 'off'
          }
        },
        "down_hold": {
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
        }
      }
    },
    {
      "headers": headers,
      "payload": {
        "id": 4,
        "color": "ff00ff",
        "highlight": "ff55ff",
        "texts": [
          "bulb",
          "bulb off",
          "lamp on",
          "lamp off",
          "tv",
          "input",
          "attic"
        ],
        "icon_keys": [
          "1b6453892473a467d07372d45eb05abc2031647a",
          "b1e988088881baf2c4792017aceea0f7bf6be1b2",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "84d30b572200d1bfa828f4a24cb0ed840e16ad4f",
          "77de68daecd823babbb58edb1c8e14d7106e83bb",
          "1b6453892473a467d07372d45eb05abc2031647a",
          "b1e988088881baf2c4792017aceea0f7bf6be1b2"
        ]
      },
      "buttons": {
        "base_url": "https://kennedn.com/api/v1.0/",
        "up": {
          "method": "PUT",
          "url": "bulb_old",
          "multi_data": {
            "index": 0,
            "good": 0,
            "bad": 1,
            "data": [
              {"code": "on"},
              {"code": "off"}
            ]
          }
        },
        "up_hold": {
          "method": "PUT",
          "url": "bulb_old",
          "data": {"code": "off"},
        },
        "mid": {
          "method": "PUT",
          "url": "bulb",
          "data": {"code": "on"},
        },
        "mid_hold": {
          "method": "PUT",
          "url": "bulb",
          "data": {"code": "off"},
        },
        "down": {
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "power"},
          "status": {
            "method": "PUT",
            "url": "tvcom/power",
            "data": {"code": "status"},
            "variable": "status",
            "good": 'on',
            "bad": 'off'
          }
        },
        "down_hold": {
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "input"}
        }
      }
    },
         {
      "headers": headers,
      "payload": {
        "id": 1,
        "color": "0055aa",
        "highlight": "00aaff",
        "texts": [
          "office",
          "attic",
          "bedroom",
          "hall up",
          "tv",
          "hall down",
          "test1"
        ],
        "icon_keys": [
           "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "84d30b572200d1bfa828f4a24cb0ed840e16ad4f",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "84d30b572200d1bfa828f4a24cb0ed840e16ad4f",
        ]
      },
      "buttons": {
        "base_url": "https://kennedn.com/api/v1.0/",
        "up": {
          "method": "PUT",
          "url": "wifi_bulb/office",
          "data": {"code": "toggle"},
          "status": {
            "method": "PUT",
            "url": "wifi_bulb/office",
            "data": {"code": "status"},
            "variable": "onoff",
            "good": 1,
            "bad": 0
          }
        },
        "up_hold": {
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
        "down": {
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "power"},
          "status": {
            "method": "PUT",
            "url": "tvcom/power",
            "data": {"code": "status"},
            "variable": "status",
            "good": 'on',
            "bad": 'off'
          }
        },
        "down_hold": {
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
        }
      }
    },
    {
      "headers": headers,
      "payload": {
        "id": 2,
        "color": "550055",
        "highlight": "5500aa",
        "texts": [
          "bulb",
          "bulb off",
          "lamp on",
          "lamp off",
          "tv",
          "input",
          "test2"
        ],
        "icon_keys": [
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "1b6453892473a467d07372d45eb05abc2031647a",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "b1e988088881baf2c4792017aceea0f7bf6be1b2",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "84d30b572200d1bfa828f4a24cb0ed840e16ad4f",
          "84d30b572200d1bfa828f4a24cb0ed840e16ad4f"
        ]
      },
      "buttons": {
        "base_url": "https://kennedn.com/api/v1.0/",
        "up": {
          "method": "PUT",
          "url": "bulb_old",
          "multi_data": {
            "index": 0,
            "good": 0,
            "bad": 1,
            "data": [
              {"code": "on"},
              {"code": "off"}
            ]
          }
        },
        "up_hold": {
          "method": "PUT",
          "url": "bulb_old",
          "data": {"code": "off"},
        },
        "mid": {
          "method": "PUT",
          "url": "bulb",
          "data": {"code": "on"},
        },
        "mid_hold": {
          "method": "PUT",
          "url": "bulb",
          "data": {"code": "off"},
        },
        "down": {
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "power"},
          "status": {
            "method": "PUT",
            "url": "tvcom/power",
            "data": {"code": "status"},
            "variable": "status",
            "good": 'on',
            "bad": 'off'
          }
        },
        "down_hold": {
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "input"}
        }
      }
    },
     {
      "headers": headers,
      "payload": {
        "id": 3,
        "color": "00aa00",
        "highlight": "55aa00",
        "texts": [
          "office",
          "attic",
          "bedroom",
          "hall up",
          "tv",
          "hall down",
          "test3"
        ],
        "icon_keys": [
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "b1e988088881baf2c4792017aceea0f7bf6be1b2",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "1b6453892473a467d07372d45eb05abc2031647a",
          "84d30b572200d1bfa828f4a24cb0ed840e16ad4f",
          "77de68daecd823babbb58edb1c8e14d7106e83bb",
          "356a192b7913b04c54574d18c28d46e6395428ab"
        ]
      },
      "buttons": {
        "base_url": "https://kennedn.com/api/v1.0/",
        "up": {
          "method": "PUT",
          "url": "wifi_bulb/office",
          "data": {"code": "toggle"},
          "status": {
            "method": "PUT",
            "url": "wifi_bulb/office",
            "data": {"code": "status"},
            "variable": "onoff",
            "good": 1,
            "bad": 0
          }
        },
        "up_hold": {
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
        "down": {
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "power"},
          "status": {
            "method": "PUT",
            "url": "tvcom/power",
            "data": {"code": "status"},
            "variable": "status",
            "good": 'on',
            "bad": 'off'
          }
        },
        "down_hold": {
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
        }
      }
    },
    {
      "headers": headers,
      "payload": {
        "id": 4,
        "color": "ff00ff",
        "highlight": "ff55ff",
        "texts": [
          "bulb",
          "bulb off",
          "lamp on",
          "lamp off",
          "tv",
          "input",
          "test4"
        ],
        "icon_keys": [
          "1b6453892473a467d07372d45eb05abc2031647a",
          "b1e988088881baf2c4792017aceea0f7bf6be1b2",
          "202eb9f12a07f9a746a3a81cd48f6eaa2e8dc8ba",
          "84d30b572200d1bfa828f4a24cb0ed840e16ad4f",
          "77de68daecd823babbb58edb1c8e14d7106e83bb",
          "1b6453892473a467d07372d45eb05abc2031647a",
          "b1e988088881baf2c4792017aceea0f7bf6be1b2"
        ]
      },
      "buttons": {
        "base_url": "https://kennedn.com/api/v1.0/",
        "up": {
          "method": "PUT",
          "url": "bulb_old",
          "multi_data": {
            "index": 0,
            "good": 0,
            "bad": 1,
            "data": [
              {"code": "on"},
              {"code": "off"}
            ]
          }
        },
        "up_hold": {
          "method": "PUT",
          "url": "bulb_old",
          "data": {"code": "off"},
        },
        "mid": {
          "method": "PUT",
          "url": "bulb",
          "data": {"code": "on"},
        },
        "mid_hold": {
          "method": "PUT",
          "url": "bulb",
          "data": {"code": "off"},
        },
        "down": {
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "power"},
          "status": {
            "method": "PUT",
            "url": "tvcom/power",
            "data": {"code": "status"},
            "variable": "status",
            "good": 'on',
            "bad": 'off'
          }
        },
        "down_hold": {
          "method": "PUT",
          "url": "tvcom/ir_key",
          "data": {"code": "input"}
        }
      }
    },
  ]
};


/**
 * Secure Hash Algorithm (SHA1)
 * http://www.webtoolkit.info/
 **/
function SHA1(msg) {
    function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };

    function lsb_hex(val) {
        var str = '';
        var i;
        var vh;
        var vl;
        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };

    function cvt_hex(val) {
        var str = '';
        var i;
        var v;
        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;
    msg = Utf8Encode(msg);
    var msg_len = msg.length;
    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
            msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }
    switch (msg_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
            break;
        case 3:
            i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
            break;
    }
    word_array.push(i);
    while ((word_array.length % 16) != 14) word_array.push(0);
    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);
    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }
    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();
}

function packIcon(key, index) {
  var buffer = new ArrayBuffer(1000000);
  var uint8 = new Uint8Array(buffer);
  let ptr = 0;

  let icon = icons[key];

  uint8[ptr++] = index;

  if (typeof(icon) == 'string') {
    let buff = Buffer.from(icon, 'base64');
    if (DEBUG > 2) { console.log("icon_size: " + buff.length); }
    uint8[ptr++] = buff.length & 0xff;
    uint8[ptr++] = buff.length >> 8;
    for (let i=0; i < buff.length; i++) {
      uint8[ptr++] = buff[i];
    }
  } else {
    if (DEBUG > 2) { console.log("icon_size: " + 1); }
    uint8[ptr++] = 1;
    uint8[ptr++] = 0;
    uint8[ptr++] = icon;
  }
  var buffer_2 = buffer.slice(0, ptr);
  var uint8_2 = new Uint8Array(buffer_2);

  if (DEBUG > 2) {
    console.log(Array.apply([], uint8_2).join(","));
  }

  processData(buffer_2, TransferType.ICON, index);
}

function packTiles(tiles) {
  var buffer = new ArrayBuffer(1000000);
  var uint8 = new Uint8Array(buffer);
  let ptr = 0;
  let payload;
  uint8[ptr++] = tiles.default_idx;
  uint8[ptr++] = tiles.open_default;
  for (tile of tiles.tiles) {
    payload = tile.payload;

    uint8[ptr++] = payload.id;
    uint8[ptr++] = toGColor(payload.color);
    uint8[ptr++] = toGColor(payload.highlight);

    for (t of payload.texts) {
      uint8[ptr++] = t.length + 1;
      ptr = packString(uint8, t, ptr);
    }

    for (k of payload.icon_keys) {
      uint8[ptr++] = k.length + 1;
      ptr = packString(uint8, k, ptr);
    }
  }

  var buffer_2 = buffer.slice(0,ptr);
  var uint8_2 = new Uint8Array(buffer_2);

  if (DEBUG > 2) {
    for (var key in payload)
      console.log(key + ": " + payload[key]);
    console.log(Array.apply([], uint8_2).join(","));
  }

  processData(buffer_2, TransferType.TILE);
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join(' ');
}

/**
 * Returns a GColor8 (uint8_t) representation of a hex color code, replicates GColorFromHEX()
 * @param {string} hexString
 * @param {int} position
 * @return {int}
 */
function toGColor(hexString) {
  // Split hexString into 2 char array [r, g, b], bitshift and pad each element, 
  // then join and parse into uint8_t.
  return parseInt("11" + hexString.match(/.{1,2}/g).map(hex => 
    (parseInt(hex, 16) >> 6).toString(2).padStart(2, '0')).join(''), 2); 
}

/**
 * Assigns each byte of a string to uint8Array
 * @param {Uint8Array} uint8Array
 * @param {string} str
 * @param {int} idx 
 */
function packString(uint8Array, str, idx) {
  if(idx + (str.length + 1) > uint8Array.length) throw new Error("Index out of range");
  for (var c=0; c < str.length; c++) {
    uint8Array[c+idx] = str.charCodeAt(c);
  }
  uint8Array[c+idx+1] = 0x00;
  if (DEBUG > 2) {
    console.log("String: " + str + ", Length: " + str.length + ", c + idx: " + (c + idx) + ", uint8Length: " + uint8Array.length);
  }
  return c+idx+1
}

function sendChunk(array, index, arrayLength, type) {
  // Determine the next chunk size
  var chunkSize = MAX_CHUNK_SIZE;
  if(arrayLength - index < MAX_CHUNK_SIZE) {
    // Will only need one more chunk
    chunkSize = arrayLength - index;
  } 
  if (DEBUG > 0)
    console.log("ChunkSize: " +chunkSize);
  // Prepare the dictionary
  var dict = {
    'TransferChunk': array.slice(index, index + chunkSize),
    'TransferChunkLength': chunkSize,
    'TransferIndex': index,
    'TransferType': type
  };

  // Send the chunk
  Pebble.sendAppMessage(dict, function() {
    // Success
    index += chunkSize;

    if(index < arrayLength) {
      // Send the next chunk
      sendChunk(array, index, arrayLength, type);
    } else {
      // Done
      Pebble.sendAppMessage({
        'TransferComplete': arrayLength,
        'TransferType': type});
    }
  }, function(obj, error) {
    console.log(error + ": " + JSON.stringify(dict));
  });
}

function transmitData(array, type) {
  var index = 0;
  var arrayLength = array.length;
  
  // Transmit the length for array allocation
  Pebble.sendAppMessage({
    'TransferLength': arrayLength,
    'TransferType' : type}, function(e) {
    // Success, begin sending chunks
    sendChunk(array, index, arrayLength, type);
  }, function(e) {
    console.log('Failed to send data length to Pebble!');
  });
}

function processData(data, type) {
  // Convert to a array
  var byteArray = new Uint8Array(data);
  var array = [];
  for(var i = 0; i < byteArray.byteLength; i++) {
    array.push(byteArray[i]);
  }
  // Send chunks to Pebble
  transmitData(array, type);
}

function downloadImage(i, callback) {
  // if (tile.payload.icons[i] !== "") {
  //   console.log("Icon stored locally");
  //   processData(Buffer.from(tile.payload.icons[i], 'base64'), TransferType.ICON);
  // } else {
    console.log("Icon need retrieved");
    var request = new XMLHttpRequest();
    request.onload = function() {
      console.log("Downloaded with return code " + this.status);
      if(this.status === 200) {
        console.log("Saving icon to json");
        tile.payload.icons[i] = Buffer.from(this.response).toString('base64');
        callback()
        // localStorage.setItem("tile", JSON.stringify(tile));
        // console.log(localStorage.getItem("tile"));
        // processData(this.response, TransferType.ICON);
      }
    };
    request.responseType = "arraybuffer";
    request.open("GET", tile.payload.icons[i]);
    request.send();
  // }
}

function xhrRequest(method, base_url, url, headers, data, callback) {
  var request = new XMLHttpRequest();
  request.onload = function() {
    let returnData = JSON.parse(this.response);
    if (DEBUG > 1) {
      console.log("Response data: " + JSON.stringify(returnData));
      console.log("Status: " + this.status);
    }
    if(this.status == 200) {
      Pebble.sendAppMessage({"TransferType": TransferType.ACK}, messageSuccessCallback, messageFailureCallback);
      if (callback) { callback(); }
    } else {
      // Pebble.sendAppMessage({"TransferType": TransferType.ERROR}, messageSuccessCallback, messageFailureCallback);
      Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.ERROR }, messageSuccessCallback, messageFailureCallback);
    }
  };

  if (DEBUG > 1) {
    console.log("URL: " + base_url + url);
    console.log("Method: " + method);
    console.log("Data: " + JSON.stringify(data));
  }

  request.ontimeout = function(e) { console.log("Timed out");};
  request.open(method, base_url + url);
  request.timeout = 4000;
  for (let key in headers) {
    if(headers.hasOwnProperty(key)) {
      if (DEBUG > 1) { console.log("Setting header: " + key + ": " + headers[key]); }
      request.setRequestHeader(key, headers[key]);
    }
  }
  request.send(JSON.stringify(data));  
}				

function xhrStatus(method, base_url, url, headers, data, variable, good, bad, maxRetries=40) {
  var request = new XMLHttpRequest();
  request.onload = function() {
    let returnData = JSON.parse(this.response);
    if (DEBUG > 1) {
      console.log("Response Data: " + JSON.stringify(returnData));
      console.log("Status: " + this.status);
    }
    if(this.status == 200) {
      let r = returnData
      for (let j of variable.split(".")) {
        r = r[j];
      }
      if (DEBUG > 1) { console.log("result: " + r + " maxRetries: " + maxRetries)}
      switch(r) {
        case good:
          Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.GOOD }, messageSuccessCallback, messageFailureCallback);
          break;
        case bad:
          Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.BAD }, messageSuccessCallback, messageFailureCallback);
          break;
        default:
          if (maxRetries > 0) {
            setTimeout(function() {xhrStatus(method, base_url, url, headers, data, variable, good, bad, --maxRetries)}, 100);
          } else {
            Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.ERROR }, messageSuccessCallback, messageFailureCallback);
          }
      }

    } else {
          if (maxRetries > 0) {
            setTimeout(function() {xhrStatus(method, base_url, url, headers, data, variable, good, bad, --maxRetries)}, 100);
          } else {
            Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.ERROR }, messageSuccessCallback, messageFailureCallback);
          }
    }
  };

  if (DEBUG > 1) {
    console.log("URL: " + base_url + url);
    console.log("Method: " + method);
    console.log("Data: " + JSON.stringify(data));
  }

  request.ontimeout = function(e) { console.log("Timed out");};
  request.open(method, base_url + url);
  request.timeout = 4000;
  for (let key in headers) {
    if(headers.hasOwnProperty(key)) {
      if (DEBUG > 1) { console.log("Setting header: " + key + ": " + headers[key]); }
      request.setRequestHeader(key, headers[key]);
    }
  }
  request.send(JSON.stringify(data));  
}				

function idxHighlight(index, good, bad) {
  switch(index) {
    case good:
      Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.GOOD }, messageSuccessCallback, messageFailureCallback);
      break;
    case bad:
      Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": Color.BAD }, messageSuccessCallback, messageFailureCallback);
      break;
    default:
      Pebble.sendAppMessage({"TransferType": TransferType.COLOR, "Color": -1 }, messageSuccessCallback, messageFailureCallback);
  }
}

// Called when incoming message from the Pebble is received
Pebble.addEventListener("appmessage", function(e) {
  var dict = e.payload;
  if (DEBUG > 1) 
    console.log('Got message: ' + JSON.stringify(dict));

  switch(dict.TransferType) {
    case TransferType.ICON:
      if (!("IconKey" in dict) || !("IconIndex" in dict)) {
        if (DEBUG > 0)
          console.log("didn't receive expected data");
        return;
      }
      packIcon(dict.IconKey, dict.IconIndex);
    break;
    case TransferType.TILE:
      packTiles(tiles);
    break;
    case TransferType.XHR:
      if (!("RequestID" in dict) || !("RequestButton" in dict)) {
        if (DEBUG > 0)
          console.log("didn't receive expected data");
        return;
      }

      let id = dict.RequestID;
      let tile = tiles.tiles.find(t => t.payload.id == id);
      if (tile == null) { 
        console.log("Could not locate tile with id " + id);
        return;
      }
      let button = tile.buttons[Button[dict.RequestButton]];
      let base_url = tile.buttons.base_url;
      let headers = tile.headers;

      if ("status" in button) {
        let status = button.status
        xhrRequest(button.method, base_url, button.url, headers, button.data, 
                  xhrStatus.bind(null, status.method, base_url, status.url, headers, status.data, status.variable, status.good, status.bad));
      } else if("multi_data" in button) {
        let multi_data = button.multi_data;
        let data = multi_data.data[multi_data.index];
        xhrRequest(button.method, base_url, button.url, headers, data, idxHighlight.bind(null, multi_data.index, multi_data.good, multi_data.bad));
        button.multi_data.index = (multi_data.index + 1) % multi_data.data.length;
      } else {
        xhrRequest(button.method, base_url, button.url, headers, button.data);
      }
    break;
  }
  
});

Pebble.addEventListener('ready', function() {
  console.log("ready");
  Pebble.sendAppMessage({"TransferType": TransferType.READY }, messageSuccessCallback, messageFailureCallback);
});

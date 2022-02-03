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
          {"src": <img src="data:image/webp;base64,UklGRoIAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSBcAAAABDzD/ERGCINtmBlO+/YcQ0f8JoJ1HCQBWUDggRAAAADADAJ0BKhIAEgA+nUCYSaWkIqE36ACwE4lpAACI5keDacAA/vtlb/5D9x2H5w56LybczrgYn/wCr8QL/QmieRjwAAAA"></img>,"label": "name","value": "c4ca4238"},
          {"src": <img src="data:image/webp;base64,UklGRhYBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSCIAAAABDzD/ERECTW0ruWxsEIUIRjOayXQ3QUT/A8ZqJ+1yX/wBVlA4IM4AAABwBACdASoSABIAPrVOnkunJCKhqA1Q4BaJQApggdUWt8cJjc3wPI0RkRcsAAD+7pqz2QoQlBpumtTKyz+e6e3b/+TEo0ApoZh+m8p85aWWJJ/OtUgCa+48rol93/uv+39WOXWKLv3Z/zL/76TqARfucE//+JR+Vwj2a1Ahc4bRSI86mOPSbgzbgBGq8/fJKMO8+tvo0rW/7xsJY40jDSvqu7ZtP/tCZJl9pvCOfYE4es/MW5g1fGuOfJtu8o5y/dTYzp77Tx1bdOHnAAAAAA=="></img>,"label": "name","value": "c81e728d"},
          {"src": <img src="data:image/webp;base64,UklGRtgAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSCsAAAABDzD/ERFCUSQ50XA/kRApkQbSkBIJeWLgkhDR/zDBlT2+XDFh9QOYDYAEAFZQOCCGAAAAMAQAnQEqEgASAD61Tp5LJyQioagNUOAWiWkAA+I/x4FX6muF8vXnyzYAAPz91J71sGip0fVKrxWdizsBze9k+sDEThlniKyVcFdbIEfhpxI/4zEI0PcJa+oZ99aT8/QkHJK+fkhX3hcUcvLK127LrC2kO9olMEgp0/vbpajF/3Vanz2ToAA="></img>,"label": "name","value": "eccbc87e"},
          {"src": <img src="data:image/webp;base64,UklGRrgAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSB0AAAABDzD/ERHCVCQbK4FIqoskAf8SRPQ/sBc/nTpNAQBWUDggdAAAANADAJ0BKhIAEgA+sUSdSacjoqE39VgA4BYJaQAEO5CvaOEXQqRwAAD5O7igcfPyHnBGc1aXggZxbiCz5Zv0D0O++r/UmFkzNULR2+h4YP122R35tC20uudOnbVoTbD5v7Hv3SqyyDrH/x5LpF/xaTPosQAA"></img>,"label": "name","value": "a87ff679"},
          {"src": <img src="data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAADQAgCdASoSABIAPrVWpE2nJKOiKAgA4BaJaQAAPaOgAP71C6GAAA=="></img>,"label": "name","value": "e4da3b7f"},
          {"src": <img src="data:image/webp;base64,UklGRgABAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSB0AAAABDzD/ERHCMBtJNVu0U1ukex7DEUT0P0rZuPnbAABWUDggvAAAAHAEAJ0BKhIAEgA+tVKfTKckoqIoCqjgFolpAAPj08lCjBYSsoXf3Z9IkdYAAP7png1UJdqZvQ0t2rJrMpgkPt2H9/o4MUI5cq0wLCySqgl49z1/9/0blkh7i609xPvBO8S4jAw7sMVQbVEYuLn/50fXuUQhk3ynLfX9W8pWo89ay0gUv/9ejyz9Y6qlT040n8jxn/5bQhOQ8G1fJGJfzUUvq6hY1AN3qQO9hznHahnZuFqyAJYZ+KL4AAAA"></img>,"label": "name","value": "1679091c"},
          {"src": <img src="data:image/webp;base64,UklGRrQAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSB0AAAABDzD/ERFCUdtGzP1K+4DvTSGi/xNAI+MhfmE8ZgBWUDggcAAAALADAJ0BKhIAEgA+tUqhSackIyEoDVDgFolpAAQ7nxZkMNcOt9J4AP75wl+29ea7Vj1q0CjT5QZMyT8mgmB99NClp/NgMKd1kXk3bMJf9xWnynHZt1+xejehlNk1hzx9G4w9OwbkbjGYf0dnPhIwAAA="></img>,"label": "name","value": "8f14e45f"},
          {"src": <img src="data:image/webp;base64,UklGRooAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSBkAAAABDzD/ERFCTdsGTPljXl8VCBH9nwCx3gMDAFZQOCBKAAAAsAMAnQEqEgASAD6tSJtJpiSioTf1WADAFYlpAAQ4AK9raW0u9wAA/vpa1p+WkD582AxKko5D4K5y3V2cbGrbMyZX0qIPqL4AAAA="></img>,"label": "name","value": "c9f0f895"},
          {"src": <img src="data:image/webp;base64,UklGRvoAAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSDUAAAABDzD/ERGCUSRJimrhmAyRMZS2kuZ5zOchov+BAcMY4IpXGo5Tnac5TrWdTAPSMA3/llJIHQBWUDggngAAAFAEAJ0BKhIAEgA+tVKiTSckoyIoCADgFolpAASYDkAD4qC/eTINsY9CcAAA/rn957QtdV4FLRd997nXUE6IaQaGGM+hw/p9K2i8PykPOIO/axhowHUEuOv0kW9vJYE89iHS+iNH6xzFVHTMLSlrW/bLnkreoO2nU5Qu8T22Xok/r6dAldqXcFBnuuAI66Ks7vlb6hC5V38r076/aAAA"></img>,"label": "name","value": "45c48cce"},
          {"src": <img src="data:image/webp;base64,UklGRlwBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSEQAAAABDzD/ERGCaW3tTV4OTWaEbAKSsUDiWKBt0tsacbFxdFDsENH/wCENyGIKQ7OJdnNq4+TrT46O7BylndCK+2NPsBFaAVZQOCDyAAAA0AYAnQEqEgASAD61UqJNJySjIigIAOAWiWkAEQzPmA8sXxr7AH6T/7rgOf0lDeMG2AlEwpL0RDUK33y9zGIAAP5y7T2hDieZTQAG/NM8Jswc857/taHJeuv8bcQmaU5fPB/uJ4H545ReaQQLrZvyv8TW/32ZrAjWbEn5oozPJKvS98BER9N032DrboH/vsDPTu5/pVkTDSXpM9eJynIiPqM2VHl+GYd1bTnC45UJbj7NmQfaWDoYyZd0/ToIiP6/dn/RQMKLQ1pYKGEtcOdmpC8I79K+3gecbr++uF3S/y3R0h2q6K1eKsrwGmrsWfiNgAA="></img>,"label": "name","value": "d3d94468"},
          {"src": <img src="data:image/webp;base64,UklGRjABAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSCwAAAABDzD/ERFCTSRJUTA+kH5aXiDEAVLYDA0R/Y8nPsMxxwMvtNFBGy9uYM7TD1ZQOCDeAAAAcAYAnQEqEgASAD61UqNNJySjIigIAOAWiWkABJAH2q+/fm5eavQt3wD9bg9zCJp3X+z7M38x3fdZufgAAPa/k4WOesT45elj//8+KJUso4bKXbnPcUL8qd8h4Zm/dzykv/n9QmoL+txMW4QXx4BsZzdtXxn79U8HVfs/JxQkPludS1QjrphzJaSvdMflJT2bGI4uBfkSdCWd2Bd9t+ECOvlIusMzKeMOYXDNYrCf6TGLNg//bD/1OD/4lp8xwSXZZmH5PDVk8Dt9JU6iwrSR8vTTx2H1XI0oRzzrhgAA"></img>,"label": "name","value": "6512bd43"},
          {"src": <img src="data:image/webp;base64,UklGRhIBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSDEAAAABDzD/ERGCQSRJjeYYCRjGF3yQkiQgYG1E9D9oIENueSS9Ms2u/GRXpukVeeSWIQgNAFZQOCC6AAAAkAUAnQEqEgASAD61UqJNJySjIigIAOAWiWkABD6fGV8ceiRvgH65BZeluWUwFImEnXB4FgAA/c2ya9jWk3R12Yw1j279HiVGY/1kmBa1iXYlf877RdQXW3klOAPKNTHLflKIw7cVRvJY3lmPm0+GK7swNsIz2T05eGiJFF0xCbnhtO88CtPyv+t8s9s1F/LtAtKPuybdvOvz1/VmbnUBHkN1Zc3PPP49Acmfc5odtajQhgafD360sAAA"></img>,"label": "name","value": "c20ad4d7"},
          {"src": <img src="data:image/webp;base64,UklGRi4BAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSCMAAAABDzD/ERFCQRtJyoGA8+/mhDH8a4jo/wSk8YfoD5yi/JH2AwBWUDgg5AAAAPAFAJ0BKhIAEgA+tUqgSqckIyGoDVDgFolpAAbLD7X+UH/Vc4L+jgZeMpPF6ngf2y9Lmolj4wIAAM4/MRv3h90t7a72f5c91LyN9HbZKzuI09nuTpE0P3llc/c/tVJsBN+2BMSL8ds3SGehZo54t9wo+TaZ51HiAv9Ac3cksFxEsCqg6B9L6JvF3ew+fN8kwOUN2a8NLrVTfu1KR/mnmEMQHu3zL8j/NI1U3uvS+U81TxRNWmNpmj+YRf7M76BpJrMn8rn+xnvJ0ckbFzxX9oHYKbFSr8vRKZqMjNhnhNd9rQAAAA=="></img>,"label": "name","value": "c51ce410"},
          {"src": <img src="data:image/webp;base64,UklGRgIBAABXRUJQVlA4WAoAAAAQAAAAEQAAEQAAQUxQSC8AAAABDzD/ERGCUSRJkWpihCAFZ2AVCTzvm10NEf0PgKQksU1cow2aIykIKMnfaP+CuQBWUDggrAAAABAEAJ0BKhIAEgA+tVSkTScko6IoCADgFolpAAPjqQmhMnbJrg10fNmAAP7y5tKFxT089MHastihTs10x0msVrSAD8FFTWpZGyGW2F0ZFQw8PIaZ3jG2GCrZyCcoriYbcC1hf1xckCxVuSidzEV0fJSspDxECkHDzIMs35gzKkehfzBgjkgfF8I3eO8ZlrvhCn/MbHwfh/bN9ztRxoftPAMjmNG+ld5ilgAAAAA="></img>,"label": "name","value": "aab32389"}
        ],
        "group": "tile.0"
      },
    ]
  }
]
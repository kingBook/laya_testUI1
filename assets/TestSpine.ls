{
  "_$ver": 1,
  "_$id": "lx8mwule",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "Scene2D",
  "width": 640,
  "height": 1136,
  "_$child": [
    {
      "_$id": "ftg8oscv",
      "_$type": "Panel",
      "name": "Panel",
      "width": 640,
      "height": 1136,
      "left": 0,
      "right": 0,
      "top": 0,
      "bottom": 0,
      "_$child": [
        {
          "_$id": "c4zeqkim",
          "_$type": "TextArea",
          "name": "TextArea",
          "width": 180,
          "height": 150,
          "text": "TextArea",
          "fontSize": 20,
          "color": "#ffffff",
          "padding": "6,6,6,6",
          "skin": "res://9eb4836d-78c4-4be3-aa53-70a613fef28d"
        },
        {
          "_$id": "5m1b8ksu",
          "_$type": "Box",
          "name": "Box",
          "x": 118,
          "y": 275,
          "width": 200,
          "height": 200,
          "anchorX": 0.51,
          "anchorY": 0.945,
          "mask": {
            "_$ref": "8nfzn283"
          },
          "_$comp": [
            {
              "_$type": "Spine2DRenderNode",
              "layer": 0,
              "useFastRender": false,
              "source": "res://df103dab-afee-4685-8074-53409cea95e5",
              "animationName": "idle",
              "preview": true,
              "physicsUpdate": 2
            }
          ],
          "_$child": [
            {
              "_$id": "8nfzn283",
              "_$type": "Sprite",
              "name": "Sprite_1",
              "x": -15,
              "y": 15,
              "width": 100,
              "height": 100,
              "scaleX": 1.71,
              "scaleY": 1.85,
              "_gcmds": [
                {
                  "_$type": "DrawPolyCmd",
                  "x": 0,
                  "y": 0,
                  "points": [
                    0,
                    0,
                    105.99703818359373,
                    -23.00148090820313,
                    100,
                    50,
                    67.13036337890624,
                    95.93481831054689,
                    0,
                    100
                  ],
                  "lineWidth": 1,
                  "lineColor": "#000000",
                  "fillColor": "#ffffff"
                }
              ],
              "_filters": []
            }
          ]
        },
        {
          "_$id": "jjiwd05k",
          "_$type": "Button",
          "name": "Button",
          "x": 73,
          "y": 252,
          "width": 120,
          "height": 40,
          "skin": "res://d4cfd6a8-0d0a-475b-ac93-d85eaa646936",
          "label": "Title",
          "labelSize": 20,
          "labelAlign": "center",
          "labelVAlign": "middle"
        }
      ]
    },
    {
      "_$id": "0kinvap7",
      "_$type": "Sprite",
      "name": "hero-pro",
      "x": 345,
      "y": 801,
      "width": 319,
      "height": 334,
      "anchorX": 0.727,
      "anchorY": 1,
      "mask": {
        "_$ref": "2yomknym"
      },
      "_$comp": [
        {
          "_$type": "Spine2DRenderNode",
          "layer": 0,
          "useFastRender": false,
          "source": "res://df103dab-afee-4685-8074-53409cea95e5",
          "animationName": "idle",
          "preview": true,
          "physicsUpdate": 2
        },
        {
          "_$type": "53801247-fb17-4445-b371-ab47ab6e6e78",
          "scriptPath": "../src/SpinePlayer.ts"
        }
      ],
      "_$child": [
        {
          "_$id": "2yomknym",
          "_$type": "Sprite",
          "name": "Sprite",
          "x": 151,
          "y": 82,
          "width": 100,
          "height": 100,
          "scaleX": 1.71,
          "scaleY": 1.85,
          "_gcmds": [
            {
              "_$type": "DrawPolyCmd",
              "x": 0,
              "y": 0,
              "points": [
                0,
                0,
                105.99703818359373,
                -23.00148090820313,
                100,
                50,
                67.13036337890624,
                95.93481831054689,
                0,
                100
              ],
              "lineWidth": 1,
              "lineColor": "#000000",
              "fillColor": "#ffffff"
            }
          ],
          "_filters": []
        }
      ]
    }
  ]
}
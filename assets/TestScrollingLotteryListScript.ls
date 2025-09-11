{
  "_$ver": 1,
  "_$id": "hcdo2nr3",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "TestScrollingLotteryListScript",
  "width": 640,
  "height": 1136,
  "_$comp": [
    {
      "_$type": "0d530538-ae0f-4342-87a0-2773f2f16ae4",
      "scriptPath": "../src/TestScrollingLotteryListScript.ts",
      "hList": {
        "_$ref": "6kxe8xbj"
      },
      "vList": {
        "_$ref": "pnlinnwv"
      },
      "letterList": {
        "_$ref": "maucymo2"
      },
      "numberList": {
        "_$ref": "s0fi6cwi"
      }
    }
  ],
  "_$child": [
    {
      "_$id": "x8dexbj3",
      "_$type": "Label",
      "name": "tip",
      "x": 128,
      "y": 20,
      "width": 385,
      "height": 112,
      "top": 20,
      "centerX": 0,
      "text": "按 H，开始滚动\n按 J，设置结果\n按 K，立即设置到结果处",
      "fontSize": 35,
      "color": "#ffffff",
      "fitContent": "yes",
      "valign": "middle"
    },
    {
      "_$id": "6kxe8xbj",
      "_$type": "List",
      "name": "hList",
      "x": 170,
      "y": 399,
      "width": 300,
      "height": 100,
      "centerX": 0,
      "bgColor": "#ffffff",
      "itemTemplate": {
        "_$ref": "qvi4q30r",
        "_$tmpl": "itemRender"
      },
      "repeatX": 3,
      "repeatY": 1,
      "scrollType": 1,
      "_$child": [
        {
          "_$id": "qvi4q30r",
          "_$type": "Box",
          "name": "item",
          "width": 100,
          "height": 100,
          "bgColor": "#26394e",
          "_$child": [
            {
              "_$id": "0qhcd7d8",
              "_$type": "Label",
              "name": "Label",
              "x": 35,
              "y": 20,
              "width": 30,
              "height": 61,
              "centerX": 0,
              "centerY": 0,
              "text": "0",
              "fontSize": 60,
              "color": "#ffffff",
              "fitContent": "yes",
              "align": "center",
              "valign": "middle"
            },
            {
              "_$id": "xzpfvxci",
              "_$type": "Label",
              "name": "labelIndex",
              "x": 43,
              "y": 69,
              "width": 15,
              "height": 31,
              "bottom": 0,
              "centerX": 0,
              "text": "-",
              "fontSize": 30,
              "color": "#ff0000",
              "fitContent": "yes"
            }
          ]
        }
      ]
    },
    {
      "_$id": "pnlinnwv",
      "_$type": "List",
      "name": "vList",
      "x": 512,
      "y": 502,
      "width": 100,
      "height": 300,
      "right": 28,
      "top": 502,
      "bgColor": "#ffffff",
      "itemTemplate": {
        "_$ref": "ys3px1a8",
        "_$tmpl": "itemRender"
      },
      "repeatX": 1,
      "repeatY": 3,
      "spaceY": 20,
      "scrollType": 2,
      "_$child": [
        {
          "_$id": "ys3px1a8",
          "_$type": "Box",
          "name": "item",
          "width": 100,
          "height": 100,
          "bgColor": "#26394e",
          "_$child": [
            {
              "_$id": "8c3fbu85",
              "_$type": "Label",
              "name": "Label",
              "x": 35,
              "y": 20,
              "width": 30,
              "height": 61,
              "centerX": 0,
              "centerY": 0,
              "text": "0",
              "fontSize": 60,
              "color": "#ffffff",
              "fitContent": "yes",
              "align": "center",
              "valign": "middle"
            },
            {
              "_$id": "ltstwnr9",
              "_$type": "Label",
              "name": "labelIndex",
              "x": 45,
              "y": 79,
              "width": 10,
              "height": 21,
              "visible": false,
              "bottom": 0,
              "centerX": 0,
              "text": "-",
              "fontSize": 20,
              "color": "#ff0000",
              "fitContent": "yes"
            }
          ]
        }
      ]
    },
    {
      "_$id": "z8qpag7f",
      "_$type": "Sprite",
      "name": "redLine",
      "x": 270,
      "y": 363,
      "width": 100,
      "height": 225,
      "_gcmds": [
        {
          "_$type": "DrawLineCmd",
          "fromX": 0.5,
          "fromY": 0,
          "toX": 0.5,
          "toY": 1,
          "percent": true,
          "lineWidth": 2,
          "lineColor": "#ff0000"
        }
      ]
    },
    {
      "_$id": "rkb4wi9d",
      "_$type": "Panel",
      "name": "bodyPanel",
      "y": 936,
      "width": 640,
      "height": 200,
      "_mouseState": 2,
      "left": 0,
      "right": 0,
      "bottom": 0,
      "bgColor": "#ffffff",
      "_$child": [
        {
          "_$id": "maucymo2",
          "_$var": true,
          "_$type": "List",
          "name": "letterList",
          "y": 50,
          "width": 640,
          "height": 70,
          "left": 0,
          "right": 0,
          "bottom": 80,
          "itemTemplate": {
            "_$ref": "cjqwp5ry",
            "_$tmpl": "itemRender"
          },
          "repeatX": 7,
          "repeatY": 1,
          "spaceX": 10,
          "scrollType": 1,
          "_$child": [
            {
              "_$id": "cjqwp5ry",
              "_$type": "Box",
              "name": "item",
              "width": 100,
              "height": 70,
              "bgColor": "#d5e1ed",
              "_$child": [
                {
                  "_$id": "6afsb2rt",
                  "_$type": "Label",
                  "name": "Label",
                  "x": 40,
                  "y": 15,
                  "width": 21,
                  "height": 41,
                  "centerX": 0,
                  "centerY": 0,
                  "text": "A",
                  "fontSize": 40,
                  "fitContent": "yes",
                  "bold": true
                }
              ]
            }
          ]
        },
        {
          "_$id": "s0fi6cwi",
          "_$var": true,
          "_$type": "List",
          "name": "numberList",
          "y": 130,
          "width": 640,
          "height": 70,
          "_mouseState": 1,
          "left": 0,
          "right": 0,
          "bottom": 0,
          "itemTemplate": {
            "_$ref": "ervgoolu",
            "_$tmpl": "itemRender"
          },
          "repeatX": 7,
          "repeatY": 1,
          "spaceX": 10,
          "scrollType": 1,
          "_$child": [
            {
              "_$id": "ervgoolu",
              "_$type": "Box",
              "name": "item",
              "width": 100,
              "height": 70,
              "bgColor": "#d5e1ed",
              "_$child": [
                {
                  "_$id": "ii4im3z0",
                  "_$type": "Label",
                  "name": "Label",
                  "x": 40,
                  "y": 15,
                  "width": 21,
                  "height": 41,
                  "centerX": 0,
                  "centerY": 0,
                  "text": "0",
                  "fontSize": 40,
                  "fitContent": "yes",
                  "bold": true
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
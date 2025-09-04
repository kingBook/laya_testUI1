{
  "_$ver": 1,
  "_$id": "hcdo2nr3",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "TestLoopList",
  "width": 640,
  "height": 1136,
  "_$comp": [
    {
      "_$type": "0d530538-ae0f-4342-87a0-2773f2f16ae4",
      "scriptPath": "../src/TestLoopList.ts",
      "hList": {
        "_$ref": "6kxe8xbj"
      },
      "vList": {
        "_$ref": "pnlinnwv"
      }
    }
  ],
  "_$child": [
    {
      "_$id": "6kxe8xbj",
      "_$type": "List",
      "name": "hList",
      "x": 170,
      "y": 58,
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
      "spaceX": 20,
      "scrollType": 1,
      "_$comp": [
        {
          "_$type": "009ea4b0-93c3-4296-b55f-b1428d72bcf7",
          "scriptPath": "../src/kingBook/comps/LoopScrollList.ts"
        }
      ],
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
      "y": 161,
      "width": 100,
      "height": 300,
      "right": 28,
      "top": 161,
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
      "name": "Sprite",
      "x": 270,
      "y": 22,
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
    }
  ]
}
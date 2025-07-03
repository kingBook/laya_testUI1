{
  "_$ver": 1,
  "_$id": "lx8mwule",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "TestNestedList",
  "width": 640,
  "height": 1136,
  "_$comp": [
    {
      "_$type": "b3006bdc-8697-4f19-9a77-c1e990869f21",
      "scriptPath": "../src/TestNestedList.ts",
      "parentList": {
        "_$ref": "l9rk4o8q"
      }
    }
  ],
  "_$child": [
    {
      "_$id": "ibpi7okb",
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
          "_$id": "l9rk4o8q",
          "_$type": "List",
          "name": "parentList",
          "x": 24,
          "y": 23,
          "width": 592,
          "height": 300,
          "left": 24,
          "right": 24,
          "bgColor": "rgba(72,104,162,0.49019607843137253)",
          "itemTemplate": {
            "_$ref": "k73j6vo5",
            "_$tmpl": "itemRender"
          },
          "repeatX": 9,
          "repeatY": 1,
          "spaceX": 4,
          "scrollType": 1,
          "_$child": [
            {
              "_$id": "k73j6vo5",
              "_$type": "Box",
              "name": "item",
              "width": 62,
              "height": 300,
              "top": 0,
              "bottom": 0,
              "bgColor": "#ffffff",
              "_$child": [
                {
                  "_$id": "l126kc69",
                  "_$type": "List",
                  "name": "subList",
                  "width": 62,
                  "height": 300,
                  "left": 0,
                  "right": 0,
                  "top": 0,
                  "bottom": 0,
                  "itemTemplate": {
                    "_$ref": "xxxi7n4t",
                    "_$tmpl": "itemRender"
                  },
                  "repeatX": 1,
                  "repeatY": 5,
                  "spaceY": 4,
                  "scrollType": 2,
                  "_$child": [
                    {
                      "_$id": "xxxi7n4t",
                      "_$type": "Box",
                      "name": "item",
                      "width": 62,
                      "height": 57,
                      "bgColor": "#a85e5e",
                      "_$child": [
                        {
                          "_$id": "8ivybeb5",
                          "_$type": "Image",
                          "name": "Image",
                          "x": 9,
                          "y": 7,
                          "width": 43,
                          "height": 29,
                          "skin": "res://c13c1b8e-c516-4a0f-98ad-e356f45f0365",
                          "color": "#ffffff"
                        },
                        {
                          "_$id": "d50kc8f3",
                          "_$type": "Label",
                          "name": "labelNum",
                          "y": 31,
                          "width": 62,
                          "height": 26,
                          "text": "Label",
                          "fontSize": 20,
                          "color": "#ffffff",
                          "align": "center",
                          "valign": "middle"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
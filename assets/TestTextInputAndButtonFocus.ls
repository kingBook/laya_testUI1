{
  "_$ver": 1,
  "_$id": "s4ventu4",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "TestTextInputAndButtonFocus",
  "width": 640,
  "height": 1136,
  "_$comp": [
    {
      "_$type": "f54bd358-c198-4052-8e2b-9a38dadabc4a",
      "scriptPath": "../src/TestTextInputAndButtonFocus.ts",
      "textInput": {
        "_$ref": "7dyjktnl"
      },
      "btnGetCode": {
        "_$ref": "z28t340n"
      }
    }
  ],
  "_$child": [
    {
      "_$id": "g10y5x12",
      "_$type": "Label",
      "name": "Label",
      "x": 51,
      "y": 416,
      "width": 481,
      "height": 69,
      "text": "输入文本框不要和按钮重叠，一定要背景重叠，\n可以把背景用另外一张图代替，\n重叠时，会因焦点问题点击不到按钮",
      "fontSize": 20,
      "color": "#ffffff"
    },
    {
      "_$id": "r5yytefd",
      "_$type": "Image",
      "name": "inputBg",
      "x": 229,
      "y": 552,
      "width": 225,
      "height": 50,
      "skin": "res://87262606-4dfe-490e-8644-7fd6496c2be7",
      "color": "#ffffff"
    },
    {
      "_$id": "7dyjktnl",
      "_$type": "TextInput",
      "name": "TextInput",
      "x": 229,
      "y": 552,
      "width": 164,
      "height": 50,
      "hitArea": {
        "_$type": "HitArea"
      },
      "text": "",
      "fontSize": 20,
      "color": "#111111",
      "bgColor": "rgba(255,255,255,0.49019607843137253)",
      "padding": "2,6,2,6",
      "type": "number",
      "restrict": "",
      "prompt": "验证码"
    },
    {
      "_$id": "z28t340n",
      "_$type": "Button",
      "name": "btnGetCode",
      "x": 393,
      "y": 556,
      "width": 50,
      "height": 40,
      "skin": "res://d4cfd6a8-0d0a-475b-ac93-d85eaa646936",
      "label": "获取",
      "labelSize": 20,
      "labelAlign": "center",
      "labelVAlign": "middle"
    },
    {
      "_$id": "juq9gm3p",
      "_$type": "TextInput",
      "name": "TextInput_1",
      "x": 229,
      "y": 613,
      "width": 164,
      "height": 50,
      "hitArea": {
        "_$type": "HitArea"
      },
      "text": "",
      "fontSize": 20,
      "color": "#111111",
      "bgColor": "rgba(255,255,255,0.49019607843137253)",
      "padding": "2,6,2,6",
      "type": "number",
      "restrict": "",
      "prompt": "验证码"
    }
  ]
}
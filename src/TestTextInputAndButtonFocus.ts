const { regClass, property } = Laya;

@regClass()
export class TestTextInputAndButtonFocus extends Laya.Script {

    @property({ type: Laya.TextInput })
    textInput: Laya.TextInput;

    @property({ type: Laya.Button })
    btnGetCode: Laya.Button;


    onAwake(): void {
        Laya.stage.on(Laya.Event.CLICK, (e: Laya.Event) => {
            console.log("name:", e.target.name);

        });


        this.btnGetCode.on(Laya.Event.CLICK, (e: Laya.Event) => {
            console.log("name:", e.target.name);

        });
    }
}
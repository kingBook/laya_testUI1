const { regClass, property } = Laya;

@regClass()
export class DialogBody extends Laya.Script {

    onAwake(): void {
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
        Laya.stage.on("testEvent", this, this.onResize);
    }

    private onResize(): void {

    }

    onKeyDown(evt: Laya.Event): void {
        if (evt.key === 'j') {
            console.log("has1:", Laya.stage.hasListener(Laya.Event.RESIZE));
            console.log("has2:", Laya.stage.hasListener("testEvent"));
        }
    }
}
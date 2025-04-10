const { regClass, property } = Laya;

@regClass()
export class TestButton extends Laya.Script {
    declare owner: Laya.Sprite | Laya.Sprite3D;
    
    onAwake(): void {
        let btn = <Laya.Button>this.owner.getChild("Button");
        btn.on(Laya.Event.CLICK, ()=>{
            console.log("on click");
        });
    }
}
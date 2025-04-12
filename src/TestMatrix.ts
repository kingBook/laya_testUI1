import { MatrixUtil } from "./kingBook/utils/MatrixUtil";

const { regClass, property } = Laya;

@regClass()
export class TestMatrix extends Laya.Script {

    onAwake(): void {
        let btn:Laya.Sprite = this.owner.getChildAt(1);
        let btnO:any=btn;

        console.log(btnO._tfChanged);
        console.log(JSON.stringify(btn.transform));

        let m = MatrixUtil.getMatrix(btn);
        console.log(JSON.stringify(m));

        Laya.stage.on(Laya.Event.CLICK,()=>{
            btn.transform = m;
            console.log("onclick");
        });
       

    }
}
import { Fsm } from "../fsm/Fsm";
import { UIStart } from "./UIStart";

const { regClass, property } = Laya;

/** 管理 UI 的有限状态机 */
@regClass()
export class UIManagerFsm extends Fsm {
    
    onAwake(): void {
        this.addState(UIStart);
        this.init();
        this.changeStateTo(UIStart);
    }

}
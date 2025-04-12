import { UIManagerFsm } from "./UIManagerFsm";

const { regClass, property } = Laya;

/** UI 管理器 */
@regClass()
export class UIManager extends Laya.Script {

    private _fsm: UIManagerFsm;

    /** UI 管理器的实例 */
    public get instance(): UIManager {
        return this;
    }

    /** UI 管理器的状态机 */
    public get fsm(): UIManagerFsm {
        return this._fsm;
    }

    onAwake(): void {
        this._fsm = this.owner.addComponent(UIManagerFsm);
    }
}
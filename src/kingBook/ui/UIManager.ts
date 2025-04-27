import { UIManagerFsm } from "./UIManagerFsm";

const { regClass, property } = Laya;

/** UI 管理器 */
@regClass()
export class UIManager extends Laya.Script {

    private _fsm: UIManagerFsm;
    private static _instance:UIManager;

    /** UI 管理器的实例 */
    public static get instance(): UIManager {
        return UIManager._instance;
    }

    /** UI 管理器的状态机 */
    public get fsm(): UIManagerFsm {
        return this._fsm;
    }

    onAwake(): void {
        UIManager._instance = this;
        this._fsm = this.owner.addComponent(UIManagerFsm);
    }
}
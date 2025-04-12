import { Fsm } from "./Fsm";
import { IState } from "./IState";

const { regClass, property } = Laya;

/** 状态（抽象类） */
@regClass()
export abstract class State extends Laya.Script implements IState {

    public onStateEnter(fsm: Fsm): void {
    }

    public onStateUpdate(fsm: Fsm): void {
    }
    
    public onStateLateUpdate(fsm: Fsm): void {
    }
    
    public onStateExit(fsm: Fsm): void {
    }

}
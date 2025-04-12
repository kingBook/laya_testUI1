import { Fsm } from "../fsm/Fsm";
import { State } from "../fsm/State";
import { StateDefault } from "../fsm/StateDefault";

const { regClass, property } = Laya;

@regClass()
export class UIStart extends State {
    
    public onStateEnter(fsm: Fsm): void {
        console.log("UIStart onStateEnter");
    }

    public onStateUpdate(fsm: Fsm): void {
        
    }

    public onStateExit(fsm: Fsm): void {
        
    }
}
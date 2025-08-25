import { LoopScrollList } from "./kingBook/comps/LoopScrollList";

const { regClass, property } = Laya;

@regClass()
export class TestLoopList extends Laya.Script {

    @property({ type: Laya.List })
    hList: Laya.List;

    onAwake(): void {

        const hListData = [];
        for (let i = 0; i <= 9; i++)hListData.push({ Label: `${i}` });
        this.hList.array = hListData;


        this.hList.getComponent(LoopScrollList).startScroll(-100,0.1);


    }
}
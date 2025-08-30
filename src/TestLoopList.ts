import { LoopScrollList } from "./kingBook/comps/LoopScrollList";

const { regClass, property } = Laya;


@regClass()
export class TestLoopList extends Laya.Script {

    @property({ type: Laya.List })
    hList: Laya.List;

    @property({ type: Laya.List })
    vList: Laya.List;

    onAwake(): void {
        // 水平滚动
        const hListData = [];
        for (let i = 0; i < 5; i++)hListData.push({ Label: `${i}` });
        this.hList.array = hListData;
        this.hList.getComponent(LoopScrollList).init().startScroll(-300, 0.01);

        // 垂直滚动
        /*const vListData = [];
        for (let i = 0; i < 5; i++)vListData.push({ Label: `${i}` });
        this.vList.array = vListData;
        this.vList.getComponent(LoopScrollList).init().startScroll(-100, 0.01);*/

    }

    onKeyDown(evt: Laya.Event): void {
        if (evt.key === 'h') {
            this.hList.getComponent(LoopScrollList).setResult(0);
        }
    }

}
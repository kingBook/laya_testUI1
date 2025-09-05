import { LoopingList } from "./kingBook/comps/LoopingList";

const { regClass, property } = Laya;


@regClass()
export class TestLoopingList extends Laya.Script {

    @property({ type: Laya.List })
    hList: Laya.List;

    @property({ type: Laya.List })
    vList: Laya.List;

    onAwake(): void {
        // 水平滚动
        const hListData = [];
        for (let i = 0; i < 5; i++)hListData.push({ Label: `${i}` });
        this.hList.array = hListData;
        this.hList.getComponent(LoopingList).init().startScrolling((Math.random() > 0.5 ? 1 : -1) * (Math.random()*1000+1000), 0.01);
        //this.hList.getComponent(LoopingList).init().startScrolling(100, 0.01);
        this.hList.renderHandler = new Laya.Handler(this, (cell: Laya.UIComponent, index: number) => {
            const labelIndex = cell.getChild("labelIndex", Laya.Label);
            labelIndex.text = `${index}`;
        });
        // 垂直滚动
        const vListData = [];
        for (let i = 0; i < 5; i++)vListData.push({ Label: `${i}` });
        this.vList.array = vListData;
        //this.vList.getComponent(LoopingList).init().startScroll(-100, 0.01);

    }

    onKeyDown(evt: Laya.Event): void {
        if (evt.key === 'h') {
            const resultIndex = Math.trunc(Math.random() * 5);
            console.log("设置结果", resultIndex);

            this.hList.getComponent(LoopingList).setScrollResult(resultIndex);
        }
    }

}
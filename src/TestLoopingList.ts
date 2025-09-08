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
        this.hList.renderHandler = new Laya.Handler(this, (cell: Laya.UIComponent, index: number) => {
            const labelIndex = cell.getChild("labelIndex", Laya.Label);
            labelIndex.text = `${index}`;
        });
        this.hList.addComponent(LoopingList).init();

        // 垂直滚动
        const vListData = [];
        for (let i = 0; i < 5; i++)vListData.push({ Label: `${i}` });
        this.vList.array = vListData;
        this.vList.renderHandler = new Laya.Handler(this, (cell: Laya.UIComponent, index: number) => {
            const labelIndex = cell.getChild("labelIndex", Laya.Label);
            labelIndex.text = `${index}`;
        });
       // this.vList.addComponent(LoopingList).init();


    }

    onKeyDown(evt: Laya.Event): void {
        if (evt.key === 'h') {
            this.hList.getComponent(LoopingList).startScrolling((Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1000 + 1000), 0.01);
            //this.hList.getComponent(LoopingList).startScrolling(-500, 0.01);

           // this.vList.getComponent(LoopingList).startScrolling((Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1000 + 1000), 0.01);
        } else if (evt.key === 'j') {
            const resultIndex = Math.trunc(Math.random() * 5);
            console.log("设置结果", resultIndex);

            this.hList.getComponent(LoopingList).setScrollResult(resultIndex);
           //// this.vList.getComponent(LoopingList).setScrollResult(resultIndex);
        }
    }

}
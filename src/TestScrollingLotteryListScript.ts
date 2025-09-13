import { ScrollingLotteryListScript } from "./kingBook/comps/ScrollingLotteryListScript";

const { regClass, property } = Laya;


@regClass()
export class TestScrollingLotteryListScript extends Laya.Script {

    @property({ type: Laya.List })
    hList: Laya.List;

    @property({ type: Laya.List })
    vList: Laya.List;

    @property({ type: Laya.List })
    letterList: Laya.List;

    @property({ type: Laya.List })
    numberList: Laya.List;

    onAwake(): void {
        // // 水平滚动
        // const hListData = [];
        // for (let i = 0; i < 5; i++)hListData.push({ Label: `${i}` });
        // this.hList.array = hListData;
        // this.hList.renderHandler = new Laya.Handler(this, (cell: Laya.UIComponent, index: number) => {
        //     const labelIndex = cell.getChild("labelIndex", Laya.Label);
        //     labelIndex.text = `${index}`;
        // });
        // this.hList.addComponent(ScrollingLotteryListScript).init();

        // // 垂直滚动
        // const vListData = [];
        // for (let i = 0; i < 5; i++)vListData.push({ Label: `${i}` });
        // this.vList.array = vListData;
        // this.vList.renderHandler = new Laya.Handler(this, (cell: Laya.UIComponent, index: number) => {
        //     const labelIndex = cell.getChild("labelIndex", Laya.Label);
        //     labelIndex.text = `${index}`;
        // });
        // this.vList.addComponent(ScrollingLotteryListScript).init();


        // 字母
        this.letterList.array = [{ Label: "A" }, { Label: "B" }, { Label: "C" }, { Label: "D" }, { Label: "E" }];
        const letterLottery = this.letterList.addComponent(ScrollingLotteryListScript);
        letterLottery.init();
        // 数字
        // const numberListData = [];
        // for (let i = 0; i <= 9; i++)numberListData.push({ Label: `${i}` });
        // this.numberList.array = numberListData;
        // this.numberList.addComponent(ScrollingLotteryListScript).init();


    }

    onKeyDown(evt: Laya.Event): void {
        if (evt.key === 'h') {
            //this.hList.getComponent(ScrollingLotteryListScript).startScrolling((Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1000 + 1000), 0.01);
            this.hList.getComponent(ScrollingLotteryListScript).startScrolling(100, 0.01);

            //this.vList.getComponent(ScrollingLotteryListScript).startScrolling((Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1000 + 1000), 0.01);
        } else if (evt.key === 'j') {
            const resultIndex = Math.trunc(Math.random() * 5);
            console.log("设置结果", resultIndex);
            this.hList.getComponent(ScrollingLotteryListScript).setResult(resultIndex);

            //this.vList.getComponent(ScrollingLotteryListScript).setResult(resultIndex);
        } else if (evt.key === 'k') {
            const resultIndex = Math.trunc(Math.random() * 5);
            console.log("立即设置到结果处", resultIndex);
            this.hList.getComponent(ScrollingLotteryListScript).setResult(resultIndex, true);

            //this.vList.getComponent(ScrollingLotteryListScript).setResult(resultIndex, true);
        }


        const letterLottery = this.letterList.getComponent(ScrollingLotteryListScript);
        if (evt.key === 'u') {
            //letterLottery.minSpeed = 100;
            //letterLottery.tweenThresholdT = 0.8;
            letterLottery.startScrolling(-100);
        } else if (evt.key === 'i') {
            const resultIndex = 3//Math.trunc(Math.random() * 5);
            console.log("设置结果", resultIndex, this.letterList.array[resultIndex].Label);
            letterLottery.setResult(resultIndex);
        } else if (evt.key === 'o') {
            const resultIndex = Math.trunc(Math.random() * 5);
            console.log("立即设置到结果处", resultIndex, this.letterList.array[resultIndex].Label);
            letterLottery.setResult(resultIndex, true);
        }

        if (evt.key === 'p') {
            letterLottery.setPaused(!letterLottery.isPaused);
        }
    }

}
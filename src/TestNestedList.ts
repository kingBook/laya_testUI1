const { regClass, property } = Laya;

@regClass()
export class TestNestedList extends Laya.Script {

    @property({ type: Laya.List })
    parentList: Laya.List;
    onAwake(): void {
        const parentItemDatas = [];
        for (let m = 0; m < 20; m++) {
            parentItemDatas.push({});
        }
        this.parentList.array = parentItemDatas;

        this.parentList.renderHandler = new Laya.Handler(this, (cell: Laya.UIComponent, index: number) => {
            const subList = cell.getChild("subList", Laya.List);
            //subList.
            const subItemDatas = [];
            const count = (Math.random() * 10 + 1) | 0;
            const displayCount = 5; // 能显示的个数
            const len = Math.max(count, displayCount); // 限制元素的数量最少5个
            for (let i = 0; i < len; i++) {
                const isEmpty = count < displayCount && (i + 1) > count;
                subItemDatas.push({
                    labelNum: `${i} ${isEmpty ? '空' : ''}`,
                    alpha: isEmpty ? 0.5 : 1
                });
            }
            subList.array = subItemDatas.reverse(); // 反向
            subList.scrollTo(subList.array.length - 1); // 滚动到最后一个
        });

    }


}
const { regClass, property } = Laya;

@regClass()
export class LoopScrollList extends Laya.Script {

    declare owner: Laya.List;

    private _isPause: boolean;

    public onEnable(): void {
        this.setPause(true);
    }

    onKeyDown(evt: Laya.Event): void {
        const spaceX = this.owner.spaceX;
        const itemWidth = this.owner.itemRender.data.width;
        const scrollBar = this.owner.scrollBar;

        if (evt.key == 'h') {
            this.owner.addItem(this.owner.getItem(0));
            this.owner.deleteItem(0);
            this.owner.refresh();
            scrollBar.value-=100;

        } else if (evt.key == 'p') {
            this.setPause(!this._isPause);
        }

    }

    public onUpdate(): void {
        // if (this._isPause) return;

        const list = this.owner;

        const scrollBar = this.owner.scrollBar;

        scrollBar.value += 1

        console.log(scrollBar.value);



    }

    /**
     * 开始滚动
     * @param speedTarget 目标速度<像素/秒> (启动时逐渐加速到达的目标速度)
     * @param starAccelerationT 启动加速度系数，范围[0,1]
     */
    public startScroll(speedTarget: number, startupAccelerationT: number = 0.1): void {

        // 取消暂停
        this.setPause(false);

    }

    /** 设置结果 */
    public setResult(): void {

    }

    /** 设置暂停 */
    public setPause(value: boolean): void {
        this._isPause = value;
    }




}
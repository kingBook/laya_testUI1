const { regClass, property } = Laya;

/** 布尔标记 */
enum Flag {
    /** 已初始化 */
    Inited = 1,
    /** 滚动中... */
    Scrolling = 2,
    /** 暂停中... */
    Pauseing = 4
}

/**
 * 循环滚动列表
 */
@regClass()
export class LoopScrollList extends Laya.Script {

    declare owner: Laya.List;


    /** 额外添加的重复列表项数量 */
    private _extraNum: number;


    /** 速度<像素/秒> */
    private _speed: number;
    /** 目标速度的插值，区间为：[0,1] */
    private _speedTargetT: number;

    /** 启动后，逐渐加速最终到达的目标速度<像素/秒> */
    public speedTarget: number;
    /** 启动加速度系数， 区间为：[0,1] */
    public startupAccelerationT: number = 0.1;
    /** 最小速度<像素/秒, 正数> */
    public minSpeed: number = 0.1;
    /** 设置结果后的减速摩擦系数 */
    public frictionOnResult: number = 0.987;

    /** 聚焦点, 值范围:[0,1] */
    public focus: { x: number, y: number } = { x: 0.5, y: 0.5 };

    /** 布尔标记集合 */
    private _flags: number;
    /** 结果索引 */
    private _resultIndex: number;

    /** 初始化 */
    public init(): LoopScrollList {
        this._flags = Flag.Inited;

        this._speed = 0;
        this._speedTargetT = 0;
        this.speedTarget = 0;
        this._resultIndex = NaN;

        const scrollRect = this.owner.content.scrollRect;
        const spaceX = this.owner.spaceX;
        const spaceY = this.owner.spaceY;
        const itemWidth = this.owner.itemRender.data.width;
        const itemHeight = this.owner.itemRender.data.height;
        const scrollType = this.owner.scrollType;

        if (scrollType != Laya.ScrollType.Horizontal && scrollType != Laya.ScrollType.Vertical) {
            throw new Error("使用此组件时, 列表必须是水平或垂直滚动类型");
        }

        // 计算出可视区域能容纳的项数（不超过总项数）
        if (scrollType === Laya.ScrollType.Horizontal) {
            this._extraNum = Math.min((scrollRect.width / (itemWidth + spaceX) + 1) | 0, this.owner.array.length);
        } else {
            this._extraNum = Math.min((scrollRect.height / (itemHeight + spaceY) + 1) | 0, this.owner.array.length);
        }

        // 列表的末尾加入额外项
        for (let i = 0; i < this._extraNum; i++) this.owner.array.push(this.owner.array[i]);

        // 必须设置repeatX、repeatY为列表的数据总个数，否则循环滚动设置 scrollBar.value 回开头或末尾第重复项时，会抖动
        if (scrollType === Laya.ScrollType.Horizontal) {
            this.owner.repeatX = this.owner.array.length;
        } else {
            this.owner.repeatY = this.owner.array.length;
        }

        console.log(`循环列表共${this.owner.array.length}项, 其中${this._extraNum}个额外重复项`);

        // 刷新列表
        this.owner.refresh();
        return this;
    }

    public onUpdate(): void {
        if (this._flags & Flag.Pauseing) return;
        if (!(this._flags & Flag.Scrolling)) return;

        const scrollBar = this.owner.scrollBar;
        const spaceX = this.owner.spaceX;
        const spaceY = this.owner.spaceY;
        const itemWidth = this.owner.itemRender.data.width;
        const itemHeight = this.owner.itemRender.data.height;
        const scrollType = this.owner.scrollType;


        if (!isNaN(this._resultIndex)) { // 设置了结果
            //this._speed = Math.max(this.frictionOnResult * Math.abs(this._speed), this.minSpeed) * Math.sign(this._speed);
            this._speed *= this.frictionOnResult;
            
        } else {
            // 启动速度
            if (this._speedTargetT < 1) {
                this._speedTargetT = Math.min(this._speedTargetT + this.startupAccelerationT, 1);
                this._speed = Laya.MathUtil.lerp(this.minSpeed * Math.sign(this.speedTarget), this.speedTarget, this._speedTargetT);
            }
        }
        console.log("speed:", this._speed);


        // 速度<像素/秒>
        let speedPs = this._speed * Laya.timer.delta * 0.001;

        // 下一个 scrollBar.value
        const nextScrollBarValue = scrollBar.value + speedPs;

        if (speedPs > 0) { // 向左滚动
            if (nextScrollBarValue > scrollBar.max) { // 向左滚动，到尽头
                if (scrollType === Laya.ScrollType.Horizontal) {
                    scrollBar.value = nextScrollBarValue - (spaceX + itemWidth) * (this.owner.array.length - this._extraNum);
                } else {
                    scrollBar.value = nextScrollBarValue - (spaceY + itemHeight) * (this.owner.array.length - this._extraNum);
                }
            }
        } else if (speedPs < 0) { // 向右滚动
            if (nextScrollBarValue < scrollBar.min) { // 向右滚动，到尽头
                this.owner.scrollTo(this.owner.array.length - this._extraNum);
                scrollBar.value -= nextScrollBarValue; // 滚动超出的值
            }
        }

        // 滚动
        scrollBar.value += speedPs;
    }


    /**
     * 开始滚动
     * @param speedTarget 目标速度<像素/秒> (启动时逐渐加速到达的目标速度). * 注意：大于0，列表向左滚动，小于0，列表向右滚动
     * @param starAccelerationT 启动加速度系数，范围[0,1]
     */
    public startScroll(speedTarget: number, startupAccelerationT: number = 0.1): LoopScrollList {
        if ((this._flags & Flag.Inited) === 0) throw new Error(`还未初始化, 不能开始滚动`);

        if (this._flags & Flag.Scrolling) return;
        this._flags |= Flag.Scrolling;

        this._speed = 0;
        this._speedTargetT = 0;
        this._resultIndex = NaN;

        this.speedTarget = speedTarget;
        this.startupAccelerationT = startupAccelerationT;

        // 向右滚动时，立即移动到末尾，重复项的第一项处
        if (this.speedTarget < 0) {
            this.owner.scrollTo(this.owner.array.length - this._extraNum);
        }

        // 取消暂停
        this.setPause(false);
        return this;
    }

    /** 设置结果(列表将停止在结果处) */
    public setResult(index: number): void {
        if ((this._flags & Flag.Inited) === 0) throw new Error(`还未初始化, 不能设置结果`);
        if ((this._flags & Flag.Scrolling) === 0) throw new Error(`未开始滚动，不能设置结果`);

        const inRange = index >= 0 && index < this.owner.array.length - this._extraNum;
        if (!inRange) throw new Error("设置的结果超出范围");

        this._resultIndex = index;
    }

    /** 设置暂停 */
    public setPause(value: boolean): void {
        if (value) this._flags |= Flag.Pauseing;
        else this._flags &= ~Flag.Pauseing;
    }

    /** 停止 */
    public stop(): void {

    }

    public onDestroy(): void {

    }




}
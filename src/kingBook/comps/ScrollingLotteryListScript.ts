const { regClass, property } = Laya;

/** 布尔标记 */
enum Flag {
    /** 已初始化 */
    Inited = 1,
    /** 滚动中... */
    Scrolling = 2,
    /** 暂停中... */
    Paused = 4,
    /** 正在缓动到结果中... */
    TweeningToResult = 8
}

interface ITweeningData {
    /** 缓动到结果开始时焦点下的索引 */
    startFocusedIndex: number;
    /** 缓动到结果时的速度长度 */
    speedAbs: number;
    /** 缓动到结果时的速度符号 */
    speedSign: number;
    /** 到结果的总距离 */
    resultDistance: number;
    /** 到结果的当前距离 */
    distance: number;
}

/**
 * 循环滚动抽奖列表
 */
@regClass()
export class ScrollingLotteryListScript extends Laya.Script {

    declare owner: Laya.List;

    /** 聚集点，范围：[0,1] */
    public focusT = 0.5;
    /** 启动后，逐渐加速最终到达的目标速度<像素/秒> */
    public targetSpeed: number = 1000;
    /** 启动加速度系数， 区间为：[0,1] */
    public startupAccelT: number = 0.1;
    /** 最小速度<像素/秒, 正数> */
    public minSpeed: number = 40;
    /** 用于指定设置了结果后，速度下降到指定的程度（targetSpeed * 此值），开始缓动到结果，范围[0,1] */
    public tweenThresholdT: number = 0.5;
    /** 设置结果后降速摩擦系数 */
    public resultFriction: number = 0.985;
    /** 是否显示 log */
    public isShowLogMsg: boolean = false;

    /** 额外添加的重复列表项数量 */
    private _extraItemNum: number;
    /** 速度<像素/秒> */
    private _speed: number;
    /** 目标速度的插值，区间为：[0,1] */
    private _targetSpeedT: number;
    /** 布尔标记集合 */
    private _flags: number;
    /** 符合结果的索引（因为列表末尾有一些项是重复的，所以符合结果的项可能会有两个, 最多只会有两个, 有可能只有一个，且[1]的值一定比[0]的值大， [0]:原索引, [1]:重复索引） */
    private _resultIndices: number[] = [];

    // 缓动时的数据
    private _tweeningData: ITweeningData;

    private _scrollBar: Laya.ScrollBar;
    private _itemSize: number;
    private _cellSize: number;
    private _focusPos: number;

    /** 初始化 */
    public init(): ScrollingLotteryListScript {
        if (this.owner.scrollType !== Laya.ScrollType.Horizontal && this.owner.scrollType !== Laya.ScrollType.Vertical) {
            throw new Error("使用此组件时, 列表必须是水平或垂直滚动类型");
        }

        this._flags = Flag.Inited;

        this._speed = 0;
        this._targetSpeedT = 0;
        this.targetSpeed = 0;
        this._resultIndices.length = 0;

        const scrollRect = this.owner.content.scrollRect;
        const spaceX = this.owner.spaceX;
        const spaceY = this.owner.spaceY;
        const itemWidth = this.owner.itemRender.data.width;
        const itemHeight = this.owner.itemRender.data.height;
        const scrollType = this.owner.scrollType;
        const cellSize = (scrollType === Laya.ScrollType.Horizontal) ? (itemWidth + spaceX) : (itemHeight + spaceY);

        this._scrollBar = this.owner.scrollBar;
        this._itemSize = (scrollType === Laya.ScrollType.Horizontal) ? itemWidth : itemHeight;
        this._cellSize = cellSize;
        this._focusPos = (scrollType === Laya.ScrollType.Horizontal) ? scrollRect.width * this.focusT : scrollRect.height * this.focusT;

        // 计算出可视区域能容纳的项数（不超过总项数）
        this._extraItemNum = scrollType === Laya.ScrollType.Horizontal
            ? Math.ceil(scrollRect.width / cellSize)
            : Math.ceil(scrollRect.height / cellSize);

        // 列表的末尾加入额外重复项
        const arrayLen = this.owner.array.length;
        for (let i = 0; i < this._extraItemNum; i++) {
            let idx = i % arrayLen;
            this.owner.array.push(this.owner.array[idx]);
        }

        // 必须设置repeatX、repeatY为列表的数据总个数，否则循环滚动设置 scrollBar.value 回开头或末尾第重复项时，会抖动
        (scrollType === Laya.ScrollType.Horizontal)
            ? this.owner.repeatX = this.owner.array.length
            : this.owner.repeatY = this.owner.array.length;

        this.isShowLogMsg && console.log(`循环列表共${this.owner.array.length}项, 其中${this._extraItemNum}个额外重复项`);

        // 刷新列表
        this.owner.refresh();

        this.clearDelay();
        return this;
    }

    public onUpdate(): void {
        if (!(this._flags & Flag.Inited)) return;
        if (this._flags & Flag.Paused) return;
        if (!(this._flags & Flag.Scrolling)) return;

        const deltaTime = Laya.timer.delta * 0.001; // 秒
        const itemCount = this.owner.array.length;

        // 未在缓动到结果索引
        if (!(this._flags & Flag.TweeningToResult)) {
            // 启动速度
            if (this._targetSpeedT < 1) {
                this._targetSpeedT = Math.min(this._targetSpeedT + this.startupAccelT, 1);
                this._speed = Laya.MathUtil.lerp(this.minSpeed * Math.sign(this.targetSpeed), this.targetSpeed, this._targetSpeedT);
            }

            // 设置了结果
            if (this._resultIndices.length > 0) {
                if (Math.abs(this._speed) <= Math.abs(this.targetSpeed * this.tweenThresholdT)) { // 设置了结果，等速度降到一定程度后，才开始缓动到结果
                    // 焦点下的索引
                    const focusedIndex = this.getIndexByScrollBarValue(this._scrollBar.value, true);
                    const speedSign = Math.sign(this._speed);

                    if (speedSign !== 0) {
                        const isFocusIndexEqualToNextIndex = this._resultIndices.find(item => focusedIndex === this.getNextScrollIndex(item, speedSign)) !== undefined;
                        // 焦点下的索引等于下一个索引
                        if (isFocusIndexEqualToNextIndex) {
                            this._flags |= Flag.TweeningToResult;
                            this.isShowLogMsg && console.log("缓动开始 focusedIndex:", focusedIndex);
                            // 缓动数据
                            this._tweeningData = {
                                startFocusedIndex: focusedIndex,
                                speedAbs: Math.abs(this._speed),
                                speedSign: speedSign,
                                resultDistance: this.getTweeningResultDistance(speedSign),
                                distance: 0
                            }
                        }
                    }
                } else {
                    // 降速
                    this._speed *= this.resultFriction;
                }
            }
        }

        // 缓动到结果中...
        if (this._flags & Flag.TweeningToResult) {
            this._tweeningData.distance += Math.abs(this._speed * deltaTime);
            const t = this._tweeningData.distance / this._tweeningData.resultDistance;
            if (t >= 1) {
                //console.log("speedSign:", this._tweeningData.speedSign, "value:", this._scrollBar.value);
                const nearestResultVal = this.getNearestResultScrollBarValue(this._scrollBar.value);
                const sign = this._tweeningData.speedSign;
                const reached = sign > 0
                    ? this._scrollBar.value >= nearestResultVal
                    : this._scrollBar.value <= nearestResultVal;

                if (reached) { // 到达结果处
                    this._scrollBar.value = nearestResultVal;
                    this.stopScrolling();
                } else {
                    this._speed = this.minSpeed * sign;
                }
            } else {
                const speedMax = this._tweeningData.speedAbs * this._tweeningData.speedSign;
                const speedMin = this.minSpeed * this._tweeningData.speedSign;
                this._speed = Laya.MathUtil.lerp(speedMax, speedMin, t);
            }
        }

        if (this._speed !== 0) {
            // 速度<像素/秒>
            let speedPs = this._speed * deltaTime;
            // 下一个 scrollBar.value
            const nextVal = this._scrollBar.value + speedPs;
            if (speedPs > 0) { // 列表向左/上滚动
                if (nextVal > this._scrollBar.max) { // 列表向左/上滚动，到尽头
                    this._scrollBar.value = nextVal - this._cellSize * (itemCount - this._extraItemNum);
                }
            } else if (speedPs < 0) { // 列表向右/下滚动
                if (nextVal < this._scrollBar.min) { // 列表向右/下滚动，到尽头
                    this._scrollBar.value = this.getScrollBarValueByIndex(itemCount - this._extraItemNum) + nextVal;
                }
            }
            // 滚动
            this._scrollBar.value += speedPs;
        }
    }


    /**
     * 开始滚动
     * @param targetSpeed 目标速度<像素/秒> (启动时逐渐加速到达的目标速度)， 默认：1000。 * 注意：大于0，列表向左滚动，小于0，列表向右滚动
     * @param startupAccelT 启动加速度系数， 默认：0.1，范围区间：[0,1]
     */
    public startScrolling(targetSpeed?: number, startupAccelT?: number): ScrollingLotteryListScript {
        if (!(this._flags & Flag.Inited)) throw new Error(`还未初始化, 不能开始滚动`);

        if (this._flags & Flag.Scrolling) return;
        this._flags |= Flag.Scrolling;

        this._speed = 0;
        this._targetSpeedT = 0;
        this._resultIndices.length = 0;

        (!isNaN(targetSpeed)) && (this.targetSpeed = targetSpeed);
        (!isNaN(startupAccelT)) && (this.startupAccelT = startupAccelT);

        // 取消暂停
        this.setPaused(false);
        this.clearDelay();
        return this;
    }

    /** 延时 */
    public async delay(ms: number): Promise<ScrollingLotteryListScript> {
        return new Promise((resolve: (value: ScrollingLotteryListScript) => void) => {
            Laya.timer.once(ms, this, () => {
                resolve(this);
            });
        });
    }

    /** 清除延时 */
    public clearDelay(): void {
        Laya.timer.clearAll(this);
    }

    /**
     * 设置结果(列表将停止在结果处)
     * @param index 未添加重复项前的索引
     * @param isImmediate 是否立即设置，默认：false 慢慢降速停在结果处；true：立即设置到结果处
     */
    public setResult(index: number, isImmediate: boolean = false): ScrollingLotteryListScript {
        if (!(this._flags & Flag.Inited)) throw new Error(`还未初始化, 不能设置结果`);
        if (this._flags & Flag.TweeningToResult) throw new Error(`正在缓动到结果中...，不能设置结果`);
        if (!isImmediate && !(this._flags & Flag.Scrolling)) throw new Error(`不是立即设置时，未开始滚动，不能设置结果`);

        const itemCount = this.owner.array.length; // 加额外重复项的总项数
        const originalItemCount = itemCount - this._extraItemNum; // 原始项数

        const inRange = index >= 0 && index < originalItemCount;
        if (!inRange) throw new Error("设置的结果超出范围");


        // 符合结果的索引
        for (let i = 0, c = Math.ceil(itemCount / originalItemCount); i < c; i++) {
            const idx = i * originalItemCount + index;
            (idx < itemCount) && this._resultIndices.push(idx);
        }

        // 立即设置到结果处
        if (isImmediate) {
            for (let i = 0; i < this._resultIndices.length; i++) {
                const idx = this._resultIndices[i];
                if (this.getItemfocusable(idx)) {
                    this._scrollBar.value = this.getScrollBarValueByIndex(idx, true) - this._focusPos;
                    break;
                }
            }
        }

        // 清除延时
        this.clearDelay();
        return this;
    }

    /** 设置暂停 */
    public setPaused(value: boolean): ScrollingLotteryListScript {
        if (value) this._flags |= Flag.Paused;
        else this._flags &= ~Flag.Paused;
        this.clearDelay();
        return this;
    }

    /** 停止 */
    public stopScrolling(): ScrollingLotteryListScript {
        this._resultIndices.length = 0;
        this._speed = 0;
        this._flags &= ~Flag.TweeningToResult;
        this._flags &= ~Flag.Scrolling;
        this.clearDelay();
        return this;
    }

    public onDisable(): void {
        this.clearDelay();
    }

    public onDestroy(): void {

    }

    /** 指定的列表项能被滚动到焦点处（列表头、尾处的项，就可能滚动不到） */
    private getItemfocusable(index: number): boolean {
        if (!(this._flags & Flag.Inited)) throw new Error(`还未初始化, 不能调用这个方法`);
        const itemScrollBarVal = this.getScrollBarValueByIndex(index, true);
        let ret = itemScrollBarVal >= this._focusPos && itemScrollBarVal <= this._scrollBar.max + this._focusPos;
        return ret;
    }

    /**
     * 根据滚动的方向，获取下一个滚动到的索引
     * @param currentIndex 当前索引, 区间 [0, this.owner.array.length-1]
     * @param speedSign 速度符号，1或-1
     */
    private getNextScrollIndex(currentIndex: number, speedSign: number): number {
        if (Math.abs(speedSign) !== 1) throw new Error(`参数 speedSign 必须是 1 或 -1, 当前为: ${speedSign}`);
        const itemCount = this.owner.array.length;
        let ret = -1;
        if (speedSign > 0) { // 列表向左/上滚动
            ret = currentIndex + 1;
            if (ret >= itemCount) {
                ret = this._extraItemNum;
            }
        } else { // 列表向右/下滚动
            ret = currentIndex - 1;
            if (ret < 0) {
                ret = itemCount - this._extraItemNum - 1;
            }
        }
        if (ret === -1) throw new Error(`无法找到下一个索引, currentIndex:${currentIndex}, speedSign:${speedSign}`);
        return ret;
    }

    /**
     * 获取指定列表项滚动条的值
     * @param i 列表项索引
     * @param isCentral 是否取列表项中间的滚动条值，默认： false 取列表项左/顶在列表可视区左/顶的滚动条值；true：取列表项的中间在列表可视区左/顶的滚动条值
     */
    private getScrollBarValueByIndex(i: number, isCentral: boolean = false): number {
        const itemCount = this.owner.array.length;
        if (i < 0 || i > itemCount - 1) throw new Error(`索引超出范围, i:${i}, itemCount:${itemCount}`);

        let val = i * this._cellSize;
        if (isCentral) val += this._itemSize / 2;
        return val;
    }

    /**
     * 根据滚动条值获取列表项索引
     * @param scrollBarValue 滚动条值
     * @param isFocused 如果 true ，则获取位于焦点下的索引，false 时，则列表可视区域左/上边缘的索引
     * @returns 
     */
    private getIndexByScrollBarValue(scrollBarValue: number, isFocused: boolean): number {
        if (isFocused) scrollBarValue += this._focusPos;
        return Math.trunc(scrollBarValue / this._cellSize);
    }

    /**
     * 根据速度方向、当前滚动条值获取到结果的距离
     */
    private getTweeningResultDistance(speedSign: number): number {
        const originalItemCount = this.owner.array.length - this._extraItemNum;
        const scrollBarValue = this.owner.scrollBar.value;

        let i = this.getIndexByScrollBarValue(scrollBarValue, true);
        const distOffset = this.getScrollBarValueByIndex(i, true) - (scrollBarValue + this._focusPos); // i项中间-可视区中间的偏移量
        const distToResult = this._cellSize * (originalItemCount - 1) + speedSign * distOffset;
        this.isShowLogMsg && console.log("getTweeningResultDistance: distOffset:", distOffset, "distToResult:", distToResult);
        return distToResult;
    }

    /** 获取距离最近的结果的滚动条值 */
    private getNearestResultScrollBarValue(scrollBarValue: number): number {
        const focus = scrollBarValue + this._focusPos;

        let nearestIndex = this._resultIndices[0];
        let nearestValue = this.getScrollBarValueByIndex(nearestIndex, true);
        let minDistance = Math.abs(nearestValue - focus);

        for (let i = 1; i < this._resultIndices.length; i++) {
            const idx = this._resultIndices[i];
            const val = this.getScrollBarValueByIndex(idx, true);
            const dist = Math.abs(val - focus);
            if (dist < minDistance) {
                minDistance = dist;
                nearestIndex = idx;
                nearestValue = val;
            }
        }
        // 滚动条值从焦点处转为从左开始
        nearestValue -= this._focusPos;
        return nearestValue;
    }

}
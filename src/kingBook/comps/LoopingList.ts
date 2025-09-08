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
 * 循环列表
 */
@regClass()
export class LoopingList extends Laya.Script {

    declare owner: Laya.List;

    /** 启动后，逐渐加速最终到达的目标速度<像素/秒> */
    public targetSpeed: number = 100;
    /** 启动加速度系数， 区间为：[0,1] */
    public startupAccelT: number = 0.1;
    /** 最小速度<像素/秒, 正数> */
    public minSpeed: number = 40;

    /** 额外添加的重复列表项数量 */
    private _extraItemNum: number;
    /** 速度<像素/秒> */
    private _speed: number;
    /** 目标速度的插值，区间为：[0,1] */
    private _targetSpeedT: number;
    /** 布尔标记集合 */
    private _flags: number;
    /** 符合结果的索引（因为列表末尾有一些项是重复的，所以符合结果的项可能会有两个, 最多只会有两个, 有可能只有一个，且[1]的值一定比[0]的值大， [0]:原索引, [1]:重复索引） */
    private _resultIndices: number[];
    /** 聚集点，范围：[0,1] */
    private readonly _focus = 0.5;

    // 缓动时的数据
    private _tweeningData: ITweeningData;

    /** 初始化 */
    public init(): LoopingList {
        this._flags = Flag.Inited;

        this._speed = 0;
        this._targetSpeedT = 0;
        this.targetSpeed = 0;
        this._resultIndices ||= [];
        this._resultIndices.length = 0;

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
            this._extraItemNum = Math.min((scrollRect.width / (itemWidth + spaceX) + 1) | 0, this.owner.array.length);
        } else {
            this._extraItemNum = Math.min((scrollRect.height / (itemHeight + spaceY) + 1) | 0, this.owner.array.length);
        }

        // 列表的末尾加入额外项
        for (let i = 0; i < this._extraItemNum; i++) this.owner.array.push(this.owner.array[i]);

        // 必须设置repeatX、repeatY为列表的数据总个数，否则循环滚动设置 scrollBar.value 回开头或末尾第重复项时，会抖动
        if (scrollType === Laya.ScrollType.Horizontal) {
            this.owner.repeatX = this.owner.array.length;
        } else {
            this.owner.repeatY = this.owner.array.length;
        }

        console.log(`循环列表共${this.owner.array.length}项, 其中${this._extraItemNum}个额外重复项`);

        // 刷新列表
        this.owner.refresh();
        return this;
    }

    public onUpdate(): void {
        if (this._flags & Flag.Paused) return;
        if (!(this._flags & Flag.Scrolling)) return;

        const scrollBar = this.owner.scrollBar;
        const spaceX = this.owner.spaceX;
        const spaceY = this.owner.spaceY;
        const itemWidth = this.owner.itemRender.data.width;
        const itemHeight = this.owner.itemRender.data.height;
        const scrollType = this.owner.scrollType;
        const scrollRect = this.owner.content.scrollRect;

        const cellSize = (scrollType === Laya.ScrollType.Horizontal) ? (itemWidth + spaceX) : (itemHeight + spaceY);
        const halfScrollRectSize = (scrollType === Laya.ScrollType.Horizontal) ? (scrollRect.width / 2) : (scrollRect.height / 2);
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
                // 焦点下的索引
                const focusedIndex = this.getIndexByScrollBarValue(scrollBar.value, true);
                const speedSign = Math.sign(this._speed);

                if (speedSign !== 0) {
                    const isFocusIndexEqualToNextIndex = this._resultIndices.find(item => focusedIndex === this.getNextItemIndex(item, speedSign)) !== undefined;
                    // 焦点下的索引等于下一个索引
                    if (isFocusIndexEqualToNextIndex) {
                        this._flags |= Flag.TweeningToResult;
                        console.log("缓动开始 focusedIndex:", focusedIndex);

                        this._tweeningData = {
                            startFocusedIndex: focusedIndex,
                            speedAbs: Math.abs(this._speed),
                            speedSign: speedSign,
                            resultDistance: this.getTweeningResultDistance(speedSign),
                            distance: 0
                        }
                    }
                }
            }
        }

        // 正在缓动到结果索引
        if (this._flags & Flag.TweeningToResult) {
            this._tweeningData.distance += Math.abs(this._speed * deltaTime);
            const t = this._tweeningData.distance / this._tweeningData.resultDistance;
            if (t >= 1) {
                console.log("speedSign:", this._tweeningData.speedSign, "value:", scrollBar.value);
                const nearestResultVal = this.getNearestResultScrollBarValue(scrollBar.value);
                const sign = this._tweeningData.speedSign;
                const reached = sign > 0
                    ? scrollBar.value >= nearestResultVal
                    : scrollBar.value <= nearestResultVal;

                if (reached) {
                    scrollBar.value = nearestResultVal;
                    this._speed = 0;
                    this._flags &= ~Flag.TweeningToResult;
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
            const nextVal = scrollBar.value + speedPs;
            if (speedPs > 0) { // 列表向左/上滚动
                if (nextVal > scrollBar.max) { // 列表向左/上滚动，到尽头
                    scrollBar.value = nextVal - cellSize * (itemCount - this._extraItemNum);
                }
            } else if (speedPs < 0) { // 列表向右/下滚动
                if (nextVal < scrollBar.min) { // 列表向右/下滚动，到尽头
                    scrollBar.value = this.getScrollBarValueByIndex(itemCount - this._extraItemNum) + nextVal;
                }
            }
            // 滚动
            scrollBar.value += speedPs;
        }
    }


    /**
     * 开始滚动
     * @param speedTarget 目标速度<像素/秒> (启动时逐渐加速到达的目标速度). * 注意：大于0，列表向左滚动，小于0，列表向右滚动
     * @param starAccelerationT 启动加速度系数，范围[0,1]
     */
    public startScrolling(speedTarget: number, startupAccelerationT: number = 0.1): LoopingList {
        if (!(this._flags & Flag.Inited)) throw new Error(`还未初始化, 不能开始滚动`);

        if (this._flags & Flag.Scrolling) return;
        this._flags |= Flag.Scrolling;

        this._speed = 0;
        this._targetSpeedT = 0;
        this._resultIndices.length = 0;

        this.targetSpeed = speedTarget;
        this.startupAccelT = startupAccelerationT;

        // 取消暂停
        this.setPaused(false);
        return this;
    }

    /**
     * 设置结果(列表将停止在结果处)
     * @param index 去除重复项，原列表中的索引
     */
    public setScrollResult(index: number): void {
        if (!(this._flags & Flag.Inited)) throw new Error(`还未初始化, 不能设置结果`);
        if (!(this._flags & Flag.Scrolling)) throw new Error(`未开始滚动，不能设置结果`);
        if (this._flags & Flag.TweeningToResult) throw new Error(`正在缓动到结果中...，不能设置结果`);

        const inRange = index >= 0 && index < this.owner.array.length - this._extraItemNum;
        if (!inRange) throw new Error("设置的结果超出范围");

        // 符合结果的索引
        this._resultIndices[0] = index;
        if (this._extraItemNum > 0 && index < this._extraItemNum) {
            // 重复项中，符合结果的索引
            this._resultIndices[1] = this.owner.array.length - this._extraItemNum + index;
        }
        //console.log(`设置结果，符合结果的索引有：${this._resultIndices[0]}, ${this._resultIndices.length > 1 ? this._resultIndices[1] : '-'}`);
    }

    /** 设置暂停 */
    public setPaused(value: boolean): void {
        if (value) this._flags |= Flag.Paused;
        else this._flags &= ~Flag.Paused;
    }

    /** 停止 */
    public stopScrolling(): void {
        this._flags &= ~Flag.Scrolling;
    }

    public onDestroy(): void {

    }

    // /** 指定的列表项能被滚动到焦点处（列表头、尾处的项，就可能滚动不到中间） */
    // private getItemfocusable(index: number): boolean {
    //     const scrollBar = this.owner.scrollBar;
    //     const scrollRect = this.owner.content.scrollRect;
    //     const scrollType = this.owner.scrollType;
    //     const halfScrollRectSize = scrollType === Laya.ScrollType.Horizontal ? scrollRect.width / 2 : scrollRect.height / 2;
    //     const itemScrollBarVal = this.getScrollBarValueByIndex(index, true);
    //     let ret = itemScrollBarVal > halfScrollRectSize && itemScrollBarVal < scrollBar.max + halfScrollRectSize;
    //     return ret;
    // }

    /**
     * 根据速度的方向，获取当前索引的下一个索引
     * @param currentIndex 当前索引
     * @param speedSign 速度符号，1或-1
     */
    private getNextItemIndex(currentIndex: number, speedSign: number): number {
        if (Math.abs(speedSign) !== 1) throw new Error(`参数 speedSign 必须是 1 或 -1, 当前为: ${speedSign}`);
        const itemCount = this.owner.array.length;
        let ret = -1;
        if (speedSign > 0) { // 列表向左滚动
            ret = currentIndex + 1;
            if (ret >= itemCount) {
                ret = this._extraItemNum;
            }
        } else { // 列表向右滚动
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
     * @param isCentral 是否取列表项中间的滚动条值，默认为 false, 取列表项左或顶的滚动条值
     */
    private getScrollBarValueByIndex(i: number, isCentral: boolean = false): number {
        const itemCount = this.owner.array.length;
        if (i < 0 || i > itemCount - 1) throw new Error(`索引超出范围, i:${i}, itemCount:${itemCount}`);
        const spaceX = this.owner.spaceX;
        const spaceY = this.owner.spaceY;
        const itemWidth = this.owner.itemRender.data.width;
        const itemHeight = this.owner.itemRender.data.height;
        const scrollType = this.owner.scrollType;
        const cellSize = (scrollType === Laya.ScrollType.Horizontal) ? (itemWidth + spaceX) : (itemHeight + spaceY);
        const halfItemSize = (scrollType === Laya.ScrollType.Horizontal) ? (itemWidth / 2) : (itemHeight / 2);

        let val = i * cellSize;
        if (isCentral) val += halfItemSize;
        return val;
    }

    /**
     * 根据滚动条值获取列表项索引
     * @param scrollBarValue 滚动条值
     * @param focus 如果 true ，则获取位于焦点下的索引，false 时，则列表可视区域左/上边缘的索引
     * @returns 
     */
    private getIndexByScrollBarValue(scrollBarValue: number, focus: boolean): number {
        const spaceX = this.owner.spaceX;
        const spaceY = this.owner.spaceY;
        const itemWidth = this.owner.itemRender.data.width;
        const itemHeight = this.owner.itemRender.data.height;
        const scrollType = this.owner.scrollType;
        const scrollRect = this.owner.content.scrollRect;
        const cellSize = (scrollType === Laya.ScrollType.Horizontal) ? (itemWidth + spaceX) : (itemHeight + spaceY);

        if (focus) {
            const focusPos = (scrollType === Laya.ScrollType.Horizontal) ? scrollRect.width * this._focus : scrollRect.height * this._focus;
            scrollBarValue += focusPos;
        }
        return Math.trunc(scrollBarValue / cellSize);
    }

    /**
     * 根据速度方向、当前滚动条值获取到结果的距离
     */
    private getTweeningResultDistance(speedSign: number): number {
        const oldItemCount = this.owner.array.length - this._extraItemNum;
        const spaceX = this.owner.spaceX;
        const spaceY = this.owner.spaceY;
        const itemWidth = this.owner.itemRender.data.width;
        const itemHeight = this.owner.itemRender.data.height;
        const scrollType = this.owner.scrollType;
        const scrollRect = this.owner.content.scrollRect;
        const cellSize = (scrollType === Laya.ScrollType.Horizontal) ? (itemWidth + spaceX) : (itemHeight + spaceY);
        const halfScrollRectSize = scrollType === Laya.ScrollType.Horizontal ? scrollRect.width / 2 : scrollRect.height / 2;
        const scrollBarValue = this.owner.scrollBar.value;

        let i = this.getIndexByScrollBarValue(scrollBarValue, true);
        const distanceOffset = this.getScrollBarValueByIndex(i, true) - (scrollBarValue + halfScrollRectSize); // i项中间-可视区中间的偏移量
        const distanceToResult = cellSize * (oldItemCount - 1) + speedSign * distanceOffset;
        console.log("getTweeningResultDistance: distanceOffset:", distanceOffset, "distanceToResult:", distanceToResult);
        return distanceToResult;
    }

    /** 获取距离最近的结果的滚动条值 */
    private getNearestResultScrollBarValue(scrollBarValue: number): number {
        const scrollType = this.owner.scrollType;
        const scrollRect = this.owner.content.scrollRect;
        const halfScrollRectSize = (scrollType === Laya.ScrollType.Horizontal) ? (scrollRect.width / 2) : (scrollRect.height / 2);
        const centerValue = scrollBarValue + halfScrollRectSize;

        let nearestIndex = this._resultIndices[0];
        let nearestValue = this.getScrollBarValueByIndex(nearestIndex, true);
        let minDistance = Math.abs(nearestValue - centerValue);

        for (let i = 1; i < this._resultIndices.length; i++) {
            const idx = this._resultIndices[i];
            const val = this.getScrollBarValueByIndex(idx, true);
            const dist = Math.abs(val - centerValue);
            if (dist < minDistance) {
                minDistance = dist;
                nearestIndex = idx;
                nearestValue = val;
            }
        }

        nearestValue -= halfScrollRectSize;
        return nearestValue;
    }

}
const { regClass, property } = Laya;

/** 布尔标记 */
enum LoopScrollListFlag {
    /** 已初始化 */
    Inited = 1,
    /** 滚动中... */
    Scrolling = 2,
    /** 暂停中... */
    Paused = 4,
    /** 正在缓动到结果索引 */
    TweeningToResult = 8
}

interface ITweeningData {
    /** 缓动到的结果索引 */
    resultIndex: number;
    /** 缓动到结果开始时焦点下的索引 */
    startFocusedIndex: number;
    /** 缓动到结果时的速度长度 */
    speedAbs: number;
    /** 缓动到结果时的速度符号 */
    speedSign: number;
    /** 缓动到结果开始时滚动条的值 */
    startScrollBarValue: number;
    /** 结果项滚动条值 */
    resultScrollBarValue: number;
    /** 虚拟的结果项滚动条值（此值并不一定是滚动条真实的值，主要用于和startScrollBarValue计算出到达结果项的插值）*/
    virtualResultScrollBarValue: number;
}

/**
 * 循环滚动列表
 */
@regClass()
export class LoopScrollList extends Laya.Script {

    declare owner: Laya.List;

    /** 启动后，逐渐加速最终到达的目标速度<像素/秒> */
    public targetSpeed: number;
    /** 启动加速度系数， 区间为：[0,1] */
    public startupAccelT: number = 0.1;
    /** 最小速度<像素/秒, 正数> */
    public minSpeed: number = 0.1;
    ///** 设置结果后的减速摩擦系数 */
    //public resultFriction: number = 0.987;

    /** 额外添加的重复列表项数量 */
    private _extraItemNum: number;
    /** 速度<像素/秒> */
    private _speed: number;
    /** 目标速度的插值，区间为：[0,1] */
    private _targetSpeedT: number;
    /** 布尔标记集合 */
    private _flags: number;
    /** 符合结果的索引（因为列表末尾有一些项是重复的，所以符合结果的项可能会有两个, 最多只会有两个, 有可能只有一个，且[1]的值一定比[0]的值大， [0]:原索引, [1]:重复索引） */
    private _resultItemIndices: number[];
    // 缓动时的数据
    private _tweeningData: ITweeningData;
    /** 聚集点，范围：[0,1] */
    private readonly _focusPoint = { x: 0.5, y: 0.5 };

    /** 初始化 */
    public init(): LoopScrollList {
        this._flags = LoopScrollListFlag.Inited;

        this._speed = 0;
        this._targetSpeedT = 0;
        this.targetSpeed = 0;
        this._resultItemIndices ||= [];
        this._resultItemIndices.length = 0;

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
        if (this._flags & LoopScrollListFlag.Paused) return;
        if (!(this._flags & LoopScrollListFlag.Scrolling)) return;

        const scrollBar = this.owner.scrollBar;
        const spaceX = this.owner.spaceX;
        const spaceY = this.owner.spaceY;
        const itemWidth = this.owner.itemRender.data.width;
        const itemHeight = this.owner.itemRender.data.height;
        const scrollType = this.owner.scrollType;
        const scrollRect = this.owner.content.scrollRect;

        const deltaTime = Laya.timer.delta / 1000; // 秒
        const itemCount = this.owner.array.length;



        // 启动速度
        if (this._targetSpeedT < 1) {
            this._targetSpeedT = Math.min(this._targetSpeedT + this.startupAccelT, 1);
            this._speed = Laya.MathUtil.lerp(this.minSpeed * Math.sign(this.targetSpeed), this.targetSpeed, this._targetSpeedT);
        }

        // 速度<像素/秒>
        let speedPs = this._speed * deltaTime;
        // 下一个 scrollBar.value
        const nextScrollBarValue = scrollBar.value + speedPs;

        // 未在缓动到结果索引
        if ((this._flags & LoopScrollListFlag.TweeningToResult) === 0) {
            // 设置了结果
            if (this._resultItemIndices.length > 0) {
                // 焦点下的索引
                const focusedIndex = this.getFocusedItemIndex();
                const speedSign = Math.sign(this._speed);

                if (this._speed > 0) { // 列表向左滚动
                    const isFocusIndexEqualToNextIndex = this._resultItemIndices.find(item => focusedIndex === this.getNextItemIndex(item, speedSign)) !== undefined;
                    // 焦点下的索引等于下一个索引
                    if (isFocusIndexEqualToNextIndex) {
                        this._flags |= LoopScrollListFlag.TweeningToResult;
                        const resultIndex = this.getTweenToResultIndex(focusedIndex, speedSign);
                        console.log("resultIndex", resultIndex, "focusedIndex", focusedIndex);

                        /*if (focusedIndex === resultIndex) throw new Error(`焦点下的项不能等于结果项, focusedIndex:${focusedIndex}, resultIndex:${resultIndex}`);
                        this._tweeningData = {
                            resultIndex: resultIndex,
                            startFocusedIndex: focusedIndex,
                            speedAbs: Math.abs(this._speed),
                            speedSign: speedSign,
                            startScrollBarValue: scrollBar.value,
                            resultScrollBarValue: this.getScrollBarValueByIndex(resultIndex, true),
                            virtualResultScrollBarValue: this.getVirtualResultScrollBarValue(focusedIndex, resultIndex, scrollBar.value, speedSign)
                        };
                        console.log(`开始缓动到结果索引`, scrollBar.value);*/
                    }
                } else if (this._speed < 0) { // 列表向右滚动
                    /*const isFocusIndexEqualToNextIndex = this._resultItemIndices.find(item => focusedIndex === this.getNextItemIndex(item, speedSign)) !== undefined;
                    // 焦点下的索引等于下一个索引
                    if (isFocusIndexEqualToNextIndex) {
                        this._flags |= LoopScrollListFlag.TweeningToResult;
                        const resultIndex = this.getTweenToResultIndex(focusedIndex, speedSign);
                        if (focusedIndex === resultIndex) throw new Error(`焦点下的项不能等于结果项, focusedIndex:${focusedIndex}, resultIndex:${resultIndex}`);
                        this._tweeningData = {
                            resultIndex: resultIndex,
                            startFocusedIndex: focusedIndex,
                            speedAbs: Math.abs(this._speed),
                            speedSign: speedSign,
                            startScrollBarValue: scrollBar.value,
                            resultScrollBarValue: this.getScrollBarValueByIndex(resultIndex, true),
                            virtualResultScrollBarValue: this.getVirtualResultScrollBarValue(focusedIndex, resultIndex, scrollBar.value, speedSign)
                        };
                        console.log(`开始缓动到结果索引`, scrollBar.value);
                    }*/
                }
            }
        }

        // 正在缓动到结果索引
        if (this._flags & LoopScrollListFlag.TweeningToResult) {
            //test
            this._speed = 0;
            speedPs = 0;
            console.log("scrollBar.value:", scrollBar.value);

            /*if (this._tweeningData.speedSign > 0) { // 列表向左滚动
                const t = this.getTweenTargetT(this._tweeningData, scrollBar.value);
                console.log(`正在缓动到结果索引, t:${t}`);
                if (t >= 0) {
                    this._speed = 0;
                    speedPs = 0;
                    scrollBar.value = this._tweeningData.resultScrollBarValue;
                } else {
                    this._speed = Laya.MathUtil.lerp(this._tweeningData.speedAbs, this.minSpeed, t) * this._tweeningData.speedSign;
                }
            } else if (this._tweeningData.speedSign < 0) { // 列表向右滚动
                const t = this.getTweenTargetT(this._tweeningData, scrollBar.value);
                console.log(`正在缓动到结果索引, t:${t}`);
                if (t >= 0) {
                    this._speed = 0;
                    speedPs = 0;
                    scrollBar.value = this._tweeningData.resultScrollBarValue;
                } else {
                    this._speed = Laya.MathUtil.lerp(this._tweeningData.speedAbs, this.minSpeed, t) * this._tweeningData.speedSign;
                }
            }*/
        }

        if (speedPs > 0) { // 列表向左滚动
            if (nextScrollBarValue > scrollBar.max) { // 列表向左滚动，到尽头
                if (scrollType === Laya.ScrollType.Horizontal) {
                    scrollBar.value = nextScrollBarValue - (spaceX + itemWidth) * (itemCount - this._extraItemNum);
                } else {
                    scrollBar.value = nextScrollBarValue - (spaceY + itemHeight) * (itemCount - this._extraItemNum);
                }
            }
        } else if (speedPs < 0) { // 列表向右滚动
            if (nextScrollBarValue < scrollBar.min) { // 列表向右滚动，到尽头
                this.owner.scrollTo(itemCount - this._extraItemNum);
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
    public startScrolling(speedTarget: number, startupAccelerationT: number = 0.1): LoopScrollList {
        if ((this._flags & LoopScrollListFlag.Inited) === 0) throw new Error(`还未初始化, 不能开始滚动`);

        if (this._flags & LoopScrollListFlag.Scrolling) return;
        this._flags |= LoopScrollListFlag.Scrolling;

        this._speed = 0;
        this._targetSpeedT = 0;
        this._resultItemIndices.length = 0;

        this.targetSpeed = speedTarget;
        this.startupAccelT = startupAccelerationT;

        // 向右滚动时，立即移动到末尾，重复项的第一项处
        if (this.targetSpeed < 0) {
            this.owner.scrollTo(this.owner.array.length - this._extraItemNum);
        }

        // 取消暂停
        this.setPaused(false);
        return this;
    }

    /**
     * 设置结果(列表将停止在结果处)
     * @param index 去除重复项，原列表中的索引
     */
    public setScrollResult(index: number): void {
        if ((this._flags & LoopScrollListFlag.Inited) === 0) throw new Error(`还未初始化, 不能设置结果`);
        if ((this._flags & LoopScrollListFlag.Scrolling) === 0) throw new Error(`未开始滚动，不能设置结果`);

        const inRange = index >= 0 && index < this.owner.array.length - this._extraItemNum;
        if (!inRange) throw new Error("设置的结果超出范围");

        // 符合结果的索引
        this._resultItemIndices[0] = index;
        if (this._extraItemNum > 0 && index < this._extraItemNum) {
            // 重复项中，符合结果的索引
            this._resultItemIndices[1] = this.owner.array.length - this._extraItemNum + index;
        }
        console.log(`设置结果，符合结果的索引有：${this._resultItemIndices[0]}, ${this._resultItemIndices.length > 1 ? this._resultItemIndices[1] : '-'}`);
    }

    /** 设置暂停 */
    public setPaused(value: boolean): void {
        if (value) this._flags |= LoopScrollListFlag.Paused;
        else this._flags &= ~LoopScrollListFlag.Paused;
    }

    /** 停止 */
    public stopScrolling(): void {

    }

    public onDestroy(): void {

    }

    /**
     * 查找焦点下的列表项索引
     * @returns 返回列表项索引，未能找到时返回 -1 (可能焦点下处于列表项间隙)
     */
    private getFocusedItemIndex(): number {
        const scrollBar = this.owner.scrollBar;
        const spaceX = this.owner.spaceX;
        const spaceY = this.owner.spaceY;
        const itemWidth = this.owner.itemRender.data.width;
        const itemHeight = this.owner.itemRender.data.height;
        const scrollType = this.owner.scrollType;
        const scrollRect = this.owner.content.scrollRect;

        const scrollBarValue = scrollBar.value;
        const focusX = scrollRect.width * this._focusPoint.x;
        const focusY = scrollRect.height * this._focusPoint.y;
        const itemCount = this.owner.array.length;

        let i: number;
        let min: number, max: number; // 列表项矩形的范围的[min,max]
        let ret: number = -1; // 查找结果

        for (i = 0; i < itemCount; i++) {
            if (scrollType === Laya.ScrollType.Horizontal) {
                min = i * (itemWidth + spaceX) - focusX;
                max = min + itemWidth;
            } else {
                min = i * (itemHeight + spaceY) - focusY;
                max = min + itemHeight;
            }
            if (scrollBarValue >= min && scrollBarValue <= max) {
                ret = i;
                break;
            }
        }
        return ret;
    }

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
     * @param isCenter 是否取列表项中间的滚动条值，默认为 false, 取列表项左或顶的滚动条值
     */
    private getScrollBarValueByIndex(i: number, isCenter: boolean = false): number {
        const itemCount = this.owner.array.length;
        if (i < 0 || i > itemCount - 1) throw new Error(`索引超出范围, i:${i}, itemCount:${itemCount}`);
        const spaceX = this.owner.spaceX;
        const spaceY = this.owner.spaceY;
        const itemWidth = this.owner.itemRender.data.width;
        const itemHeight = this.owner.itemRender.data.height;
        const scrollType = this.owner.scrollType;

        let val = NaN;
        if (scrollType === Laya.ScrollType.Horizontal) {
            val = i * (itemWidth + spaceX);
            if (isCenter) val += itemWidth / 2;
        } else {
            val = i * (itemHeight + spaceY);
            if (isCenter) val += itemHeight / 2;
        }
        return val;
    }

    /**
     * 虚拟的结果项滚动条值（此值并不一定是滚动条真实的值，主要用于和startScrollBarValue计算出到达结果项的插值, 
     * speedSign 大于 0 时： 返回的值一定大于 scrollBarValue； 
     * speedSign 小于 0 时： 返回的值一定小于 scrollBarValue）
     */
    private getVirtualResultScrollBarValue(focusedIndex: number, resultIndex: number, scrollBarValue: number, speedSign: number): number {
        const itemCount = this.owner.array.length;
        const scrollBar = this.owner.scrollBar;
        let val = NaN;
        if (speedSign > 0) { // 列表向左滚动
            if (resultIndex > focusedIndex) {
                val = this.getScrollBarValueByIndex(resultIndex, true);
            } else if (resultIndex < focusedIndex) {
                val = scrollBar.max + this.getScrollBarValueByIndex(resultIndex, true);
            }
        } else { // 列表向右滚动
            if (resultIndex < focusedIndex) {
                val = this.getScrollBarValueByIndex(resultIndex, true);
            } else {
                val = 0 - (scrollBar.max - this.getScrollBarValueByIndex(resultIndex, true));
            }
        }
        if (isNaN(val)) throw new Error(`获取结果项滚动条值失败, focusedIndex:${focusedIndex}, resultIndex:${resultIndex}, scrollBarValue:${scrollBarValue}, speedSign:${speedSign}`);
        return val;
    }


    /*private getVirtualScrollBarValue(scrollBarValue: number): number {

    }*/

    /**
     * 指定列表项能否被滚动到焦点
     * @param index list.array 中的索引
     */
    private canScrollToFocus(index: number): boolean {
        const scrollBar = this.owner.scrollBar;
        const spaceX = this.owner.spaceX;
        const spaceY = this.owner.spaceY;
        const itemWidth = this.owner.itemRender.data.width;
        const itemHeight = this.owner.itemRender.data.height;
        const scrollType = this.owner.scrollType;
        const scrollRect = this.owner.content.scrollRect;

        const scrollBarValue = scrollBar.value;
        const focusX = scrollRect.width * this._focusPoint.x;
        const focusY = scrollRect.height * this._focusPoint.y;
        const itemCount = this.owner.array.length;

        const itemScrollBarValue = this.getScrollBarValueByIndex(index, true);
        let ret=false;
        if (scrollType === Laya.ScrollType.Horizontal) {
            
        } else {

        }
        return ret;
    }

    /**
     * 获取缓动到的结果索引
     * @param focusedIndex 焦点下的索引
     * @param speedSign 速度符号，1或-1
     */
    private getTweenToResultIndex(focusedIndex: number, speedSign: number): number {
        let ret = -1;
        if (this._resultItemIndices.length > 1) {
            const i0 = this._resultItemIndices[0];
            const i1 = this._resultItemIndices[1];
            console.log("i0", i0, "i1", i1, "focusedIndex", focusedIndex, "speedSign", speedSign);

            if (speedSign > 0) { // 列表向左滚动
                ret = i1 >= focusedIndex ? i1 : i0;
            } else { // 列表向右滚动
                ret = i0 <= focusedIndex ? i0 : i1;
            }
        } else {
            ret = this._resultItemIndices[0];
        }
        if (ret === -1) throw new Error(`无法找到缓动的目标索引, focusedIndex:${focusedIndex}, speedSign:${speedSign}`);
        return ret;
    }

    /**
     * 获取缓动到目标索引的插值
     * @param tweeningData 缓动时的数据
     * @param scrollBarValue 滚动条i当前的值
     */
    private getTweenTargetT(tweeningData: ITweeningData, scrollBarValue: number): number {
        const scrollBar = this.owner.scrollBar;
        const scrollRect = this.owner.content.scrollRect;
        const scrollType = this.owner.scrollType;

        let t: number = 0;
        if (tweeningData.speedSign > 0) { // 列表向左滚动
            if (tweeningData.resultIndex > tweeningData.startFocusedIndex) { //左焦点项，右结果项

                const canReachedScrollToEnd = scrollType === Laya.ScrollType.Horizontal
                    ? (scrollBar.max - tweeningData.resultScrollBarValue) > (scrollRect.width * (1 - this._focusPoint.x))
                    : (scrollBar.max - tweeningData.resultScrollBarValue) > (scrollRect.height * (1 - this._focusPoint.y));

                if (canReachedScrollToEnd) { // 如果滚动到末尾能到达时
                    t = scrollBarValue / tweeningData.resultScrollBarValue;
                } else {

                }
            } else { // 左结果项，右焦点项
                //if(scrollBarValue>tweeningData.resultScrollBarValue)
                //t = scrollBarValue / (scrollBar.max + tweeningData.resultScrollBarValue);
            }
        } else { // 列表向右滚动

        }
        return t;
    }




}
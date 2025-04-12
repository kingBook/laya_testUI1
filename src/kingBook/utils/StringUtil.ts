export class StringUtil {

    /**
     * 获取秒转换为 xx:xx 的时钟形式字符
     * @param	second 秒数
     * @param	isHour 默认 false, 如果 true 那么转换为 xx:xx:xx 形式否则 xx:xx 形式
     * @return
     */
    public static getClockString(second: number, isHour: boolean = false): string {
        var result: string;
        if (isHour) {
            const hour = (second / 60 / 60) | 0;
            const minute = (second / 60 - hour * 60) | 0;
            const tempSecond = (second - hour * 60 * 60 - minute * 60) | 0;
            result = (hour < 10 ? "0" + hour : hour) + ":"
                + (minute < 10 ? "0" + minute : minute) + ":"
                + (tempSecond < 10 ? "0" + tempSecond : tempSecond);
        } else {
            const minute = (second / 60) | 0;
            const tempSecond = (second - minute * 60) | 0;
            result = (minute < 10 ? "0" + minute : minute) + ":"
                + (tempSecond < 10 ? "0" + tempSecond : tempSecond);
        }
        return result;
    }
}



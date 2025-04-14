export class MathUtil {

    public static readonly epsilon: number = 0.000001;
    public static readonly rad2Deg: number = 180.0 / Math.PI;
    public static readonly deg2Rad: number = Math.PI / 180.0;

    /** 返回 f 的符号 */
    public static sign(f: number): number {
        return f >= 0 ? 1 : -1;
    }

    /** 在给定的最小浮点值和最大浮点值之间钳制给定值。如果在最小和最大范围内，则返回给定值 */
    public static clamp(val: number, min: number, max: number): number {
        if (min > max) {
            const temp = min;
            min = max;
            max = temp;
        }
        return val < min ? min : val > max ? max : val;
    }

    /** 将值限制在 0 与 1 之间并返回值 */
    public static clamp01(val: number): number {
        return val < 0 ? 0 : val > 1 ? 1 : val;
    }

    /** 在 a 与 b 之间按 t 进行线性插值 */
    public static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * MathUtil.clamp01(t);
    }


    /** 在 a 与 b 之间按 t 进行线性插值，t 没有限制 */
    public static lerpUnclamped(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    /** 与 lerp 相同，但是在值环绕 360 度时确保值正确插入 */
    public static LerpAngle(a: number, b: number, t: number): number {
        let delta: number = MathUtil.repeat((b - a), 360);
        if (delta > 180)
            delta -= 360;
        return a + delta * MathUtil.clamp01(t);
    }

    /** 将值 current 向 target 靠近 */
    public static moveTowards(current: number, target: number, maxDelta: number): number {
        if (Math.abs(target - current) <= maxDelta)
            return target;
        return current + MathUtil.sign(target - current) * maxDelta;
    }

    /** 与 moveTowards 相同，但是在值环绕 360 度时确保值正确插入 */
    public static moveTowardsAngle(current: number, target: number, maxDelta: number): number {
        let deltaAngle: number = MathUtil.deltaAngle(current, target);
        if (-maxDelta < deltaAngle && deltaAngle < maxDelta)
            return target;
        target = current + deltaAngle;
        return MathUtil.moveTowards(current, target, maxDelta);
    }

    /** 在 min 与 max 之间进行插值，在限制处进行平滑 */
    public static smoothStep(from: number, to: number, t: number): number {
        t = MathUtil.clamp01(t);
        t = -2.0 * t * t * t + 3.0 * t * t;
        return to * t + from * (1 - t);
    }

    public static gamma(value: number, absmax: number, gamma: number): number {
        let negative: boolean = value < 0;
        let absval: number = Math.abs(value);
        if (absval > absmax)
            return negative ? -absval : absval;

        let result: number = Math.pow(absval / absmax, gamma) * absmax;
        return negative ? -result : result;
    }

    /** 比较两个浮点值，如果它们相似，则返回 true */
    public static approximately(a: number, b: number): boolean {
        //如果a或b为零，则比较另一个是否小于或等于epsilon。
        //如果a和b都不为0，则找到一个a和b最大值的数字与epsilon比较。
        //浮点大约有7位有效数字，所以
        //1.000001f可以表示，而1.0000001f四舍五入为零，
        //因此，我们可以使用0.000001f的epsilon来比较接近1的值。
        //我们将这个ε乘以a和b的最大值。
        return Math.abs(b - a) < Math.max(0.000001 * Math.max(Math.abs(a), Math.abs(b)), MathUtil.epsilon * 8);
    }


    /** 对值 t 进行循环，使它不会大于长度，并且不会小于 0 */
    public static repeat(t: number, length: number): number {
        return MathUtil.clamp(t - Math.floor(t / length) * length, 0.0, length);
    }

    /** pingPong 返回一个值，该值将在值 0 与 length 之间递增和递减 */
    public static pingPong(t: number, length: number): number {
        t = MathUtil.repeat(t, length * 2);
        return length - Math.abs(t - length);
    }

    /** 计算在范围 [a, b] 内生成插值 value 的线性参数 t */
    public static inverseLerp(a: number, b: number, value: number): number {
        if (a != b)
            return MathUtil.clamp01((value - a) / (b - a));
        else
            return 0.0;
    }

    /** 计算两个给定角度（以度为单位给定）之间的最短差异。 */
    public static deltaAngle(current: number, target: number): number {
        let delta: number = MathUtil.repeat((target - current), 360.0);
        if (delta > 180.0)
            delta -= 360.0;
        return delta;
    }

    /**
     * 返回大于或等于参数的下一个 2 的幂
     * @param value 整数，如果传入浮点数则自动取整
     * @returns 
     */
    public static nextPowerOfTwo(value: number): number {
        value = value | 0;

        value -= 1;
        value |= value >> 16;
        value |= value >> 8;
        value |= value >> 4;
        value |= value >> 2;
        value |= value >> 1;
        return value + 1;
    }

    /**
     * 返回最接近的 2 的幂值。
     * @param value 整数，如果传入浮点数则自动取整
     * @returns 
     */
    public static closestPowerOfTwo(value: number): number {
        value = value | 0;

        let nextPower: number = MathUtil.nextPowerOfTwo(value);
        let prevPower: number = nextPower >> 1;
        if (value - prevPower < nextPower - value)

            return prevPower;
        else
            return nextPower;
    }

    /**
     * 如果值是 2 的幂，则返回 true
     * @param value 整数，如果传入浮点数则自动取整
     * @returns 
     */
    public static isPowerOfTwo(value: number): boolean {
        value = value | 0;
        return (value & (value - 1)) == 0;
    }
    
}
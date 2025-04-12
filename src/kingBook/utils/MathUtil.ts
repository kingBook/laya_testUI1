export class MathUtil {

    public static readonly EPSILON = 0.000001;
    public static readonly rad2Deg = 180.0 / Math.PI;
    public static readonly deg2Rad = Math.PI / 180.0;

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


    /** 对值 t 进行循环，使它不会大于长度，并且不会小于 0 */
    public static repeat(t: number, length: number): number {
        return MathUtil.clamp(t - Math.floor(t / length) * length, 0.0, length);
    }





}
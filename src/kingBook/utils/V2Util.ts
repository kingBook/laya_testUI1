import { MathUtil } from "./MathUtil";

export class V2Util {

    /** 向量加法 */
    public static add<T extends Laya.IV2>(out: T, a: T, b: T): T {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
    }

    /** 向量减法 */
    public static subtract<T extends Laya.IV2>(out: T, a: T, b: T): T {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    }

    /** 向量乘法 */
    public static multiply<T extends Laya.IV2>(out: T, a: T, b: T): T {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        return out;
    }

    /** 向量除法 */
    public static divide<T extends Laya.IV2>(out: T, a: T, b: T): T {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        return out;
    }

    /** 向量向上取整 */
    public static ceil<T extends Laya.IV2>(out: T, a: T): T {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        return out;
    }

    /** 向量向下取整 */
    public static floor<T extends Laya.IV2>(out: T, a: T): T {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        return out;
    }

    /** 向量最小值 */
    public static min<T extends Laya.IV2>(out: T, a: T, b: T): T {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        return out;
    }

    /** 向量最大值 */
    public static max<T extends Laya.IV2>(out: T, a: T, b: T): T {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        return out;
    }

    /** 向量四舍五入取整 */
    public static round<T extends Laya.IV2>(out: T, a: T): T {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        return out;
    }

    /** 向量标量乘法 */
    public static multiplyScalar<T extends Laya.IV2>(out: T, a: T, b: number): T {
        out.x = a.x * b;
        out.y = a.y * b;
        return out;
    }

    /** 求两向量的欧氏距离 */
    public static distance<T extends Laya.IV2>(a: T, b: T): number {
        const x = b.x - a.x;
        const y = b.y - a.y;
        return Math.sqrt(x * x + y * y);
    }

    /** 求两向量的欧氏距离平方 */
    public static squaredDistance<T extends Laya.IV2>(a: T, b: T): number {
        const x = b.x - a.x;
        const y = b.y - a.y;
        return x * x + y * y;
    }

    /** 求向量长度 */
    public static len<T extends Laya.IV2>(a: T): number {
        const x = a.x;
        const y = a.y;
        return Math.sqrt(x * x + y * y);
    }

    /** 求向量长度平方 */
    public static lengthSqr<T extends Laya.IV2>(a: T): number {
        const x = a.x;
        const y = a.y;
        return x * x + y * y;
    }

    /** 向量取负 */
    public static negate<T extends Laya.IV2>(out: T, a: T): T {
        out.x = -a.x;
        out.y = -a.y;
        return out;
    }

    /** 归一化向量，输入零向量将会返回零向量。 */
    public static normalize<T extends Laya.IV2>(out: T, a: T): T {
        const x = a.x;
        const y = a.y;
        let len = x * x + y * y;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = x * len;
            out.y = y * len;
        } else {
            out.x = 0;
            out.y = 0;
        }
        return out;
    }

    /** 向量点积（数量积） */
    public static dot<T extends Laya.IV2>(a: T, b: T): number {
        return a.x * b.x + a.y * b.y;
    }

    /** 向量叉积（向量积），注意二维向量的叉积为与 Z 轴平行的三维向量 */
    public static cross<T extends Laya.IV2>(a: T, b: T): number {
        return a.x * b.y - a.y * b.x;
    }

    /** 逐元素向量线性插值： A + t * (B - A) */
    public static lerp<T extends Laya.IV2>(out: T, a: T, b: T, t: number): T {
        const x = a.x;
        const y = a.y;
        out.x = x + t * (b.x - x);
        out.y = y + t * (b.y - y);
        return out;
    }

    /**
     * 生成一个在单位圆上均匀分布的随机向量
     * @param scale 向量的长度(单位向量长度1的倍数，就是向量的长度)
     */
    public static random<T extends Laya.IV2>(out: T, scale?: number): T {
        scale = scale || 1.0;
        const r = Math.random() * 2.0 * Math.PI;
        out.x = Math.cos(r) * scale;
        out.y = Math.sin(r) * scale;
        return out;
    }

    /** 向量严格等价判断 */
    public static strictEquals<T extends Laya.IV2>(a: T, b: T): boolean {
        return a.x === b.x && a.y === b.y;
    }

    /** 排除浮点数误差的向量近似等价判断 */
    public static equals<T extends Laya.IV2>(a: T, b: T, epsilon = MathUtil.epsilon): boolean {
        return (
            Math.abs(a.x - b.x)
            <= epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x))
            && Math.abs(a.y - b.y)
            <= epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y))
        );
    }

    /** 求两向量夹角弧度，任意一个向量是零向量则返回零 */
    public static angle<T extends Laya.IV2>(a: T, b: T): number {
        const magSqr1 = a.x * a.x + a.y * a.y;
        const magSqr2 = b.x * b.x + b.y * b.y;

        if (magSqr1 === 0 || magSqr2 === 0) {
            return 0.0;
        }

        const dot = a.x * b.x + a.y * b.y;
        let cosine = dot / (Math.sqrt(magSqr1 * magSqr2));
        cosine = MathUtil.clamp(cosine, -1.0, 1.0);
        return Math.acos(cosine);
    }

    /** 求反射向量 */
    public static reflect<T extends Laya.IV2>(out: T, inDirection: T, inNormal: T): T {
        let num = -2 * V2Util.dot(inNormal, inDirection);
        out.x = num * inNormal.x + inDirection.x;
        out.y = num * inNormal.y + inDirection.y;
        return out;
    }

    public static fromRotation<T extends Laya.IV2>(out: T, rotation: number): T {
        let radian = rotation * Math.PI / 180;
        out.x = Math.cos(radian);
        out.y = Math.sin(radian);
        return out;
    }


}
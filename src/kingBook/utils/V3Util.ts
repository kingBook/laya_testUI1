import { MathUtil } from "./MathUtil";

interface IV3 {
    x: number;
    y: number;
    z: number;
}

export class V3Util {

    /** 向量加法 */
    public static add<T extends IV3>(out: T, a: IV3, b: IV3) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;
        return out;
    }

    /** 向量减法 */
    public static subtract<T extends IV3>(out: T, a: IV3, b: IV3) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        return out;
    }

    /** 向量乘法 (分量积) */
    public static multiply<T extends IV3>(out: T, a: IV3, b: IV3) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
        return out;
    }

    /** 向量除法 */
    public static divide<T extends IV3>(out: T, a: IV3, b: IV3) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        out.z = a.z / b.z;
        return out;
    }

    /** 逐元素向量向上取整 */
    public static ceil<T extends IV3>(out: T, a: IV3) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        out.z = Math.ceil(a.z);
        return out;
    }

    /** 逐元素向量向下取整 */
    public static floor<T extends IV3>(out: T, a: IV3) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        out.z = Math.floor(a.z);
        return out;
    }

    /** 逐元素向量最小值 */
    public static min<T extends IV3>(out: T, a: IV3, b: IV3) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        out.z = Math.min(a.z, b.z);
        return out;
    }

    /** 逐元素向量最大值 */
    public static max<T extends IV3>(out: T, a: IV3, b: IV3) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        out.z = Math.max(a.z, b.z);
        return out;
    }

    /** 元素向量四舍五入取整 */
    public static round<T extends IV3>(out: T, a: IV3) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        out.z = Math.round(a.z);
        return out;
    }

    /** 向量标量乘法 */
    public static multiplyScalar<T extends IV3>(out: T, a: T, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        return out;
    }

    /** 逐元素向量乘加: A + B * scale */
    public static scaleAndAdd<T extends IV3>(out: T, a: IV3, b: IV3, scale: number) {
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        out.z = a.z + b.z * scale;
        return out;
    }

    /** 求两向量的欧氏距离 */
    public static distance(a: IV3, b: IV3) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /** 求两向量的欧氏距离平方 */
    public static squaredDistance(a: IV3, b: IV3) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        return x * x + y * y + z * z;
    }

    /** 求向量长度 */
    public static len(a: IV3) {
        const x = a.x;
        const y = a.y;
        const z = a.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /** 求向量长度平方 */
    public static lengthSqr(a: IV3) {
        const x = a.x;
        const y = a.y;
        const z = a.z;
        return x * x + y * y + z * z;
    }

    /** 逐元素向量取负 */
    public static negate<T extends IV3>(out: T, a: IV3) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        return out;
    }

    /** 逐元素向量取倒数，接近 0 时返回 Infinity */
    public static invert<T extends IV3>(out: T, a: IV3) {
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        out.z = 1.0 / a.z;
        return out;
    }

    /** 逐元素向量取倒数，接近 0 时返回 0 */
    public static invertSafe<T extends IV3>(out: T, a: IV3) {
        const x = a.x;
        const y = a.y;
        const z = a.z;

        if (Math.abs(x) < MathUtil.epsilon) {
            out.x = 0;
        } else {
            out.x = 1.0 / x;
        }

        if (Math.abs(y) < MathUtil.epsilon) {
            out.y = 0;
        } else {
            out.y = 1.0 / y;
        }

        if (Math.abs(z) < MathUtil.epsilon) {
            out.z = 0;
        } else {
            out.z = 1.0 / z;
        }

        return out;
    }

    /** 归一化向量 */
    public static normalize<T extends IV3>(out: T, a: IV3) {
        const x = a.x;
        const y = a.y;
        const z = a.z;

        let len = x * x + y * y + z * z;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = x * len;
            out.y = y * len;
            out.z = z * len;
        }
        return out;
    }

    /** 向量点积（数量积） */
    public static dot<T extends IV3>(a: T, b: T) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    /** 向量叉积（向量积） */
    public static cross<T extends IV3>(out: T, a: T, b: T) {
        const { x: ax, y: ay, z: az } = a;
        const { x: bx, y: by, z: bz } = b;
        out.x = ay * bz - az * by;
        out.y = az * bx - ax * bz;
        out.z = ax * by - ay * bx;
        return out;
    }

    /** 逐元素向量线性插值： A + t * (B - A) */
    public static lerp<T extends IV3>(out: T, a: IV3, b: IV3, t: number) {
        out.x = a.x + t * (b.x - a.x);
        out.y = a.y + t * (b.y - a.y);
        out.z = a.z + t * (b.z - a.z);
        return out;
    }

    /** 
     * 生成一个在单位球体上均匀分布的随机向量
     * @param scale 向量的长度(单位向量长度1的倍数，就是向量的长度)
     * @returns 
     */
    public static random<T extends IV3>(out: T, scale?: number) {
        scale = scale || 1.0;

        const phi = Math.random() * 2.0 * Math.PI;
        const cosTheta = Math.random() * 2 - 1;
        const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);

        out.x = sinTheta * Math.cos(phi) * scale;
        out.y = sinTheta * Math.sin(phi) * scale;
        out.z = cosTheta * scale;
        return out;
    }

    public static reflect<T extends IV3>(out: T, inDirection: T, inNormal: T): T {
        let num = -2 * V3Util.dot(inNormal, inDirection);
        out.x = num * inNormal.x + inDirection.x;
        out.y = num * inNormal.y + inDirection.y;
        out.z = num * inNormal.z + inDirection.z;
        return out;
    }


}
export class Random {

    /** 返回 [0,1) 的随机浮点数 */
    public static get value(): number {
        return Math.random();
    }

    /** 返回随机的true或false */
    public static get boolean(): Boolean {
        return Math.random() < 0.5;
    }

    /** 返回随机的1或-1 */
    public static get sign(): number {
        return Math.random() < 0.5 ? 1 : -1;
    }

    /** 返回 [0,val) 的随机浮点数 */
    public static randomFloat(val: number): number {
        return Math.random() * val;
    }

    /** 返回 [0,val) 的随机整数 */
    public static randomInt(val: number): number {
        return Math.floor(Math.random() * val);
    }

    /** 返回 [min,max) 的随机整数 */
    public static rangeInt(min: number, max: number): number {
        min = Math.floor(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    /** 返回 [min,max) 的随机浮点数 */
    public static rangeFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**
     * 获取一个随机的索引数组(索引不重复，可以是负数)，索引值区间为：[minInt, maxInt]
     * @param minInt 整数，索引最小值
     * @param maxInt 整数，索引最大值
     * @returns 
     */
    public static getRandomizeIndexes(minInt: number, maxInt: number): number[] {
        minInt |= 0, maxInt |= 0;
        let indexes: number[] = [];
        for (let i = minInt; i <= maxInt; i++) {
            indexes.push(i);
        }
        Random.randomizeArray(indexes);
        return indexes;
    }

    /** 随机化的一个数组 */
    public static randomizeArray(collection: any[]): void;
    /** 随机化的一个数组 */
    public static randomizeArray(collection: any[], length: number): void;
    public static randomizeArray(collection: any[], length?: number): void {
        if (length === undefined) {
            length = collection.length;
        }
        for (let i = 0; i < length; i++) {
            let randomIndex = Random.rangeInt(0, length);
            let val = collection[i];
            collection[i] = collection[randomIndex];
            collection[randomIndex] = val;
        }
    }

}
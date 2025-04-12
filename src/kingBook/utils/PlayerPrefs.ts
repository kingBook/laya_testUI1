/** 在游戏会话之间存储和访问玩家偏好。 */
export class PlayerPrefs {

    /** 从偏好中删除所有键和值。请谨慎使用。 */
    public static deleteAll(): void {
        Laya.LocalStorage.clear();
    }

    /** 从偏好中删除 key 及其对应值。 */
    public static deleteKey(key: string): void {
        Laya.LocalStorage.removeItem(key);
    }

    /** 返回偏好设置文件中与 key 对应的值（如果存在）。如果不存在，则返回 defaultValue。 */
    public static getFloat(key: string, defaultValue: number = 0): number {
        let value: string | null = Laya.LocalStorage.getItem(key);
        if (value === null) return defaultValue;
        let n: number = parseFloat(value);
        return isNaN(n) ? defaultValue : n;
    }

    /** 返回偏好设置文件中与 key 对应的值（如果存在）。如果不存在，则返回 defaultValue。 */
    public static getInt(key: string, defaultValue: number = 0): number {
        if (defaultValue !== (defaultValue | 0)) console.warn("defaultValue:" + defaultValue + "不是整数将自动取整");
        let value: string | null = Laya.LocalStorage.getItem(key);
        if (value === null) return defaultValue | 0;
        let n: number = parseInt(value);
        return isNaN(n) ? (defaultValue | 0) : (n | 0);
    }

    /** 返回偏好设置文件中与 key 对应的值（如果存在）。如果不存在，则返回 defaultValue。 */
    public static getString(key: string, defaultValue: string = ""): string {
        let value: string | null = Laya.LocalStorage.getItem(key);
        if (value) return value;
        return defaultValue;
    }

    /** 如果 key 在偏好中存在，则返回 true。 */
    public static hasKey(key: string): boolean {
        if (Laya.LocalStorage.getItem(key)) return true;
        return false;
    }

    /** 设置由 key 标识的偏好的值。 */
    public static setFloat(key: string, value: number): void {
        Laya.LocalStorage.setItem(key, value.toString());
    }

    /** 设置由 key 标识的偏好的值。 */
    public static setInt(key: string, value: number): void {
        if (value !== (value | 0)) console.warn("value:" + value + "不是整数将自动取整");
        value = value | 0;
        Laya.LocalStorage.setItem(key, value.toString());
    }

    /** 设置由 key 标识的偏好的值。 */
    public static setString(key: string, value: string): void {
        Laya.LocalStorage.setItem(key, value);
    }
}
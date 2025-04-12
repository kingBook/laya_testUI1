export class MatrixUtil {

    /** 获取一个对象的矩阵 */
    public static getMatrix(sprite: Laya.Sprite): Laya.Matrix {
        let sx = sprite.scaleX, sy = sprite.scaleY;
        let skewX = sprite.skewX, skewY = sprite.skewY;
        let rot = sprite.rotation;

        let m = new Laya.Matrix();
        if (rot || sx !== 1 || sy !== 1 || skewX !== 0 || skewY !== 0) {
            let skx = (rot - skewX) * 0.0174532922222222;//Math.PI/180;
            let sky = (rot + skewY) * 0.0174532922222222;
            m.a = sx * Math.cos(sky);
            m.b = sx * Math.sin(sky);
            m.c = -sy * Math.sin(skx);
            m.d = sy * Math.cos(skx);
        }

        m.tx = sprite.x;
        m.ty = sprite.y;
        return m;
    }

}
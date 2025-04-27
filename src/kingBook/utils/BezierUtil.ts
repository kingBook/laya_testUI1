import { V2Util } from "./V2Util";
import { IV3 } from "./V3Util";

const { regClass, property } = Laya;

@regClass()
export class BezierUtil {

    public static bezier1(out: IV3, p0: IV3, p1: IV3, t: number): void {
        //out = p0 + (p1 - p0) * t;
        //V3Util.add(p0,);
    }
}
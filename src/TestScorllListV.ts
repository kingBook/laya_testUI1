const { regClass, property } = Laya;

@regClass()
export class TestScorllListV extends Laya.Script {
    declare owner: Laya.List;

    onAwake(): void {
        var data: Array<any> = [];
        for (var m: number = 0; m < 20; m++) {
            data.push({ Label: "No." + m }); // "Label" 与List/Box/Label名称必须相同
        }
        this.owner.array = data;
    }
}
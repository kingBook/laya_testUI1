const { regClass, property } = Laya;

@regClass()
export class TestScorllListV_1 extends Laya.Script {
    declare owner:Laya.List;

    onAwake(): void {
        var data: Array<any> = [];
        for (var m: number = 0; m < 20; m++) {
            data.push({ Button: "No." + m }); // "Button" 与 List/Box/Button 名称必须相同
        }
        this.owner.array = data;
        
    }


}
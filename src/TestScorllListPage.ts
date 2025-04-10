const { regClass, property } = Laya;

@regClass()
export class TestScorllListPage extends Laya.Script {
    declare owner: Laya.List;

    onAwake(): void {
        var data: Array<any> = [];
        for (var m: number = 0; m < 40; m++) {
            data.push({ Button: "No." + m }); // "Button" 与 List/Box/Button 名称必须相同
        }
        this.owner.array = data;

        Laya.stage.on(Laya.Event.CLICK, () => {
            this.owner.page = (this.owner.page + 1) % this.owner.totalPage;
            //this.owner.scrollTo(this.owner.startIndex);
            this.owner.tweenTo(this.owner.startIndex, 1000);
        });
    }

    onUpdate(): void {

    }


}
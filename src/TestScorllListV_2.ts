const { regClass, property } = Laya;

@regClass()
export class TestScorllListV_2 extends Laya.Script {
    declare owner: Laya.List;

    onAwake(): void {
        var data: Array<any> = [];
        for (let m: number = 0; m < 20; m++) {
            data.push({});
        }

        this.owner.renderHandler = new Laya.Handler(this, (cell: Laya.Box, index: number) => {
            let image: Laya.Image = cell.getChild('Image') as Laya.Image;
            image.skin = "https://img95.699pic.com/photo/40225/0928.jpg_wh860.jpg";
        });
        this.owner.array = data;

    }


}
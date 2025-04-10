const { regClass, property } = Laya;

@regClass()
export class TabList extends Laya.Script {
    declare owner : Laya.List;

    onAwake(): void {
        let data:Array<any>=[];
        for(let i=0;i<40;i++){
            data[i]={};
        }
        this.owner.array = data;
    }
}
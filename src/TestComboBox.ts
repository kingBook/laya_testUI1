const { regClass, property } = Laya;

@regClass()
export class TestComboBox extends Laya.Script {
    declare owner: Laya.ComboBox;

    onAwake(): void {
        this.owner.selectHandler=new Laya.Handler(this,(index:number)=>{
            console.log("index:"+index, "selectedIndex:"+this.owner.selectedIndex);
        });
    }
}
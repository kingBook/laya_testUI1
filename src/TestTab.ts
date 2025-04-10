const { regClass, property } = Laya;

@regClass()
export class TestTab extends Laya.Script {
    declare owner: Laya.Tab;
    @property({ type: [Laya.List], private: false })
    private _lists: Array<Laya.List>;

    onAwake(): void {
        this.displayByIndex(this.owner.selectedIndex);

        this.owner.selectHandler = new Laya.Handler(this, (index: number) => {
            this.displayByIndex(this.owner.selectedIndex);
        });
    }

    private displayByIndex(index: number): void {
        for (let i = 0; i < this._lists.length; i++) {
            this._lists[i].visible = i === index;
        }
    }
}
const { regClass, property } = Laya;

@regClass()
export class TestTab_1 extends Laya.Script {
    declare owner: Laya.Tab;
    @property({ type: Laya.ViewStack, private: false })
    private _viewStack: Laya.ViewStack;

    onAwake(): void {
        this.owner.selectHandler = new Laya.Handler(this, (index: number) => {
            this._viewStack.selectedIndex = index;
        });
    }


}
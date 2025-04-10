const { regClass, property } = Laya;

@regClass()
export class TestDialog extends Laya.Script {
    declare owner: Laya.Sprite | Laya.Sprite3D;

    @property({ type: Laya.Prefab, private: false })
    private _dialogPrefab: Laya.Prefab;

    onAwake(): void {
        this.owner.addChild(this._dialogPrefab.create());
    }
}
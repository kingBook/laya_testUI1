const { regClass, property } = Laya;

@regClass()
export class TestDialog extends Laya.Script {
    declare owner: Laya.Sprite | Laya.Sprite3D;

    @property({ type: Laya.Prefab, private: false })
    private _dialogPrefab: Laya.Prefab;

    private _dialog: Laya.Dialog;

    onAwake(): void {
        
    }

    onKeyDown(evt: Laya.Event): void {
        if(evt.key==='h'){
            this.openDialog();
        }
    }

    private openDialog():void{
        this._dialog = this._dialogPrefab.create() as Laya.Dialog;

        this._dialog.isModal = false;
        this._dialog.isPopupCenter = true;
        this._dialog.isShowEffect = true;
        this._dialog.open(false);
    }
}
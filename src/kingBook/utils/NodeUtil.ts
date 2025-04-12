export class NodeUtil {

    public static addNodeComponent<T extends Laya.Component>(t: new () => T, bind: Laya.Node): T {
        let is3d = bind instanceof Laya.Sprite3D;
        let node = is3d ? new Laya.Sprite3D() : new Laya.Sprite();
        node.name = t.prototype.constructor.name;
        bind.addChild(node);
        let comp = node.addComponent(t);
        return comp;
    }

    public static getComponentInParent<T extends Laya.Component>(node: Laya.Node, componentType: new () => T): T | null {
        let result = null;
        let parent = node;
        while (parent) {
            result = parent.getComponent(componentType);
            if (result) break;
            parent = parent.parent;
        }
        return result;
    }

    public static getComponentsInParent<T extends Laya.Component>(node: Laya.Node, componentType: new () => T): T[] {
        let result = new Array<T>();
        let parent = node;
        while (parent) {
            let comps = parent.getComponents(componentType) as T[];
            if (comps) {
                result = result.concat(comps);
            }
            parent = parent.parent;
        }
        return result;
    }

    public static getComponentInChildren<T extends Laya.Component>(node: Laya.Node, componentType: new () => T): T | null {
        let result = null;
        let nodes = new Array<Laya.Node>();
        nodes.push(node);

        let testNode: Laya.Node | null = null;
        while (testNode = nodes.shift()) {
            result = testNode.getComponent(componentType);
            if (result) {
                break;
            } else {
                for (let i = 0, len = testNode.numChildren; i < len; i++) {
                    let child = testNode.getChildAt(i);
                    nodes.push(child);
                }
            }
        }
        return result;
    }

    public static getComponentsInChildren<T extends Laya.Component>(node: Laya.Node, componentType: new () => T): T[] {
        let result = new Array<T>();
        let nodes = new Array<Laya.Node>();
        nodes.push(node);

        let testNode: Laya.Node | null = null;
        while (testNode = nodes.shift()) {
            let comps = testNode.getComponents(componentType) as T[];
            if (comps) {
                result = result.concat(comps);
            }

            for (let i = 0, len = testNode.numChildren; i < len; i++) {
                let child = testNode.getChildAt(i);
                nodes.push(child);
            }
        }
        return result;
    }

}
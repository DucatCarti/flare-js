import { mount, diffing } from "./vDOM";
import { render, reactive } from "./reactive";
export class Component {
    data;
    methods;
    render;
    _vNode;
    mountedHook;
    updatedHook;
    unmountedHook;
    constructor(options) {
        this.data = reactive(options.data());
        this.methods = this.parseMethods(options.methods, this);
        this._vNode = null;
        this.mountedHook = options.mounted;
        this.updatedHook = options.updated;
        this.unmountedHook = options.unmounted;
        this.render = this.createRenderWrapper(options.render.bind(this));
    }
    parseMethods(methods, context) {
        return Object.entries(methods)
            .filter(([_, method]) => typeof method === "function")
            .reduce((acc, [key, method]) => {
            acc[key] = method.bind(context);
            return acc;
        }, {});
    }
    mount(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container)
            return;
        const update = () => {
            const newVNode = this.render();
            if (!this._vNode) {
                mount(newVNode, container, this.mountedHook?.bind(this));
            }
            if (this._vNode) {
                diffing(this._vNode, newVNode, this.unmountedHook?.bind(this));
            }
            this._vNode = newVNode;
        };
        render(update);
    }
    createRenderWrapper(originalRender) {
        return () => {
            if (this.mountedHook) {
                this.mountedHook();
            }
            return originalRender();
        };
    }
}

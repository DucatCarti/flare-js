import { mount, diffing } from "./vDOM";
import { VNode } from "./types";
import { render, reactive } from "./reactive";

interface RouteInComponent {
  params?: unknown
}

export class Component<ComponentData, ComponentMethods> {
  data?: ComponentData;
  methods?: ComponentMethods;
  render: () => VNode;
  _vNode: VNode | null;
  mountedHook?: () => void;
  updatedHook?: () => void;
  unmountedHook?: () => void;
  $route: RouteInComponent | null;

  constructor(options: {
    data?: () => ComponentData;
    methods?: ComponentMethods;
    render: () => VNode;
    mounted?: () => void;
    updated?: () => void;
    unmounted?: () => void;
    [key: string]: unknown;
  }) {
    if (options.data) {
      this.data = reactive<ComponentData>(options.data());
    }
    if (options.methods) {
      this.methods = this.parseMethods(options.methods, this);
    }
    this._vNode = null;

    this.mountedHook = options.mounted;
    this.updatedHook = options.updated;
    this.unmountedHook = options.unmounted;
    this.render = this.createRenderWrapper(options.render.bind(this));
    this.$route = null
  }

  private parseMethods<T>(
    methods: T,
    context: Component<ComponentData, ComponentMethods>,
  ): T {
    return Object.entries(methods as Object)
      .filter(([_, method]) => typeof method === "function")
      .reduce((acc, [key, method]) => {
        (acc as Record<string, Function>)[key] = method.bind(context);
        return acc;
      }, {} as T);
  }

  mount(containerSelector: string): void {
    const container = document.querySelector(containerSelector);

    if (!container) return;

    const update = () => {
      const newVNode = this.render();
      // TODO if по код стайлу
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

  private createRenderWrapper(originalRender: () => VNode): () => VNode {
    return () => {
      if (this.mountedHook) {
        this.mountedHook()
      }
      return originalRender();
    };
  }
}

export function h(tag, props, ...children) {
    return {
        tag,
        props,
        children: children.length === 1 && typeof children[0] === "string"
            ? children[0]
            : children,
        $el: null,
    };
}
function triggerMountedHook(mountedHook) {
    if (mountedHook) {
        mountedHook();
    }
}
function triggerUpdatedHook() { }
function triggerUnMountedHook(unmountedHook) {
    if (unmountedHook) {
        unmountedHook();
    }
}
export function mount(vNode, container, mountedHook) {
    if (vNode === null) {
        return;
    }
    const element = document.createElement(vNode.tag);
    console.log(vNode, "vNode");
    if (vNode.props) {
        Object.entries(vNode.props).forEach(([key, value]) => {
            if (key.startsWith("on")) {
                const eventName = key.slice(2).toLowerCase();
                console.log(eventName, value, "QWERTY");
                element.addEventListener(eventName, value);
            }
            else {
                element.setAttribute(key, String(value));
            }
        });
    }
    if (vNode.children === null || vNode.children === undefined) {
        return;
    }
    if (typeof vNode.children === "string") {
        element.textContent = vNode.children;
    }
    if (typeof vNode.children === "object" &&
        Array.isArray(vNode.children) === false) {
        mount(vNode.children, element);
    }
    if (Array.isArray(vNode.children)) {
        vNode.children.forEach((child) => {
            if (typeof child === "object") {
                mount(child, element);
                return;
            }
            element.textContent += child;
        });
    }
    container.appendChild(element);
    triggerMountedHook(mountedHook);
    vNode.$el = element;
}
export function unMount(vNode, unmountedHook) {
    triggerUnMountedHook(unmountedHook);
    if (vNode.$el?.parentNode === null || vNode.$el?.parentNode === undefined) {
        return;
    }
    vNode.$el.parentNode.removeChild(vNode.$el);
}
export function diffing(oldNode, newNode, unmountedHook) {
    if (typeof newNode !== "object" ||
        newNode === null ||
        typeof oldNode !== "object" ||
        oldNode === null) {
        return;
    }
    if (oldNode.tag !== newNode.tag) {
        mount(newNode, oldNode?.$el?.parentNode);
        unMount(oldNode, unmountedHook);
        return;
    }
    console.log(newNode, oldNode, "QQQQQQQQQQ");
    newNode.$el = oldNode.$el;
    if (newNode.$el === null) {
        return;
    }
    if (typeof newNode.children === "string") {
        newNode.$el.textContent = newNode?.children;
        return;
    }
    while (newNode.$el?.attributes.length > 0) {
        newNode.$el.removeAttribute(newNode.$el?.attributes[0].name);
    }
    if (newNode.props) {
        Object.entries(newNode.props).forEach(([key, value]) => {
            newNode.$el?.setAttribute(key, String(value));
        });
    }
    const oldNodeChildren = Array.isArray(oldNode.children)
        ? oldNode.children
        : [];
    const newNodeChildren = Array.isArray(newNode.children)
        ? newNode.children
        : [];
    const commonLength = Math.min(oldNodeChildren.length, newNodeChildren.length);
    for (let i = 0; i < commonLength; i++) {
        diffing(oldNodeChildren[i], newNodeChildren[i]);
    }
    if (Array.isArray(newNodeChildren) && Array.isArray(oldNodeChildren)) {
        oldNodeChildren.slice(newNodeChildren.length).forEach((child) => {
            unMount(child, unmountedHook);
        });
        newNodeChildren.slice(oldNodeChildren.length).forEach((child) => {
            if (newNode.$el === null) {
                return;
            }
            mount(child, newNode.$el);
        });
    }
}

let activeEffect = null;
export function render(fun) {
    activeEffect = fun;
    fun();
    activeEffect = null;
}
class Dependency {
    subscribers;
    constructor() {
        this.subscribers = new Set();
    }
    depend() {
        if (activeEffect) {
            this.subscribers.add(activeEffect);
        }
    }
    notify() {
        this.subscribers.forEach((subscriber) => subscriber());
    }
}
export function reactive(data) {
    Object.keys(data).forEach((key) => {
        const dep = new Dependency();
        let value = data[key];
        Object.defineProperty(data, key, {
            get() {
                dep.depend();
                return value;
            },
            set(newValue) {
                if (newValue !== value) {
                    value = newValue;
                    dep.notify();
                }
            },
        });
    });
    return data;
}

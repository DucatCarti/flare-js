let activeEffect: (() => void) | null = null;

export function render(fun: () => void): void {
  activeEffect = fun;
  fun();
  activeEffect = null;
}

class Dependency {
  subscribers: Set<() => void>;

  constructor() {
    this.subscribers = new Set();
  }

  depend(): void {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }

  notify(): void {
    this.subscribers.forEach((subscriber) => subscriber());
  }
}

export function reactive<T>(data: T): T {
  Object.keys(data as Object).forEach((key) => {
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

import { reactive } from "./index";
import { StoreOptions } from "./types";

export function createStore(options: StoreOptions) {
  const state = reactive(options.state());

  const actions: Record<string, Function> = {};

  if (options.actions) {
    for (const [key, action] of Object.entries(options.actions)) {
      actions[key] = (...args: unknown[]) => {
        if (typeof action === "function") {
          action(state, ...args);
        }
      };
    }
  }

  return {
    state,
    ...actions,
  };
}

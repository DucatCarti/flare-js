import { reactive } from "./index";
export function createStore(options) {
    const state = reactive(options.state());
    const actions = {};
    if (options.actions) {
        for (const [key, action] of Object.entries(options.actions)) {
            actions[key] = (...args) => {
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

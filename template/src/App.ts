import { Component, h, VNode } from "efko-flare-js";

export const App = new Component({
  render(this): VNode {
    return h(
      "div",
      {},
        'Hello Efko Flare Js'
    );
  },
  data() {
    return {
    };
  },
  methods: {
  },
  mounted() {},
  updated() {},
  unmounted() {},
});

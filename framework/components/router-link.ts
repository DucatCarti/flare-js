import { h } from "../vDOM";
import { VNode } from "../types";
import { Router } from "../../router";

export function routerLink(
  link: string,
  content: VNode | string,
  router: Router,
) {
  return h(
    "a",
    {
      onclick: (e) => {
        e.preventDefault();
        router.push(link);
      },
    },
    content,
  );
}

import { h } from "../vDOM";
export function routerLink(link, content, router) {
    return h("a", {
        onclick: (e) => {
            e.preventDefault();
            router.push(link);
        },
    }, content);
}

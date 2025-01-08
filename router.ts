import { reactive, VNode } from "./index";
import { CurrentRoute, Route, RouteParams } from "./types";

const currentRoute = reactive<CurrentRoute>({
  path: window.location.pathname,
  params: {},
});

// TODO роутер сделать конструктором
export class Router {
  routes: Route[];

  constructor(options) {
    this.routes = options;
  }

  view(): string | null | VNode {
    const currentPath = currentRoute.path;
    // if (currentPath === "/") {
    //   return null;
    // }

    const matchedRoute = this.routes.find((route) => {
      const params = matchRoute(currentPath, route.path);
      if (params) {
        route.params = params;
        return true;
      }
      return false;
    });

    if (matchedRoute) {
      matchedRoute.component.$route = { params: matchedRoute.params || {} };
      return matchedRoute.component.render();
    }

    // TODO обработка 404
    alert("404");
    return null;
  }

  push(url: string): void {
    window.history.pushState({}, "", url);
    this.view();
    currentRoute.path = url;
  }
}
function matchRoute(path: string, routePath: string): RouteParams | null {
  const pathParts = path.split("/").filter(Boolean);
  const routeParts = routePath.split("/").filter(Boolean);

  if (pathParts.length !== routeParts.length) return null;

  const params: RouteParams = {};
  const isMatch = routeParts.every((part, index) => {
    if (part.startsWith(":")) {
      // TODO вспомнит что тут , убрать магическое число
      const paramName = part.slice(1);
      params[paramName] = pathParts[index];
      return true;
    }
    return part === pathParts[index];
  });

  return isMatch ? params : null;
}

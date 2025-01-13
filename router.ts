import {Component, reactive, VNode} from "./index";
import { CurrentRoute, Route, RouteParams } from "./types";
import { NotFoundPage } from './framework/components/notFoundPage'

const currentRoute = reactive<CurrentRoute>({
  path: window.location.pathname,
  params: {},
});

export class Router {
  routes: Route[];

  constructor(options: Route[]) {
    this.routes = options;
  }

  view(): string | null | VNode {
    const currentPath = currentRoute.path;

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

    const CustomNotFoundPage = this.routes.find(route => route.notFoundPage === true)

    return CustomNotFoundPage ? CustomNotFoundPage.component.render() : NotFoundPage.render();
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

import { reactive } from "./index";
import { NotFoundPage } from './framework/components/notFoundPage';
const currentRoute = reactive({
    path: window.location.pathname,
    params: {},
});
export class Router {
    routes;
    constructor(options) {
        this.routes = options;
    }
    view() {
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
        const CustomNotFoundPage = this.routes.find(route => route.notFoundPage === true);
        return CustomNotFoundPage ? CustomNotFoundPage.component.render() : NotFoundPage.render();
    }
    push(url) {
        window.history.pushState({}, "", url);
        this.view();
        currentRoute.path = url;
    }
}
function matchRoute(path, routePath) {
    const pathParts = path.split("/").filter(Boolean);
    const routeParts = routePath.split("/").filter(Boolean);
    if (pathParts.length !== routeParts.length)
        return null;
    const params = {};
    const isMatch = routeParts.every((part, index) => {
        if (part.startsWith(":")) {
            const paramName = part.slice(1);
            params[paramName] = pathParts[index];
            return true;
        }
        return part === pathParts[index];
    });
    return isMatch ? params : null;
}

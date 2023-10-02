import { RouteMap } from "./route-map";
import { Route } from "./route";

export class Router {
  private routes: RouteMap = new RouteMap();

  public verbose;
  public notFoundRoute: Route = {
    name: "Not Found",
    method: "ANY",
    path: "*",
    action(request) {
      return new Response("", { status: 404, statusText: "Not Found" });
    },
    parameters: new Map(),
  };

  constructor(verbose: boolean = false) {
    this.verbose = verbose;
  }

  add(route: Route) {
    this.routes.add(route);

    if (this.verbose) {
      console.log(`🛫 Route "${route.name}" [${route.method}] '${route.path}' added.`);
    }
  }

  remove(path: string) {
    this.routes.remove(path);

    if (this.verbose) {
      console.log(`🛬 Route "${path}' removed.`);
    }
  }

  route(request: Request): Response {
    const url = new URL(request.url);
    let route = this.routes.get(url.pathname);

    if (!route) {
      route = this.notFoundRoute;
    }

    const response = route.action(request);

    if (this.verbose) {
      const emoji = response.status >= 400 ? "🔴" : "🟢";
      console.log(`${emoji} [${request.method}] ${url.pathname} -> ${response.status}`);
    }

    return response;
  }
}

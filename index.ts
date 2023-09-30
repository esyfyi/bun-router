export interface Route {
  name: string;
  method: string;
  path: string;
  action: (request: Request) => Response;
}

export class Router {
  private routes: Route[] = [];

  public verbose;
  public notFoundRoute: Route = {
    name: "Not Found",
    method: "ANY",
    path: "*",
    action(request) {
      return new Response("", { status: 404, statusText: "Not Found" });
    },
  };

  constructor(verbose: boolean = false) {
    this.verbose = verbose;
  }

  add(route: Route) {
    this.routes.push(route);

    if (this.verbose) {
      console.log(`🛫 Route "${route.name}" [${route.method}] '${route.path}' added.`);
    }
  }

  remove(name: string) {
    const route = this.routes.find(route => {
      return route.name === name;
    });

    if (!route) {
      throw new Error(`Route "${name}" does not exist.`);
    }

    if (this.verbose) {
      console.log(`🛬 Route "${route.name}" [${route.method}] '${route.path}' removed.`);
    }
    this.routes = this.routes.filter(route => {
      return route.name !== name;
    });
  }

  route(request: Request): Response {
    const url = new URL(request.url);

    let route = this.routes.find(route => {
      return route.method === request.method && route.path === url.pathname;
    });

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

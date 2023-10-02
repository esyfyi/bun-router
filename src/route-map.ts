import { RouteMapNode } from "./route-map-node";
import { Route } from "./route";

export class RouteMap {
  private root: RouteMapNode = {
    segmentName: "",
    route: null,
    children: new Map(),
    isParameter: false,
  };

  public size: number = 0;

  public verbose: boolean;

  constructor(verbose: boolean = false) {
    this.verbose = verbose;
  }

  add(route: Route) {
    const segments = route.path.split("/").filter((segment) => segment !== "");

    let currentNode = this.root;

    for (const segment of segments) {
      const isParameter = segment.startsWith(":");

      if (isParameter) {
        currentNode.isParameter = true;
      }

      if (!currentNode.children.has(segment)) {
        const newNode: RouteMapNode = {
          segmentName: segment,
          route: null,
          children: new Map(),
          isParameter: false,
        };

        currentNode.children.set(segment, newNode);
        this.size++;
      }

      currentNode = currentNode.children.get(segment) as RouteMapNode;
    }

    currentNode.route = route;

    if (this.verbose) {
      console.log(`🛫 Route "${route.name}" [${route.method}] '${route.path}' added.`);
    }
  }

  remove(path: string) {
    const segments = path.split("/").filter((segment) => segment !== "");

    let currentNode = this.root;

    for (const segment of segments) {
      if (!currentNode.children.has(segment)) {
        throw new Error(`Route "${path}" does not exist.`);
      }

      currentNode = currentNode.children.get(segment) as RouteMapNode;
    }

    currentNode.route = null;

    if (this.verbose) {
      console.log(`🛬 Route "${path}" removed.`);
    }
  }

  get(requestPath: string): Route | null {
    const segments = requestPath.split("/").filter((segment) => segment !== "");

    let currentNode = this.root;
    let parameters = new Map<string, string>();

    for (const segment of segments) {
      currentNode = currentNode.children.get(segment) as RouteMapNode;

      if (!currentNode) {
        return null;
      }

      if (currentNode.isParameter) {
        parameters.set(currentNode.segmentName, segment);
      }
    }

    if (!currentNode.route) {
      return null;
    }

    currentNode.route.parameters = parameters;
    return currentNode.route;
  }
  
}
import { expect, test, describe } from "bun:test";

import { Router } from "./index";

const verbose = true;

describe("router", () => {
  test("should be created", () => {
    const router = new Router(verbose);
    expect(router).toBeInstanceOf(Router);
  });

  test("should add a route", () => {
    const router = new Router(verbose);
    const route = {
      name: "Test Route",
      method: "GET",
      path: "/test",
      action: () => {
        return new Response("");
      },
    };
    router.add(route);
    expect((router as any)["routes"]).toContain(route);
  });

  test("should remove a route", () => {
    const router = new Router(verbose);
    const route = {
      name: "Test Route",
      method: "GET",
      path: "/test",
      action: () => {
        return new Response("");
      },
    };
    router.add(route);
    router.remove(route.name);
    expect((router as any)["routes"]).not.toContain(route);
  });

  test("should route a request", async () => {
    const router = new Router(verbose);
    const route = {
      name: "Test Route",
      method: "GET",
      path: "/test",
      action: () => {
        return new Response("Test");
      },
    };
    router.add(route);
    const request = new Request({
      url: "https://example.com/test",
      method: "GET",
    });
    const response = router.route(request);
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toBe("Test");
  });

  test("should route a request to not found", () => {
    const router = new Router(verbose);
    const request = new Request({
      url: "https://example.com/test",
      method: "GET",
    });
    const response = router.route(request);
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(404);
  });
});

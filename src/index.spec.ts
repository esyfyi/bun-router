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
      parameters: new Map(),
    };
    router.add(route);

    expect((router as any)["routes"]).toBeInstanceOf(Object);
    expect((router as any)["routes"]).toHaveProperty("size", 1);
  });

  test.skip("should remove a route", () => {
    const router = new Router(verbose);
    const route = {
      name: "Test Route",
      method: "GET",
      path: "/test",
      action: () => {
        return new Response("");
      },
      parameters: new Map(),
    };
    router.add(route);
    router.remove(route.name);

    expect((router as any)["routes"]).toBeInstanceOf(Object);
    expect((router as any)["routes"]).toHaveProperty("size", 0);
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
      parameters: new Map(),
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

  test("Speed test", () => {
    const router = new Router(false);

    for (let i = 0; i < 100000; i++) {
      const route = {
        name: `Test Route ${i}`,
        method: "GET",
        path: `/test/${i}`,
        action: () => {
          return new Response("Test");
        },
        parameters: new Map(),
      };
      router.add(route);
    }

    router.verbose = verbose;

    const start = Date.now();

    for (let i = 0; i < 20; i++) {
      const random = Math.floor(Math.random() * 10000);

      const request = new Request({
        url: "https://example.com/test/" + random,
        method: "GET",
      });

      router.route(request);
    }

    const end = Date.now();
    const duration = end - start;
    console.log(`Duration: ${duration}ms`);

    expect(duration).toBeLessThan(10000);
  });
});

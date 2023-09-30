# bun-router

A simple HTTP router for [Bun.serve](https://bun.sh/docs/api/http#bun-serve).

## 🚀 Usage

```ts
import { Router } from "bun-router";

const router = new Router();

router.add({
  name: "hello-world",
  method: "GET",
  path: "/hello-world",
  action(request) {
    return new Response("Hello world!");
  },
});

Bun.serve({
  port: 3000,
  fetch(request) {
    return router.route(request);
  }
});
```

## 🛠️ Development

To install dependencies:

```bash
bun install
```

To run the unit tests:

```bash
bun run test
```

This project was created using `bun init` in bun v1.0.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

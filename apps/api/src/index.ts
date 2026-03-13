import "dotenv/config";

// Validate environment variables at startup
import { validateServerEnv } from "@nobet/shared/server";
validateServerEnv();

import { serve } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth.js";
import { errorHandler, logger } from "./middleware/index.js";
import { createContext } from "./trpc/context.js";
import { appRouter } from "./trpc/router.js";

const app = new Hono();

// Global middleware
app.use("*", logger);
app.use("*", errorHandler);

// CORS middleware
app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173", "https://nobet-web.vercel.app"],
    credentials: true,
  })
);

// Better Auth routes
app.all("/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// tRPC endpoint
app.all("/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: ({ req }) => createContext(req),
  });
});

// Health check endpoint (REST)
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root – not available (avoids exposing anything at /)
app.get("/", (c) => c.json({ error: "Not Found" }, 404));
app.all("/", (c) => c.json({ error: "Not Found" }, 404));

// Start server only when not on Vercel (serverless uses api/[[...route]].ts)
if (!process.env.VERCEL) {
  const port = 3000;
  console.log(`Server running at http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
}

export default app;

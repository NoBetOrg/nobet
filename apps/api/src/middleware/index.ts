import type { Context, Next } from "hono";

/**
 * Request logging middleware
 * Logs incoming requests with method, path, and timing
 */
export async function logger(c: Context, next: Next) {
  const start = Date.now();
  const { method, path } = c.req;

  console.log(`→ ${method} ${path}`);

  await next();

  const elapsed = Date.now() - start;
  console.log(`← ${method} ${path} ${c.res.status} ${elapsed}ms`);
}

/**
 * Error handling middleware
 * Catches and formats errors consistently
 */
export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error("Error:", error);

    const isDev = process.env.NODE_ENV === "development";

    return c.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Internal server error",
          ...(isDev && { stack: error instanceof Error ? error.stack : undefined }),
        },
      },
      500
    );
  }
}

/**
 * Rate limiting structure (example)
 * In production, use a proper rate limiting library like @hono/rate-limiter
 * or implement with Redis
 */
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export async function rateLimiter(c: Context, next: Next) {
  const ip = c.req.header("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100;

  const record = requestCounts.get(ip);

  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
    await next();
    return;
  }

  if (record.count >= maxRequests) {
    return c.json({ error: "Too many requests" }, 429);
  }

  record.count++;
  await next();
}

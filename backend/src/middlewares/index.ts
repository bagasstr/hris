import type { Context, Next } from "hono";

export const errorHandler = (err: Error, c: Context) => {
  console.error(`[Error]: ${err.message}`, err);
  return c.json(
    {
      success: false,
      message: err.message || "Internal Server Error",
    },
    500,
  );
};

export const loggerMiddleware = async (c: Context, next: Next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`[${c.req.method}] ${c.req.url} - ${c.res.status} (${ms}ms)`);
};

export { authMiddleware } from "./auth.middleware";
export { requireRole } from "./requireRole";

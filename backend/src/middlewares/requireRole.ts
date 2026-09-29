import type { Context, Next } from "hono";
import { sendError } from "../common/utils/response";

export const requireRole = (...allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get("user");
    if (!user) {
      return sendError(c, "Unauthorized: Silahkan login terlebih dahulu", 401);
    }

    if (!allowedRoles.includes(user.role)) {
      return sendError(
        c,
        "Forbidden: Anda tidak memiliki hak akses untuk endpoint ini",
        403,
      );
    }

    await next();
  };
};

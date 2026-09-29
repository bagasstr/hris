import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { sendError } from "../common/utils/response";
import { prisma } from "../prisma/db";

export const authMiddleware = async (c: Context, next: Next) => {
  const token =
    getCookie(c, "session_token") ||
    c.req.header("Authorization")?.replace("Bearer ", "").trim();

  if (!token) {
    return sendError(c, "Unauthorized: Silahkan login terlebih dahulu", 401);
  }

  const session = await prisma.Session.where({ token }).first();
  if (!session) {
    return sendError(c, "Unauthorized: Sesi tidak valid atau telah berakhir", 401);
  }

  if (new Date(session.expiresAt) < new Date()) {
    await prisma.Session.where({ token }).delete();
    return sendError(c, "Unauthorized: Sesi kadaluwarsa, Silahkan login kembali", 401);
  }

  const user = await prisma.User.where({ id: session.userId }).first();
  if (!user) {
    return sendError(c, "Unauthorized: User tidak ditemukan", 401);
  }

  const { password, ...safeUser } = user;

  c.set("user", safeUser);
  c.set("sessionToken", token);

  await next();
};

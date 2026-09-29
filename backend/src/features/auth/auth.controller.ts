import type { Context } from "hono";
import { authService } from "./auth.service";
import { sendSuccess, sendError } from "../../common/utils/response";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

export const authController = {
  async login(c: Context) {
    try {
      const body = await c.req.json();
      const userAgent = c.req.header("User-Agent");
      const { sessionToken, user } = await authService.login(body, userAgent);
      setCookie(c, "session_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return sendSuccess(c, { user }, "Login berhasil");
    } catch (error: any) {
      return sendError(c, error.message || "Login gagal", 400);
    }
  },

  async register(c: Context) {
    try {
      const body = await c.req.json();
      const result = await authService.register(body);
      return sendSuccess(c, result, "Registrasi berhasil", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Registrasi gagal", 400);
    }
  },

  async logout(c: Context) {
    try {
      const token = getCookie(c, "session_token");
      if (token) {
        await authService.logout(token);
      }
      deleteCookie(c, "session_token", { path: "/" });
      return sendSuccess(c, null, "Logout berhasil");
    } catch (error: any) {
      return sendError(c, error.message || "Logout gagal", 400);
    }
  },

  async getMe(c: Context) {
    try {
      const currentUser = c.get("user");
      if (!currentUser) {
        return sendError(c, "User tidak ditemukan", 401);
      }
      const user = await authService.getMe(currentUser.id);
      return sendSuccess(c, { user }, "User profile berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data user", 400);
    }
  },
};

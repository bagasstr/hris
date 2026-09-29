import type { Context } from "hono";
import { sendError, sendSuccess } from "../../common/utils/response";
import { profileService } from "./profile.service";

export const profileController = {
  async getProfile(c: Context) {
    try {
      const currentUser = c.get("user");
      if (!currentUser?.id) {
        return sendError(c, "Unauthorized: User tidak ditemukan", 401);
      }
      const profile = await profileService.getProfile(currentUser.id);
      return sendSuccess(c, { profile }, "Data profile berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil profil", 400);
    }
  },

  async updateProfile(c: Context) {
    try {
      const currentUser = c.get("user");
      if (!currentUser?.id) {
        return sendError(c, "Unauthorized: User tidak ditemukan", 401);
      }
      const body = await c.req.json();
      const updatedProfile = await profileService.updateProfile(currentUser.id, body);
      return sendSuccess(c, { profile: updatedProfile }, "Profil berhasil diperbarui");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal memperbarui profile", 400);
    }
  },

  async changePassword(c: Context) {
    try {
      const currentUser = c.get("user");
      if (!currentUser?.id) {
        return sendError(c, "Unauthorized: User tidak ditemukan", 401);
      }
      const body = await c.req.json();
      const result = await profileService.changePassword(currentUser.id, body);
      return sendSuccess(c, null, result.message);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengganti password", 400);
    }
  },
};

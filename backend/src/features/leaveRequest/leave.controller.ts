import { Context } from "hono";
import { leaveRequestService } from "./leave.service";
import { sendError, sendSuccess } from "../../common/utils/response";

export const leaveRequestController = {
  async getAllLeave(c: Context) {
    try {
      const leaves = await leaveRequestService.getAllLeave();
      return sendSuccess(
        c,
        leaves,
        "Berhasil menggambil semua data pengajuan cuti",
      );
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data cuti", 400);
    }
  },

  async createLeave(c: Context) {
    try {
      const user = c.get("user");
      if (!user) {
        return sendError(
          c,
          "Unauthorized: Silahkan login terlebih dahulu",
          401,
        );
      }
      const body = await c.req.json();
      const result = await leaveRequestService.createLeave(user.id, body);
      return sendSuccess(c, result, "Pengajuan cuti berhasil dikirim", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal membuat pengajuan cuti", 400);
    }
  },

  async getMyLeaves(c: Context) {
    try {
      const user = c.get("user");
      if (!user) {
        return sendError(
          c,
          "Unauthorized: Silahkan login terlebih dahulu",
          401,
        );
      }
      const result = await leaveRequestService.getMyLeaves(user.id);
      return sendSuccess(c, result, "Riwayat pengajuan cuti saya");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil riwayat cuti", 400);
    }
  },

  async getById(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "ID pengajuan cuti tidak valid", 400);
      }
      const result = await leaveRequestService.getById(id);
      return sendSuccess(c, result, "Detail pengajuan cuti");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil detail cuti", 404);
    }
  },

  async updateStatus(c: Context) {
    try {
      const id = c.req.param("id");
      const admin = c.get("user");
      if (!id) {
        return sendError(c, "ID tidak ditemukan", 400);
      }
      if (!admin) {
        return sendError(c, "Unauthorized", 401);
      }
      const body = await c.req.json();
      if (!body.status || !["approved", "rejected"].includes(body.status)) {
        return sendError(
          c,
          'Status harus berupa "approved" atau "rejected"',
          400,
        );
      }
      const result = await leaveRequestService.updateStatus(id, admin.id, body);
      return sendSuccess(
        c,
        result,
        `Pengajuan cuti berhasil di-${body.status}`,
      );
    } catch (error: any) {
      return sendError(
        c,
        error.message || "Gagal memperbarui status cuti",
        400,
      );
    }
  },
};

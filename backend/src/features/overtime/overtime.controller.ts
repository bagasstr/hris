import type { Context } from "hono";
import { overtimeService } from "./overtime.service";
import { sendError, sendSuccess } from "../../common/utils/response";

export const overtimeController = {
  async getAll(c: Context) {
    try {
      const list = await overtimeService.getAll();
      return sendSuccess(c, { overtimeRequests: list }, "Data lembur berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data lembur", 400);
    }
  },

  async getMyOvertime(c: Context) {
    try {
      const user = c.get("user");
      if (!user?.id) {
        return sendError(c, "Unauthorized", 401);
      }
      const list = await overtimeService.getMyOvertime(user.id);
      return sendSuccess(c, { overtimeRequests: list }, "Data lembur Anda berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data lembur", 400);
    }
  },

  async getById(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "ID lembur tidak valid", 400);
      }
      const item = await overtimeService.getById(id);
      return sendSuccess(c, { overtimeRequest: item }, "Detail lembur berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Pengajuan lembur tidak ditemukan", 404);
    }
  },

  async create(c: Context) {
    try {
      const user = c.get("user");
      if (!user?.id) {
        return sendError(c, "Unauthorized", 401);
      }
      const body = await c.req.json();
      if (!body.date || !body.startTime || !body.endTime || !body.reason) {
        return sendError(c, "Tanggal, jam mulai, jam selesai, dan alasan wajib diisi", 400);
      }
      const item = await overtimeService.create(user.id, body);
      return sendSuccess(c, { overtimeRequest: item }, "Pengajuan lembur berhasil dibuat", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal membuat pengajuan lembur", 400);
    }
  },

  async updateStatus(c: Context) {
    try {
      const id = c.req.param("id");
      const admin = c.get("user");
      if (!id || !admin?.id) {
        return sendError(c, "Data tidak valid atau unauthorized", 400);
      }
      const body = await c.req.json();
      if (!["approved", "rejected"].includes(body.status)) {
        return sendError(c, "Status harus approved atau rejected", 400);
      }
      const item = await overtimeService.updateStatus(id, admin.id, body);
      return sendSuccess(c, { overtimeRequest: item }, "Status lembur berhasil diperbarui");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal memperbarui status lembur", 400);
    }
  },
};

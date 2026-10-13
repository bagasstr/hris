import type { Context } from "hono";
import { reimbursementService } from "./reimbursement.service";
import { sendError, sendSuccess } from "../../common/utils/response";

export const reimbursementController = {
  async getAll(c: Context) {
    try {
      const list = await reimbursementService.getAll();
      return sendSuccess(c, { reimbursements: list }, "Data reimbursement berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data reimbursement", 400);
    }
  },

  async getMyReimbursements(c: Context) {
    try {
      const user = c.get("user");
      if (!user?.id) {
        return sendError(c, "Unauthorized", 401);
      }
      const list = await reimbursementService.getMyReimbursements(user.id);
      return sendSuccess(c, { reimbursements: list }, "Data reimbursement Anda berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data reimbursement", 400);
    }
  },

  async getById(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "ID reimbursement tidak valid", 400);
      }
      const item = await reimbursementService.getById(id);
      return sendSuccess(c, { reimbursement: item }, "Detail reimbursement berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Klaim reimbursement tidak ditemukan", 404);
    }
  },

  async create(c: Context) {
    try {
      const user = c.get("user");
      if (!user?.id) {
        return sendError(c, "Unauthorized", 401);
      }
      const body = await c.req.json();
      if (!body.title || !body.category || body.amount === undefined || !body.date) {
        return sendError(c, "Judul, kategori, nominal, dan tanggal wajib diisi", 400);
      }
      const item = await reimbursementService.create(user.id, body);
      return sendSuccess(c, { reimbursement: item }, "Pengajuan reimbursement berhasil dibuat", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal membuat pengajuan reimbursement", 400);
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
      if (!["approved", "rejected", "paid"].includes(body.status)) {
        return sendError(c, "Status harus approved, rejected, atau paid", 400);
      }
      const item = await reimbursementService.updateStatus(id, admin.id, body);
      return sendSuccess(c, { reimbursement: item }, "Status reimbursement berhasil diperbarui");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal memperbarui status reimbursement", 400);
    }
  },
};

import type { Context } from "hono";
import { bankChangeRequestService } from "./bankRequest.service";
import { sendError, sendSuccess } from "../../common/utils/response";

export const bankChangeRequestController = {
  // GET /api/v1/bank-requests (HR/Admin)
  async getAll(c: Context) {
    try {
      const status = c.req.query("status");
      const result = await bankChangeRequestService.getAll(status);
      return sendSuccess(
        c,
        result,
        "Berhasil mengambil data pengajuan perubahan rekening",
      );
    } catch (error: any) {
      return sendError(
        c,
        error.message || "Gagal mengambil data pengajuan",
        400,
      );
    }
  },

  // POST /api/v1/bank-requests (Employee)
  async create(c: Context) {
    try {
      const user = c.get("user");
      if (!user) {
        return sendError(c, "Unauthorized", 401);
      }
      const body = await c.req.json();
      const result = await bankChangeRequestService.create(user.id, body);
      return sendSuccess(
        c,
        result,
        "Pengajuan perubahan rekening berhasil dikirim dan menunggu persetujuan HR",
        201,
      );
    } catch (error: any) {
      return sendError(
        c,
        error.message || "Gagal membuat pengajuan perubahan rekening",
        400,
      );
    }
  },

  // GET /api/v1/bank-requests/my (Employee)
  async getMyRequests(c: Context) {
    try {
      const user = c.get("user");
      if (!user) {
        return sendError(c, "Unauthorized", 401);
      }
      const result = await bankChangeRequestService.getMyRequests(user.id);
      return sendSuccess(
        c,
        result,
        "Berhasil mengambil riwayat pengajuan rekening saya",
      );
    } catch (error: any) {
      return sendError(
        c,
        error.message || "Gagal mengambil riwayat pengajuan rekening",
        400,
      );
    }
  },

  // GET /api/v1/bank-requests/:id
  async getById(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "ID pengajuan tidak valid", 400);
      }
      const result = await bankChangeRequestService.getById(id);
      return sendSuccess(c, result, "Detail pengajuan perubahan rekening");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil detail", 404);
    }
  },

  // PATCH /api/v1/bank-requests/:id/review (HR/Admin)
  async review(c: Context) {
    try {
      const id = c.req.param("id");
      const reviewer = c.get("user");
      if (!id) {
        return sendError(c, "ID pengajuan tidak valid", 400);
      }
      if (!reviewer) {
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

      const result = await bankChangeRequestService.review(
        id,
        reviewer.id,
        body,
      );
      const actionText =
        body.status === "approved" ? "disetujui" : "ditolak";
      return sendSuccess(
        c,
        result,
        `Pengajuan perubahan rekening berhasil di-${actionText}`,
      );
    } catch (error: any) {
      return sendError(
        c,
        error.message || "Gagal memproses pengajuan rekening",
        400,
      );
    }
  },
};

import type { Context } from "hono";
import { performanceService } from "./performance.service";
import { sendError, sendSuccess } from "../../common/utils/response";

export const performanceController = {
  // Reviews
  async getAllReviews(c: Context) {
    try {
      const period = c.req.query("period");
      const userId = c.req.query("userId");
      const reviews = await performanceService.getAllReviews(period, userId);
      return sendSuccess(c, { reviews }, "Data review kinerja berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data review kinerja", 400);
    }
  },

  async getMyReviews(c: Context) {
    try {
      const user = c.get("user");
      if (!user?.id) return sendError(c, "Unauthorized", 401);

      const reviews = await performanceService.getMyReviews(user.id);
      return sendSuccess(c, { reviews }, "Data review kinerja Anda berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil review kinerja", 400);
    }
  },

  async getReviewById(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) return sendError(c, "ID review tidak valid", 400);
      const review = await performanceService.getReviewById(id);
      return sendSuccess(c, { review }, "Detail review kinerja berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Review kinerja tidak ditemukan", 404);
    }
  },

  async createReview(c: Context) {
    try {
      const admin = c.get("user");
      if (!admin?.id) return sendError(c, "Unauthorized", 401);

      const body = await c.req.json();
      if (!body.userId || !body.period) {
        return sendError(c, "User ID dan periode review wajib diisi", 400);
      }
      const review = await performanceService.createReview(admin.id, body);
      return sendSuccess(c, { review }, "Review kinerja berhasil dibuat", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal membuat review kinerja", 400);
    }
  },

  async updateReview(c: Context) {
    try {
      const admin = c.get("user");
      if (!admin?.id) return sendError(c, "Unauthorized", 401);

      const id = c.req.param("id");
      if (!id) return sendError(c, "ID review tidak valid", 400);
      const body = await c.req.json();
      const review = await performanceService.updateReview(id, admin.id, body);
      return sendSuccess(c, { review }, "Review kinerja berhasil diperbarui");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal memperbarui review kinerja", 400);
    }
  },

  async deleteReview(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) return sendError(c, "ID review tidak valid", 400);
      await performanceService.deleteReview(id);
      return sendSuccess(c, null, "Review kinerja berhasil dihapus");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal menghapus review kinerja", 400);
    }
  },

  // KPIs
  async getKpis(c: Context) {
    try {
      const userId = c.req.query("userId");
      const reviewId = c.req.query("reviewId");
      const kpis = await performanceService.getKpis(userId, reviewId);
      return sendSuccess(c, { kpis }, "Daftar KPI berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil daftar KPI", 400);
    }
  },

  async getMyKpis(c: Context) {
    try {
      const user = c.get("user");
      if (!user?.id) return sendError(c, "Unauthorized", 401);

      const kpis = await performanceService.getMyKpis(user.id);
      return sendSuccess(c, { kpis }, "Daftar KPI Anda berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil KPI Anda", 400);
    }
  },

  async createKpi(c: Context) {
    try {
      const user = c.get("user");
      if (!user?.id) return sendError(c, "Unauthorized", 401);

      const body = await c.req.json();
      if (!body.title) {
        return sendError(c, "Judul KPI wajib diisi", 400);
      }
      const kpi = await performanceService.createKpi(user.id, body);
      return sendSuccess(c, { kpi }, "KPI berhasil ditambahkan", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal membuat KPI", 400);
    }
  },

  async updateKpi(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) return sendError(c, "ID KPI tidak valid", 400);
      const body = await c.req.json();
      const kpi = await performanceService.updateKpi(id, body);
      return sendSuccess(c, { kpi }, "KPI berhasil diperbarui");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal memperbarui KPI", 400);
    }
  },

  async deleteKpi(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) return sendError(c, "ID KPI tidak valid", 400);
      await performanceService.deleteKpi(id);
      return sendSuccess(c, null, "KPI berhasil dihapus");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal menghapus KPI", 400);
    }
  },
};

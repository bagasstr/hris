import type { Context } from "hono";
import { departmentsService } from "./departments.service";
import { sendError, sendSuccess } from "../../common/utils/response";

export const departmentsController = {
  async getAll(c: Context) {
    try {
      const departments = await departmentsService.getAll();
      return sendSuccess(c, { departments }, "Data department berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data department", 400);
    }
  },

  async create(c: Context) {
    try {
      const body = await c.req.json();
      if (!body.name?.trim()) {
        return sendError(c, "Nama department wajib diisi", 400);
      }
      const department = await departmentsService.findOrCreate(body.name, body.description);
      return sendSuccess(c, { department }, "Department berhasil ditambahkan", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal menambahkan department", 400);
    }
  },
};

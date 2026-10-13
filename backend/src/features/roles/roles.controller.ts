import type { Context } from "hono";
import { rolesService } from "./roles.service";
import { sendError, sendSuccess } from "../../common/utils/response";

export const rolesController = {
  async getAll(c: Context) {
    try {
      const roles = await rolesService.getAll();
      return sendSuccess(c, { roles }, "Data roles berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data roles", 400);
    }
  },

  async getById(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "ID role wajib diisi", 400);
      }
      const role = await rolesService.getById(id);
      return sendSuccess(c, { role }, "Data role berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Role tidak ditemukan", 404);
    }
  },

  async create(c: Context) {
    try {
      const body = await c.req.json();
      if (!body.name || !body.displayName) {
        return sendError(c, "Name dan displayName wajib diisi", 400);
      }
      const role = await rolesService.create(body);
      return sendSuccess(c, { role }, "Role berhasil dibuat", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal membuat role", 400);
    }
  },

  async update(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "ID role wajib diisi", 400);
      }
      const body = await c.req.json();
      const role = await rolesService.update(id, body);
      return sendSuccess(c, { role }, "Role berhasil diperbarui");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal memperbarui role", 400);
    }
  },

  async delete(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "ID role wajib diisi", 400);
      }
      const deleted = await rolesService.delete(id);
      return sendSuccess(c, { role: deleted }, "Role berhasil dihapus");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal menghapus role", 400);
    }
  },

  async getPermissions(c: Context) {
    try {
      const permissions = await rolesService.getAllPermissions();
      return sendSuccess(c, { permissions }, "Data permissions berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil permissions", 400);
    }
  },
};

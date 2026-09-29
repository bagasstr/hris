import type { Context } from "hono";
import { employeesService } from "./employees.service";
import { sendSuccess, sendError } from "../../common/utils/response";

export const employeesController = {
  async getAll(c: Context) {
    try {
      const name = c.req.query("name");
      const email = c.req.query("email");

      if (name || email) {
        const employee = await employeesService.getByNameOrEmail(name, email);
        return sendSuccess(c, employee, "Berhasil mengambil data karyawan");
      }

      const page = Number(c.req.query("page")) || 1;
      const limit = Number(c.req.query("limit")) || 10;
      const search = c.req.query("search");
      const result = await employeesService.getAll({ page, limit, search });
      return sendSuccess(c, result, "Berhasil mengambil data karyawan");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal mengambil data karyawan", 404);
    }
  },

  async getById(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "Id karyawan tidak ditemukan", 400);
      }
      const employee = await employeesService.getById(id);
      if (!employee) {
        return sendError(c, "Karyawan tidak ditemukan", 404);
      }
      return sendSuccess(c, employee, "Berhasil mengambil detail karyawan");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal mengambil data karyawan", 400);
    }
  },

  async delete(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "Id karyawan tidak ditemukan", 400);
      }
      const employee = await employeesService.delete(id);
      if (!employee) {
        return sendError(c, "Karyawan tidak ditemukan", 404);
      }
      return sendSuccess(c, employee, "Karyawan berhasil dihapus");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal menghapus karyawan", 400);
    }
  },
};

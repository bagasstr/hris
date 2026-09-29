import { Context } from "hono";
import { shiftService } from "./shift.service";
import { sendError, sendSuccess } from "../../common/utils/response";

export const shiftController = {
  async getAll(c: Context) {
    try {
      const shifts = await shiftService.getAll();
      return sendSuccess(c, { shifts }, "Data shift berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data shift", 400);
    }
  },
  async getById(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "ID shift wajib disertakan", 400);
      }
      const shift = await shiftService.getById(id);
      if (!shift) {
        return sendError(c, "Shift tidak ditemukan");
      }
      return sendSuccess(c, { shift }, "Detail shift berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil detail shift", 400);
    }
  },
  async create(c: Context) {
    try {
      const body = await c.req.json().catch(() => ({}));
      const { name, startTime, endTime, graceTime } = body;
      if (!name?.trim()) {
        return sendError(c, "Nama shift wajib diisi", 400);
      }
      if (!startTime?.trim()) {
        return sendError(
          c,
          "Jam masuk (startTime) wajib diisi (contoh: '08:00'",
          400,
        );
      }
      if (!endTime?.trim()) {
        return sendError(
          c,
          "Jam pulang (endTime) wajib diisi (contoh: '17:00'",
          400,
        );
      }
      const shift = await shiftService.create({
        name: name.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        graceTime: graceTime !== undefined ? Number(graceTime) : undefined,
      });
      return sendSuccess(c, { shift }, "Shift berhasil ditambahkan", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal menambah shift", 400);
    }
  },
  async update(c: Context) {
    try {
      const id = await c.req.param("id");
      if (!id) {
        return sendError(c, "ID shift wajib diisi", 400);
      }
      const body = await c.req.json().catch(() => ({}));
      const shift = await shiftService.update(id, body);
      return sendSuccess(c, { shift }, "Shift berhasil diperbarui");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal memperbarui shift", 400);
    }
  },
  async delete(c: Context) {
    try {
      const id = await c.req.param("id");
      if (!id) {
        return sendError(c, "ID shift wajib diisi", 400);
      }
      const shift = await shiftService.delete(id);
      return sendSuccess(c, { shift }, "Shift berhasil dihapus");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal menghapus shift", 400);
    }
  },
};

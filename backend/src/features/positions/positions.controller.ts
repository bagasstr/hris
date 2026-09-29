import type { Context } from "hono";
import { positionsService } from "./positions.service";
import { sendSuccess, sendError } from "../../common/utils/response";

export const positionsController = {
  async getAll(c: Context) {
    try {
      const positions = await positionsService.getAll();
      return sendSuccess(c, { positions }, "Data posisi berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data posisi", 400);
    }
  },
};

import type { Context } from "hono";
import { attendanceService } from "./attend.service";
import { sendSuccess, sendError } from "../../common/utils/response";

export const attendanceController = {
  // POST /attendance/clock-in
  async clockIn(c: Context) {
    try {
      const user = c.get("user");
      if (!user) {
        return sendError(c, "Unauthorized: Silahkan login terlebih dahulu", 401);
      }
      const body = await c.req.json().catch(() => ({}));
      const result = await attendanceService.clockIn(user.id, body);
      return sendSuccess(c, result, "Berhasil melakukan absensi masuk", 201);
    } catch (err: any) {
      return sendError(c, err.message || "Gagal melakukan clock-in", 400);
    }
  },

  // POST /attendance/clock-out
  async clockOut(c: Context) {
    try {
      const user = c.get("user");
      if (!user) {
        return sendError(c, "Unauthorized: Silahkan login terlebih dahulu", 401);
      }
      const body = await c.req.json().catch(() => ({}));
      const result = await attendanceService.clockOut(user.id, body);
      return sendSuccess(c, result, "Berhasil melakukan absensi keluar");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal melakukan clock-out", 400);
    }
  },

  // GET /attendance/today
  async getTodayStatus(c: Context) {
    try {
      const user = c.get("user");
      if (!user) {
        return sendError(c, "Unauthorized: Silahkan login terlebih dahulu", 401);
      }
      const result = await attendanceService.getTodayStatus(user.id);
      return sendSuccess(c, result, "Status absensi hari ini");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal mengambil status absensi", 400);
    }
  },

  // GET /attendance/history
  async getMyHistory(c: Context) {
    try {
      const user = c.get("user");
      if (!user) {
        return sendError(c, "Unauthorized: Silahkan login terlebih dahulu", 401);
      }
      const result = await attendanceService.getMyHistory(user.id);
      return sendSuccess(c, result, "Riwayat absensi karyawan");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal mengambil riwayat absensi", 400);
    }
  },

  // GET /attendance/present
  async getPresentAll(c: Context) {
    try {
      const result = await attendanceService.getPresentAll();
      return sendSuccess(c, result, "Data karyawan hadir");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal mengambil data absensi", 400);
    }
  },

  // GET /attendance/absent
  async getAbsentAll(c: Context) {
    try {
      const result = await attendanceService.getAbsentAll();
      return sendSuccess(c, result, "Data karyawan tidak hadir");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal mengambil data absensi", 400);
    }
  },

  // GET /attendance/sick
  async getSickAll(c: Context) {
    try {
      const result = await attendanceService.getSickAll();
      return sendSuccess(c, result, "Data karyawan sakit");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal mengambil data absensi", 400);
    }
  },

  // GET /attendance/late
  async getLateAll(c: Context) {
    try {
      const result = await attendanceService.getLateAll();
      return sendSuccess(c, result, "Data karyawan terlambat");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal mengambil data absensi", 400);
    }
  },

  // GET /attendance/leave
  async getLeaveAll(c: Context) {
    try {
      const result = await attendanceService.getLeaveAll();
      return sendSuccess(c, result, "Data karyawan cuti");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal mengambil data absensi", 400);
    }
  },

  // GET /attendance/permit
  async getPermitAll(c: Context) {
    try {
      const result = await attendanceService.getPermitAll();
      return sendSuccess(c, result, "Data karyawan izin");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal mengambil data absensi", 400);
    }
  },

  // GET /attendance/holiday
  async getHolidayAll(c: Context) {
    try {
      const result = await attendanceService.getHolidayAll();
      return sendSuccess(c, result, "Data karyawan libur");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal mengambil data absensi", 400);
    }
  },
};

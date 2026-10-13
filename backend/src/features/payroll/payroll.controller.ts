import type { Context } from "hono";
import { payrollService } from "./payroll.service";
import { sendError, sendSuccess } from "../../common/utils/response";

export const payrollController = {
  // Salary Structure
  async getAllSalaryStructures(c: Context) {
    try {
      const list = await payrollService.getAllSalaryStructures();
      return sendSuccess(c, { salaryStructures: list }, "Data struktur gaji berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil struktur gaji", 400);
    }
  },

  async getSalaryStructure(c: Context) {
    try {
      const userId = c.req.param("userId");
      if (!userId) {
        return sendError(c, "userId wajib diisi", 400);
      }
      const item = await payrollService.getSalaryStructure(userId);
      return sendSuccess(c, { salaryStructure: item }, "Data struktur gaji karyawan berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil struktur gaji", 400);
    }
  },

  async upsertSalaryStructure(c: Context) {
    try {
      const body = await c.req.json();
      if (!body.userId || body.basicSalary === undefined) {
        return sendError(c, "userId dan basicSalary wajib diisi", 400);
      }
      const item = await payrollService.upsertSalaryStructure(body);
      return sendSuccess(c, { salaryStructure: item }, "Struktur gaji berhasil disimpan");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal menyimpan struktur gaji", 400);
    }
  },

  // Periods
  async getPeriods(c: Context) {
    try {
      const list = await payrollService.getPeriods();
      return sendSuccess(c, { periods: list }, "Data periode payroll berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil periode payroll", 400);
    }
  },

  async getPeriodById(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "ID periode wajib diisi", 400);
      }
      const period = await payrollService.getPeriodById(id);
      return sendSuccess(c, { period }, "Detail periode payroll berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Periode payroll tidak ditemukan", 404);
    }
  },

  async createPeriod(c: Context) {
    try {
      const body = await c.req.json();
      if (!body.name || !body.startDate || !body.endDate || !body.payDate) {
        return sendError(c, "Nama periode, tanggal mulai, tanggal selesai, dan tanggal bayar wajib diisi", 400);
      }
      const period = await payrollService.createPeriod(body);
      return sendSuccess(c, { period }, "Periode payroll berhasil dibuat", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal membuat periode payroll", 400);
    }
  },

  async generatePayroll(c: Context) {
    try {
      const periodId = c.req.param("periodId");
      if (!periodId) {
        return sendError(c, "periodId wajib diisi", 400);
      }
      const period = await payrollService.generatePayroll(periodId);
      return sendSuccess(c, { period }, "Kalkulasi payroll periode ini berhasil diproses");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal memproses kalkulasi payroll", 400);
    }
  },

  async updatePeriodStatus(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "ID periode wajib diisi", 400);
      }
      const body = await c.req.json();
      if (!body.status) {
        return sendError(c, "Status wajib diisi", 400);
      }
      const period = await payrollService.updatePeriodStatus(id, body.status);
      return sendSuccess(c, { period }, "Status periode payroll berhasil diperbarui");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal memperbarui status periode", 400);
    }
  },

  // Payslips
  async getMyPayslips(c: Context) {
    try {
      const user = c.get("user");
      if (!user?.id) {
        return sendError(c, "Unauthorized", 401);
      }
      const slips = await payrollService.getMyPayslips(user.id);
      return sendSuccess(c, { payslips: slips }, "Slip gaji Anda berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil slip gaji", 400);
    }
  },

  async getPayslipById(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) {
        return sendError(c, "ID slip gaji wajib diisi", 400);
      }
      const slip = await payrollService.getPayslipById(id);
      return sendSuccess(c, { payslip: slip }, "Detail slip gaji berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Slip gaji tidak ditemukan", 404);
    }
  },
};

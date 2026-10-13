import { prisma } from "../../db";
import {
  CreatePayrollPeriodDto,
  PayrollPeriod,
  Payslip,
  SalaryStructure,
  UpsertSalaryStructureDto,
} from "./payroll.types";

export const payrollService = {
  // --- SALARY STRUCTURE ---
  async getAllSalaryStructures(): Promise<SalaryStructure[]> {
    const list = await prisma.SalaryStructure.include("user", (u) =>
      u.select("id", "name", "email", "employeeCode"),
    ).all();
    return list as unknown as SalaryStructure[];
  },

  async getSalaryStructure(userId: string): Promise<SalaryStructure | null> {
    const item = await prisma.SalaryStructure.where({ userId }).first();
    return item as unknown as SalaryStructure;
  },

  async upsertSalaryStructure(dto: UpsertSalaryStructureDto): Promise<SalaryStructure> {
    const existing = await prisma.SalaryStructure.where({ userId: dto.userId }).first();

    if (existing) {
      const updated = await prisma.SalaryStructure.where({ userId: dto.userId }).update({
        basicSalary: dto.basicSalary,
        allowance: dto.allowance ?? existing.allowance,
        mealAllowance: dto.mealAllowance ?? existing.mealAllowance,
        transportAllowance: dto.transportAllowance ?? existing.transportAllowance,
        bpjsKesehatan: dto.bpjsKesehatan ?? existing.bpjsKesehatan,
        bpjsKetenagakerjaan: dto.bpjsKetenagakerjaan ?? existing.bpjsKetenagakerjaan,
      });
      return updated as unknown as SalaryStructure;
    }

    const created = await prisma.SalaryStructure.create({
      userId: dto.userId,
      basicSalary: dto.basicSalary,
      allowance: dto.allowance ?? 0,
      mealAllowance: dto.mealAllowance ?? 0,
      transportAllowance: dto.transportAllowance ?? 0,
      bpjsKesehatan: dto.bpjsKesehatan ?? true,
      bpjsKetenagakerjaan: dto.bpjsKetenagakerjaan ?? true,
    });
    return created as unknown as SalaryStructure;
  },

  // --- PERIODS ---
  async getPeriods(): Promise<PayrollPeriod[]> {
    const periods = await prisma.PayrollPeriod.orderBy((p) => p.createdAt.desc()).all();
    return periods as unknown as PayrollPeriod[];
  },

  async getPeriodById(id: string): Promise<PayrollPeriod | null> {
    const period = await prisma.PayrollPeriod.where({ id })
      .include("payslips", (ps) =>
        ps.include("user", (u) =>
          u
            .select("id", "name", "email", "employeeCode")
            .include("department", (d) => d.select("id", "name")),
        ),
      )
      .first();
    if (!period) {
      throw new Error("Periode payroll tidak ditemukan");
    }
    return period as unknown as PayrollPeriod;
  },

  async createPeriod(dto: CreatePayrollPeriodDto): Promise<PayrollPeriod> {
    const period = await prisma.PayrollPeriod.create({
      name: dto.name,
      startDate: dto.startDate,
      endDate: dto.endDate,
      payDate: dto.payDate,
      status: "draft",
      totalAmount: 0,
    });
    return period as unknown as PayrollPeriod;
  },

  // --- GENERATE PAYSLIPS ---
  async generatePayroll(periodId: string): Promise<PayrollPeriod> {
    const period = await prisma.PayrollPeriod.where({ id: periodId }).first();
    if (!period) {
      throw new Error("Periode payroll tidak ditemukan");
    }

    const users = await prisma.User.where({ status: "active" })
      .include("salaryStructure")
      .all();

    let grandTotal = 0;

    for (const user of users) {
      const salary = user.salaryStructure;
      const basicSalary = salary?.basicSalary ?? 0;
      const allowance = salary?.allowance ?? 0;
      const meal = salary?.mealAllowance ?? 0;
      const transport = salary?.transportAllowance ?? 0;
      const totalAllowance = allowance + meal + transport;

      // Hitung Lembur yang approved dalam periode
      const overtimes = await prisma.OvertimeRequest.where({
        userId: user.id,
        status: "approved",
      }).all();

      const validOvertimes = overtimes.filter(
        (o) => o.date >= period.startDate && o.date <= period.endDate,
      );
      const totalOvertimeHours = validOvertimes.reduce(
        (acc, curr) => acc + (curr.durationHours || 0),
        0,
      );
      // Upah per jam standar Depnaker = 1/173 * Gaji Pokok
      const hourlyRate = basicSalary > 0 ? basicSalary / 173 : 0;
      const overtimePay = Math.round(totalOvertimeHours * hourlyRate * 1.5);

      // Hitung Potongan BPJS
      let bpjsKes = 0;
      let bpjsTk = 0;
      if (salary?.bpjsKesehatan && basicSalary > 0) {
        bpjsKes = Math.round(basicSalary * 0.01); // 1% pekerja
      }
      if (salary?.bpjsKetenagakerjaan && basicSalary > 0) {
        bpjsTk = Math.round(basicSalary * 0.03); // 2% JHT + 1% JP
      }
      const totalDeduction = bpjsKes + bpjsTk;

      const netSalary = Math.max(0, basicSalary + totalAllowance + overtimePay - totalDeduction);
      grandTotal += netSalary;

      // Buat atau update Payslip
      const existingSlip = await prisma.Payslip.where({
        periodId,
        userId: user.id,
      }).first();

      let slipId = existingSlip?.id;

      if (existingSlip) {
        await prisma.Payslip.where({ id: existingSlip.id }).update({
          basicSalary,
          totalAllowance,
          totalDeduction,
          overtimePay,
          netSalary,
          status: "draft",
        });
        await prisma.PayslipItem.where({ payslipId: existingSlip.id }).delete();
      } else {
        const createdSlip = await prisma.Payslip.create({
          periodId,
          userId: user.id,
          basicSalary,
          totalAllowance,
          totalDeduction,
          overtimePay,
          netSalary,
          status: "draft",
        });
        slipId = createdSlip.id;
      }

      if (slipId) {
        // Tambahkan Payslip Items
        const items = [
          { name: "Gaji Pokok", type: "earning", amount: basicSalary },
          { name: "Tunjangan Jabatan", type: "earning", amount: allowance },
          { name: "Tunjangan Makan", type: "earning", amount: meal },
          { name: "Tunjangan Transport", type: "earning", amount: transport },
          { name: "Upah Lembur", type: "earning", amount: overtimePay },
          { name: "BPJS Kesehatan (1%)", type: "deduction", amount: bpjsKes },
          { name: "BPJS Ketenagakerjaan (3%)", type: "deduction", amount: bpjsTk },
        ];

        for (const it of items) {
          if (it.amount > 0) {
            await prisma.PayslipItem.create({
              payslipId: slipId,
              name: it.name,
              type: it.type,
              amount: it.amount,
            });
          }
        }
      }
    }

    const updatedPeriod = await prisma.PayrollPeriod.where({ id: periodId }).update({
      totalAmount: grandTotal,
      status: "processed",
    });

    return updatedPeriod as unknown as PayrollPeriod;
  },

  async updatePeriodStatus(periodId: string, status: "draft" | "processed" | "approved" | "paid"): Promise<PayrollPeriod> {
    const updated = await prisma.PayrollPeriod.where({ id: periodId }).update({ status });
    if (status === "paid") {
      const now = new Date().toISOString();
      const slips = await prisma.Payslip.where({ periodId }).all();
      for (const slip of slips) {
        await prisma.Payslip.where({ id: slip.id }).update({
          status: "paid",
          paidAt: now,
        });
      }
    }
    return updated as unknown as PayrollPeriod;
  },

  async getMyPayslips(userId: string): Promise<Payslip[]> {
    const list = await prisma.Payslip.where({ userId })
      .include("period")
      .orderBy((p) => p.createdAt.desc())
      .all();
    return list as unknown as Payslip[];
  },

  async getPayslipById(id: string): Promise<Payslip | null> {
    const slip = await prisma.Payslip.where({ id })
      .include("user", (u) =>
        u
          .select("id", "name", "email", "employeeCode", "nik")
          .include("department", (d) => d.select("id", "name"))
          .include("position", (p) => p.select("id", "name"))
          .include("banking"),
      )
      .include("period")
      .include("items")
      .first();

    if (!slip) {
      throw new Error("Slip gaji tidak ditemukan");
    }
    return slip as unknown as Payslip;
  },
};

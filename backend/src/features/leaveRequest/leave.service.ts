import { prisma } from "../../db";
import {
  CreateLeaveRequestDto,
  Holiday,
  LeaveBalance,
  LeaveRequest,
  UpdateLeaveStatusDto,
} from "./leave.types";

export const leaveRequestService = {
  async getAllLeave(): Promise<LeaveRequest[]> {
    const leaves = await prisma.LeaveRequest.include("user", (user) =>
      user
        .select("id", "name", "email", "employeeCode", "avatar", "role")
        .include("department", (dept) => dept.select("id", "name"))
        .include("position", (pos) => pos.select("id", "name")),
    )
      .orderBy((l) => l.createdAt.desc())
      .all();
    return leaves as LeaveRequest[];
  },

  async createLeave(
    userId: string,
    dto: CreateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    if (new Date(dto.startDate) > new Date(dto.endDate)) {
      throw new Error(
        "Tanggal mulai tidak boleh lebih besar dari tanggal selesai",
      );
    }

    const leave = await prisma.LeaveRequest.create({
      userId,
      type: dto.type,
      startDate: dto.startDate,
      endDate: dto.endDate,
      reason: dto.reason,
      attachment: dto.attachment,
      status: "pending",
    });
    return leave as LeaveRequest;
  },

  async getMyLeaves(userId: string): Promise<LeaveRequest[]> {
    const leaves = await prisma.LeaveRequest.where({ userId })
      .orderBy((l) => l.createdAt.desc())
      .all();
    return leaves as LeaveRequest[];
  },

  async getById(id: string): Promise<LeaveRequest | null> {
    const leave = await prisma.LeaveRequest.where({ id })
      .include("user", (u) =>
        u
          .select("id", "name", "email", "employeeCode", "avatar")
          .include("department", (dept) => dept.select("id", "name")),
      )
      .first();
    if (!leave) {
      throw new Error("Pengajuan cuti tidak ditemukan");
    }
    return leave as LeaveRequest;
  },

  async updateStatus(
    id: string,
    adminId: string,
    dto: UpdateLeaveStatusDto,
  ): Promise<LeaveRequest> {
    const existing = await prisma.LeaveRequest.where({ id }).first();
    if (!existing) {
      throw new Error("Pengajuan cuti tidak ditemukan");
    }

    const updated = await prisma.LeaveRequest.where({ id }).update({
      status: dto.status,
      approvedBy: adminId,
    });

    // Jika cuti tahunan disetujui, potong leave balance
    if (dto.status === "approved" && existing.type === "annual_leave") {
      const year = new Date(existing.startDate).getFullYear() || new Date().getFullYear();
      const start = new Date(existing.startDate);
      const end = new Date(existing.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const balance = await this.getLeaveBalance(existing.userId, year);
      const newUsed = balance.usedDays + diffDays;
      const newRemaining = Math.max(0, balance.totalDays - newUsed);

      await prisma.LeaveBalance.where({ id: balance.id }).update({
        usedDays: newUsed,
        remainingDays: newRemaining,
      });
    }

    return updated as LeaveRequest;
  },

  async getLeaveBalance(userId: string, targetYear?: number): Promise<LeaveBalance> {
    const year = targetYear || new Date().getFullYear();
    let balance = await prisma.LeaveBalance.where({ userId, year }).first();
    if (!balance) {
      balance = await prisma.LeaveBalance.create({
        userId,
        year,
        totalDays: 12,
        usedDays: 0,
        remainingDays: 12,
      });
    }
    return balance as unknown as LeaveBalance;
  },

  async getHolidays(): Promise<Holiday[]> {
    const holidays = await prisma.Holiday.orderBy((h) => h.date.asc()).all();
    return holidays as unknown as Holiday[];
  },

  async createHoliday(name: string, date: string, description?: string): Promise<Holiday> {
    const existing = await prisma.Holiday.where({ date }).first();
    if (existing) {
      throw new Error(`Hari libur pada tanggal ${date} sudah ada`);
    }
    const created = await prisma.Holiday.create({
      name,
      date,
      description: description ?? null,
    });
    return created as unknown as Holiday;
  },
};

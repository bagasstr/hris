import { prisma } from "../../db";
import {
  CreateLeaveRequestDto,
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
      throw new Error("Pengajuan cuti tidak ditumakan");
    }
    const updated = await prisma.LeaveRequest.where({ id }).update({
      status: dto.status,
      approvedBy: adminId,
    });
    return updated as LeaveRequest;
  },
};

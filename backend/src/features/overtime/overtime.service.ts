import { prisma } from "../../db";
import {
  CreateOvertimeDto,
  OvertimeRequest,
  UpdateOvertimeStatusDto,
} from "./overtime.types";

export const overtimeService = {
  async getAll(): Promise<OvertimeRequest[]> {
    const list = await prisma.OvertimeRequest.include("user", (u) =>
      u
        .select("id", "name", "email", "employeeCode")
        .include("department", (d) => d.select("id", "name"))
        .include("position", (p) => p.select("id", "name")),
    )
      .orderBy((o) => o.createdAt.desc())
      .all();
    return list as unknown as OvertimeRequest[];
  },

  async getMyOvertime(userId: string): Promise<OvertimeRequest[]> {
    const list = await prisma.OvertimeRequest.where({ userId })
      .orderBy((o) => o.createdAt.desc())
      .all();
    return list as unknown as OvertimeRequest[];
  },

  async getById(id: string): Promise<OvertimeRequest | null> {
    const item = await prisma.OvertimeRequest.where({ id })
      .include("user", (u) =>
        u
          .select("id", "name", "email", "employeeCode")
          .include("department", (d) => d.select("id", "name"))
          .include("position", (p) => p.select("id", "name")),
      )
      .first();
    if (!item) {
      throw new Error("Pengajuan lembur tidak ditemukan");
    }
    return item as unknown as OvertimeRequest;
  },

  async create(userId: string, dto: CreateOvertimeDto): Promise<OvertimeRequest> {
    if (dto.durationHours <= 0) {
      throw new Error("Durasi lembur harus lebih dari 0 jam");
    }

    const item = await prisma.OvertimeRequest.create({
      userId,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      durationHours: dto.durationHours,
      reason: dto.reason,
      status: "pending",
    });

    return item as unknown as OvertimeRequest;
  },

  async updateStatus(
    id: string,
    adminId: string,
    dto: UpdateOvertimeStatusDto,
  ): Promise<OvertimeRequest> {
    const existing = await prisma.OvertimeRequest.where({ id }).first();
    if (!existing) {
      throw new Error("Pengajuan lembur tidak ditemukan");
    }

    const updated = await prisma.OvertimeRequest.where({ id }).update({
      status: dto.status,
      notes: dto.notes ?? null,
      approvedById: adminId,
    });

    return updated as unknown as OvertimeRequest;
  },
};

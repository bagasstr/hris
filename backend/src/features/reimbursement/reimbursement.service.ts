import { prisma } from "../../db";
import {
  CreateReimbursementDto,
  Reimbursement,
  UpdateReimbursementStatusDto,
} from "./reimbursement.types";

export const reimbursementService = {
  async getAll(): Promise<Reimbursement[]> {
    const list = await prisma.Reimbursement.include("user", (u) =>
      u
        .select("id", "name", "email", "employeeCode")
        .include("department", (d) => d.select("id", "name"))
        .include("position", (p) => p.select("id", "name")),
    )
      .orderBy((r) => r.createdAt.desc())
      .all();
    return list as unknown as Reimbursement[];
  },

  async getMyReimbursements(userId: string): Promise<Reimbursement[]> {
    const list = await prisma.Reimbursement.where({ userId })
      .orderBy((r) => r.createdAt.desc())
      .all();
    return list as unknown as Reimbursement[];
  },

  async getById(id: string): Promise<Reimbursement | null> {
    const item = await prisma.Reimbursement.where({ id })
      .include("user", (u) =>
        u
          .select("id", "name", "email", "employeeCode")
          .include("department", (d) => d.select("id", "name"))
          .include("position", (p) => p.select("id", "name")),
      )
      .first();
    if (!item) {
      throw new Error("Klaim reimbursement tidak ditemukan");
    }
    return item as unknown as Reimbursement;
  },

  async create(userId: string, dto: CreateReimbursementDto): Promise<Reimbursement> {
    if (dto.amount <= 0) {
      throw new Error("Nominal reimbursement harus lebih besar dari 0");
    }

    const item = await prisma.Reimbursement.create({
      userId,
      title: dto.title,
      category: dto.category,
      amount: dto.amount,
      date: dto.date,
      description: dto.description ?? null,
      attachment: dto.attachment ?? null,
      status: "pending",
    });

    return item as unknown as Reimbursement;
  },

  async updateStatus(
    id: string,
    adminId: string,
    dto: UpdateReimbursementStatusDto,
  ): Promise<Reimbursement> {
    const existing = await prisma.Reimbursement.where({ id }).first();
    if (!existing) {
      throw new Error("Klaim reimbursement tidak ditemukan");
    }

    const updatePayload: Record<string, any> = {
      status: dto.status,
      approvedById: adminId,
    };

    if (dto.status === "rejected") {
      updatePayload.rejectedReason = dto.rejectedReason ?? "Ditolak oleh admin";
    }

    if (dto.status === "paid") {
      updatePayload.paidAt = new Date().toISOString();
    }

    const updated = await prisma.Reimbursement.where({ id }).update(updatePayload);
    return updated as unknown as Reimbursement;
  },
};

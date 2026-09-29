import { prisma } from "../../prisma/db";
import type {
  BankChangeRequest,
  CreateBankChangeRequestDto,
  ReviewBankChangeRequestDto,
} from "./bankRequest.types";

export const bankChangeRequestService = {
  // Mengambil semua pengajuan (untuk HR / Super Admin)
  async getAll(status?: string): Promise<BankChangeRequest[]> {
    let query = prisma.BankChangeRequest.include("user", (u) =>
      u.select("id", "name", "email", "employeeCode", "avatar"),
    ).orderBy((b) => b.createdAt.desc());

    if (status) {
      query = query.where({ status });
    }

    const requests = await query.all();
    return requests as unknown as BankChangeRequest[];
  },

  // Karyawan membuat pengajuan ganti rekening
  async create(
    userId: string,
    dto: CreateBankChangeRequestDto,
  ): Promise<BankChangeRequest> {
    if (
      !dto.bankName?.trim() ||
      !dto.accName?.trim() ||
      !dto.accNumber?.trim()
    ) {
      throw new Error(
        "Informasi rekening baru (bankName, accName, accNumber) wajib diisi lengkap",
      );
    }

    // Cek apakah masih ada request sebelumnya yang statusnya masih 'pending'
    const pendingRequest = await prisma.BankChangeRequest.where({
      userId,
      status: "pending",
    }).first();

    if (pendingRequest) {
      throw new Error(
        "Anda masih memiliki pengajuan perubahan rekening yang menunggu persetujuan HR",
      );
    }

    const created = await prisma.BankChangeRequest.create({
      userId,
      bankName: dto.bankName.trim(),
      accName: dto.accName.trim(),
      accNumber: dto.accNumber.trim(),
      reason: dto.reason?.trim() || null,
      attachment: dto.attachment?.trim() || null,
      status: "pending",
    });

    return created as unknown as BankChangeRequest;
  },

  // Riwayat pengajuan milik user yang sedang login
  async getMyRequests(userId: string): Promise<BankChangeRequest[]> {
    const requests = await prisma.BankChangeRequest.where({ userId })
      .orderBy((b) => b.createdAt.desc())
      .all();
    return requests as unknown as BankChangeRequest[];
  },

  // Detail pengajuan berdasarkan ID
  async getById(id: string): Promise<BankChangeRequest> {
    const request = await prisma.BankChangeRequest.where({ id })
      .include("user", (u) =>
        u.select("id", "name", "email", "employeeCode", "avatar"),
      )
      .first();

    if (!request) {
      throw new Error("Pengajuan perubahan rekening tidak ditemukan");
    }
    return request as unknown as BankChangeRequest;
  },

  // HR / Super Admin menyetujui atau menolak pengajuan
  async review(
    id: string,
    reviewerId: string,
    dto: ReviewBankChangeRequestDto,
  ): Promise<BankChangeRequest> {
    const request = await prisma.BankChangeRequest.where({ id }).first();
    if (!request) {
      throw new Error("Pengajuan perubahan rekening tidak ditemukan");
    }

    if (request.status !== "pending") {
      throw new Error(`Pengajuan ini sudah pernah di-${request.status}`);
    }

    if (dto.status === "rejected" && !dto.rejectedReason?.trim()) {
      throw new Error("Alasan penolakan wajib disertakan");
    }

    // Jika disetujui (APPROVED), otomatis perbarui tabel Banking user
    if (dto.status === "approved") {
      const existingBanking = await prisma.Banking.where({
        userId: request.userId,
      }).first();

      if (existingBanking) {
        await prisma.Banking.where({ userId: request.userId }).update({
          bankName: request.bankName,
          accName: request.accName,
          accNumber: request.accNumber,
        });
      } else {
        await prisma.Banking.create({
          userId: request.userId,
          bankName: request.bankName,
          accName: request.accName,
          accNumber: request.accNumber,
        });
      }
    }

    const updated = await prisma.BankChangeRequest.where({ id }).update({
      status: dto.status,
      rejectedReason:
        dto.status === "rejected" ? dto.rejectedReason?.trim() : null,
      approvedById: reviewerId,
    });

    return updated as unknown as BankChangeRequest;
  },
};

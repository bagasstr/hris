import { prisma } from "../../db";
import {
  CreateKpiDto,
  CreateReviewDto,
  KpiItem,
  PerformanceReview,
  UpdateKpiDto,
  UpdateReviewDto,
} from "./performance.types";

export const performanceService = {
  // --- REVIEWS ---
  async getAllReviews(period?: string, userId?: string): Promise<PerformanceReview[]> {
    let query = prisma.PerformanceReview.include("user", (u) =>
      u
        .select("id", "name", "email", "employeeCode")
        .include("department", (d) => d.select("id", "name"))
        .include("position", (p) => p.select("id", "name")),
    )
      .include("kpis", (k) => k.orderBy((item) => item.createdAt.asc()))
      .orderBy((r) => r.createdAt.desc());

    if (period && userId) {
      query = query.where({ period, userId });
    } else if (period) {
      query = query.where({ period });
    } else if (userId) {
      query = query.where({ userId });
    }

    const list = await query.all();
    return list as unknown as PerformanceReview[];
  },

  async getMyReviews(userId: string): Promise<PerformanceReview[]> {
    const list = await prisma.PerformanceReview.where({ userId })
      .include("kpis", (k) => k.orderBy((item) => item.createdAt.asc()))
      .orderBy((r) => r.createdAt.desc())
      .all();
    return list as unknown as PerformanceReview[];
  },

  async getReviewById(id: string): Promise<PerformanceReview | null> {
    const review = await prisma.PerformanceReview.where({ id })
      .include("user", (u) =>
        u
          .select("id", "name", "email", "employeeCode")
          .include("department", (d) => d.select("id", "name"))
          .include("position", (p) => p.select("id", "name")),
      )
      .include("kpis", (k) => k.orderBy((item) => item.createdAt.asc()))
      .first();

    if (!review) {
      throw new Error("Review kinerja tidak ditemukan");
    }
    return review as unknown as PerformanceReview;
  },

  async createReview(reviewerId: string, dto: CreateReviewDto): Promise<PerformanceReview> {
    const user = await prisma.User.where({ id: dto.userId }).first();
    if (!user) {
      throw new Error("Karyawan tidak ditemukan");
    }

    const review = await prisma.PerformanceReview.create({
      userId: dto.userId,
      reviewerId,
      period: dto.period,
      startDate: dto.startDate ?? null,
      endDate: dto.endDate ?? null,
      rating: dto.rating !== undefined ? Number(dto.rating) : null,
      score: dto.score !== undefined ? Number(dto.score) : null,
      feedback: dto.feedback ?? null,
      strengths: dto.strengths ?? null,
      improvements: dto.improvements ?? null,
      status: dto.status ?? "draft",
    });

    return review as unknown as PerformanceReview;
  },

  async updateReview(id: string, reviewerId: string, dto: UpdateReviewDto): Promise<PerformanceReview> {
    const existing = await prisma.PerformanceReview.where({ id }).first();
    if (!existing) {
      throw new Error("Review kinerja tidak ditemukan");
    }

    const updateData: Record<string, any> = { reviewerId };
    if (dto.period !== undefined) updateData.period = dto.period;
    if (dto.startDate !== undefined) updateData.startDate = dto.startDate;
    if (dto.endDate !== undefined) updateData.endDate = dto.endDate;
    if (dto.rating !== undefined) updateData.rating = Number(dto.rating);
    if (dto.score !== undefined) updateData.score = Number(dto.score);
    if (dto.feedback !== undefined) updateData.feedback = dto.feedback;
    if (dto.strengths !== undefined) updateData.strengths = dto.strengths;
    if (dto.improvements !== undefined) updateData.improvements = dto.improvements;
    if (dto.status !== undefined) updateData.status = dto.status;

    const updated = await prisma.PerformanceReview.where({ id }).update(updateData);
    return updated as unknown as PerformanceReview;
  },

  async deleteReview(id: string): Promise<void> {
    const existing = await prisma.PerformanceReview.where({ id }).first();
    if (!existing) {
      throw new Error("Review kinerja tidak ditemukan");
    }
    await prisma.PerformanceReview.where({ id }).delete();
  },

  // --- KPIS ---
  async getKpis(userId?: string, reviewId?: string): Promise<KpiItem[]> {
    let query = prisma.KpiItem.include("user", (u) => u.select("id", "name", "email"))
      .orderBy((k) => k.createdAt.desc());

    if (userId && reviewId) {
      query = query.where({ userId, reviewId });
    } else if (userId) {
      query = query.where({ userId });
    } else if (reviewId) {
      query = query.where({ reviewId });
    }

    const list = await query.all();
    return list as unknown as KpiItem[];
  },

  async getMyKpis(userId: string): Promise<KpiItem[]> {
    const list = await prisma.KpiItem.where({ userId })
      .orderBy((k) => k.createdAt.desc())
      .all();
    return list as unknown as KpiItem[];
  },

  async createKpi(userId: string, dto: CreateKpiDto): Promise<KpiItem> {
    const targetUserId = dto.userId || userId;
    const kpi = await prisma.KpiItem.create({
      userId: targetUserId,
      reviewId: dto.reviewId ?? null,
      title: dto.title,
      description: dto.description ?? null,
      targetValue: dto.targetValue !== undefined ? Number(dto.targetValue) : 100,
      currentValue: dto.currentValue !== undefined ? Number(dto.currentValue) : 0,
      unit: dto.unit ?? "%",
      weight: dto.weight !== undefined ? Number(dto.weight) : 10,
      status: dto.status ?? "in_progress",
      dueDate: dto.dueDate ?? null,
    });

    return kpi as unknown as KpiItem;
  },

  async updateKpi(id: string, dto: UpdateKpiDto): Promise<KpiItem> {
    const existing = await prisma.KpiItem.where({ id }).first();
    if (!existing) {
      throw new Error("KPI item tidak ditemukan");
    }

    const updateData: Record<string, any> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.targetValue !== undefined) updateData.targetValue = Number(dto.targetValue);
    if (dto.currentValue !== undefined) updateData.currentValue = Number(dto.currentValue);
    if (dto.unit !== undefined) updateData.unit = dto.unit;
    if (dto.weight !== undefined) updateData.weight = Number(dto.weight);
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.dueDate !== undefined) updateData.dueDate = dto.dueDate;

    const updated = await prisma.KpiItem.where({ id }).update(updateData);
    return updated as unknown as KpiItem;
  },

  async deleteKpi(id: string): Promise<void> {
    const existing = await prisma.KpiItem.where({ id }).first();
    if (!existing) {
      throw new Error("KPI item tidak ditemukan");
    }
    await prisma.KpiItem.where({ id }).delete();
  },
};

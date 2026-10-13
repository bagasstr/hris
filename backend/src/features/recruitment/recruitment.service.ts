import { prisma } from "../../db";
import {
  Applicant,
  CreateApplicantDto,
  CreateInterviewDto,
  CreateJobPostingDto,
  Interview,
  JobPosting,
  UpdateApplicantStatusDto,
  UpdateInterviewDto,
  UpdateJobPostingDto,
} from "./recruitment.types";

export const recruitmentService = {
  // --- JOB POSTINGS ---
  async getAllJobs(status?: string): Promise<JobPosting[]> {
    let query = prisma.JobPosting.include("department", (d) => d.select("id", "name"))
      .include("position", (p) => p.select("id", "name"))
      .orderBy((j) => j.createdAt.desc());

    if (status) {
      query = query.where({ status });
    }

    const list = await query.all();
    return list as unknown as JobPosting[];
  },

  async getJobById(id: string): Promise<JobPosting | null> {
    const job = await prisma.JobPosting.where({ id })
      .include("department", (d) => d.select("id", "name"))
      .include("position", (p) => p.select("id", "name"))
      .include("applicants", (a) => a.orderBy((app) => app.appliedAt.desc()))
      .first();

    if (!job) {
      throw new Error("Lowongan pekerjaan tidak ditemukan");
    }
    return job as unknown as JobPosting;
  },

  async createJob(dto: CreateJobPostingDto): Promise<JobPosting> {
    const job = await prisma.JobPosting.create({
      title: dto.title,
      departmentId: dto.departmentId ?? null,
      positionId: dto.positionId ?? null,
      employmentType: dto.employmentType ?? "full_time",
      location: dto.location ?? null,
      description: dto.description,
      requirements: dto.requirements ?? null,
      salaryMin: dto.salaryMin ? Number(dto.salaryMin) : null,
      salaryMax: dto.salaryMax ? Number(dto.salaryMax) : null,
      status: dto.status ?? "open",
      deadline: dto.deadline ?? null,
    });
    return job as unknown as JobPosting;
  },

  async updateJob(id: string, dto: UpdateJobPostingDto): Promise<JobPosting> {
    const existing = await prisma.JobPosting.where({ id }).first();
    if (!existing) {
      throw new Error("Lowongan pekerjaan tidak ditemukan");
    }

    const updateData: Record<string, any> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.departmentId !== undefined) updateData.departmentId = dto.departmentId;
    if (dto.positionId !== undefined) updateData.positionId = dto.positionId;
    if (dto.employmentType !== undefined) updateData.employmentType = dto.employmentType;
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.requirements !== undefined) updateData.requirements = dto.requirements;
    if (dto.salaryMin !== undefined) updateData.salaryMin = Number(dto.salaryMin);
    if (dto.salaryMax !== undefined) updateData.salaryMax = Number(dto.salaryMax);
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.deadline !== undefined) updateData.deadline = dto.deadline;

    const updated = await prisma.JobPosting.where({ id }).update(updateData);
    return updated as unknown as JobPosting;
  },

  async deleteJob(id: string): Promise<void> {
    const existing = await prisma.JobPosting.where({ id }).first();
    if (!existing) {
      throw new Error("Lowongan pekerjaan tidak ditemukan");
    }
    await prisma.JobPosting.where({ id }).delete();
  },

  // --- APPLICANTS ---
  async getApplicants(jobId?: string, status?: string): Promise<Applicant[]> {
    let query = prisma.Applicant.include("jobPosting", (j) => j.select("id", "title"))
      .orderBy((a) => a.appliedAt.desc());

    if (jobId && status) {
      query = query.where({ jobPostingId: jobId, status });
    } else if (jobId) {
      query = query.where({ jobPostingId: jobId });
    } else if (status) {
      query = query.where({ status });
    }

    const list = await query.all();
    return list as unknown as Applicant[];
  },

  async getApplicantById(id: string): Promise<Applicant | null> {
    const applicant = await prisma.Applicant.where({ id })
      .include("jobPosting", (j) => j.select("id", "title"))
      .include("interviews", (i) => i.orderBy((item) => item.scheduledAt.asc()))
      .first();

    if (!applicant) {
      throw new Error("Data pelamar tidak ditemukan");
    }
    return applicant as unknown as Applicant;
  },

  async createApplicant(dto: CreateApplicantDto): Promise<Applicant> {
    const job = await prisma.JobPosting.where({ id: dto.jobPostingId }).first();
    if (!job) {
      throw new Error("Lowongan pekerjaan tidak valid");
    }

    const applicant = await prisma.Applicant.create({
      jobPostingId: dto.jobPostingId,
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      resumeUrl: dto.resumeUrl ?? null,
      portfolioUrl: dto.portfolioUrl ?? null,
      coverLetter: dto.coverLetter ?? null,
      status: "applied",
      notes: dto.notes ?? null,
    });

    return applicant as unknown as Applicant;
  },

  async updateApplicantStatus(id: string, dto: UpdateApplicantStatusDto): Promise<Applicant> {
    const existing = await prisma.Applicant.where({ id }).first();
    if (!existing) {
      throw new Error("Data pelamar tidak ditemukan");
    }

    const updated = await prisma.Applicant.where({ id }).update({
      status: dto.status,
      notes: dto.notes !== undefined ? dto.notes : existing.notes,
    });

    return updated as unknown as Applicant;
  },

  // --- INTERVIEWS ---
  async getInterviews(applicantId?: string): Promise<Interview[]> {
    let query = prisma.Interview.include("applicant", (a) => a.select("id", "name", "email"))
      .orderBy((i) => i.scheduledAt.asc());

    if (applicantId) {
      query = query.where({ applicantId });
    }

    const list = await query.all();
    return list as unknown as Interview[];
  },

  async createInterview(dto: CreateInterviewDto): Promise<Interview> {
    const applicant = await prisma.Applicant.where({ id: dto.applicantId }).first();
    if (!applicant) {
      throw new Error("Pelamar tidak ditemukan");
    }

    const interview = await prisma.Interview.create({
      applicantId: dto.applicantId,
      interviewerId: dto.interviewerId ?? null,
      scheduledAt: dto.scheduledAt,
      type: dto.type ?? "online",
      locationOrLink: dto.locationOrLink ?? null,
      notes: dto.notes ?? null,
      status: "scheduled",
      result: "pending",
    });

    // Update status pelamar ke "interview"
    await prisma.Applicant.where({ id: dto.applicantId }).update({
      status: "interview",
    });

    return interview as unknown as Interview;
  },

  async updateInterview(id: string, dto: UpdateInterviewDto): Promise<Interview> {
    const existing = await prisma.Interview.where({ id }).first();
    if (!existing) {
      throw new Error("Jadwal interview tidak ditemukan");
    }

    const updateData: Record<string, any> = {};
    if (dto.scheduledAt !== undefined) updateData.scheduledAt = dto.scheduledAt;
    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.locationOrLink !== undefined) updateData.locationOrLink = dto.locationOrLink;
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.feedback !== undefined) updateData.feedback = dto.feedback;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.result !== undefined) updateData.result = dto.result;

    const updated = await prisma.Interview.where({ id }).update(updateData);
    return updated as unknown as Interview;
  },
};

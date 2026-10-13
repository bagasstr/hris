import type { Context } from "hono";
import { recruitmentService } from "./recruitment.service";
import { sendError, sendSuccess } from "../../common/utils/response";

export const recruitmentController = {
  // Jobs
  async getAllJobs(c: Context) {
    try {
      const status = c.req.query("status");
      const jobs = await recruitmentService.getAllJobs(status);
      return sendSuccess(c, { jobs }, "Data lowongan kerja berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data lowongan kerja", 400);
    }
  },

  async getJobById(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) return sendError(c, "ID lowongan tidak valid", 400);

      const job = await recruitmentService.getJobById(id);
      return sendSuccess(c, { job }, "Detail lowongan berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Lowongan tidak ditemukan", 404);
    }
  },

  async createJob(c: Context) {
    try {
      const body = await c.req.json();
      if (!body.title || !body.description) {
        return sendError(c, "Judul dan deskripsi lowongan wajib diisi", 400);
      }
      const job = await recruitmentService.createJob(body);
      return sendSuccess(c, { job }, "Lowongan kerja berhasil dibuat", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal membuat lowongan kerja", 400);
    }
  },

  async updateJob(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) return sendError(c, "ID lowongan tidak valid", 400);
      const body = await c.req.json();
      const job = await recruitmentService.updateJob(id, body);
      return sendSuccess(c, { job }, "Lowongan kerja berhasil diperbarui");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal memperbarui lowongan kerja", 400);
    }
  },

  async deleteJob(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) return sendError(c, "ID lowongan tidak valid", 400);
      await recruitmentService.deleteJob(id);
      return sendSuccess(c, null, "Lowongan kerja berhasil dihapus");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal menghapus lowongan kerja", 400);
    }
  },

  // Applicants
  async getApplicants(c: Context) {
    try {
      const jobId = c.req.query("jobId");
      const status = c.req.query("status");
      const applicants = await recruitmentService.getApplicants(jobId, status);
      return sendSuccess(c, { applicants }, "Data pelamar berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil data pelamar", 400);
    }
  },

  async getApplicantById(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) return sendError(c, "ID pelamar tidak valid", 400);
      const applicant = await recruitmentService.getApplicantById(id);
      return sendSuccess(c, { applicant }, "Detail pelamar berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Pelamar tidak ditemukan", 404);
    }
  },

  async createApplicant(c: Context) {
    try {
      const body = await c.req.json();
      if (!body.jobPostingId || !body.name || !body.email) {
        return sendError(c, "Job ID, nama, dan email pelamar wajib diisi", 400);
      }
      const applicant = await recruitmentService.createApplicant(body);
      return sendSuccess(c, { applicant }, "Pendaftaran pelamar berhasil", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mendaftarkan pelamar", 400);
    }
  },

  async updateApplicantStatus(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) return sendError(c, "ID pelamar tidak valid", 400);
      const body = await c.req.json();
      if (!body.status) {
        return sendError(c, "Status pelamar wajib diisi", 400);
      }
      const applicant = await recruitmentService.updateApplicantStatus(id, body);
      return sendSuccess(c, { applicant }, "Status pelamar berhasil diperbarui");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal memperbarui status pelamar", 400);
    }
  },

  // Interviews
  async getInterviews(c: Context) {
    try {
      const applicantId = c.req.query("applicantId");
      const interviews = await recruitmentService.getInterviews(applicantId);
      return sendSuccess(c, { interviews }, "Jadwal interview berhasil diambil");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal mengambil jadwal interview", 400);
    }
  },

  async createInterview(c: Context) {
    try {
      const body = await c.req.json();
      if (!body.applicantId || !body.scheduledAt) {
        return sendError(c, "Applicant ID dan jadwal wawancara wajib diisi", 400);
      }
      const interview = await recruitmentService.createInterview(body);
      return sendSuccess(c, { interview }, "Jadwal interview berhasil dibuat", 201);
    } catch (error: any) {
      return sendError(c, error.message || "Gagal membuat jadwal interview", 400);
    }
  },

  async updateInterview(c: Context) {
    try {
      const id = c.req.param("id");
      if (!id) return sendError(c, "ID interview tidak valid", 400);
      const body = await c.req.json();
      const interview = await recruitmentService.updateInterview(id, body);
      return sendSuccess(c, { interview }, "Jadwal interview berhasil diperbarui");
    } catch (error: any) {
      return sendError(c, error.message || "Gagal memperbarui jadwal interview", 400);
    }
  },
};

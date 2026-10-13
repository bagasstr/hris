import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares";
import { recruitmentController } from "./recruitment.controller";

export const recruitmentRoutes = new Hono();

// Public / Candidate routes
recruitmentRoutes.get("/jobs", recruitmentController.getAllJobs);
recruitmentRoutes.get("/jobs/:id", recruitmentController.getJobById);
recruitmentRoutes.post("/applicants/apply", recruitmentController.createApplicant);

// Authenticated HR / Admin routes
recruitmentRoutes.use("*", authMiddleware);

// Job management (HR / Admin)
recruitmentRoutes.post("/jobs", requireRole("super_admin", "hr_manager"), recruitmentController.createJob);
recruitmentRoutes.patch("/jobs/:id", requireRole("super_admin", "hr_manager"), recruitmentController.updateJob);
recruitmentRoutes.delete("/jobs/:id", requireRole("super_admin", "hr_manager"), recruitmentController.deleteJob);

// Applicant management
recruitmentRoutes.get("/applicants", requireRole("super_admin", "hr_manager"), recruitmentController.getApplicants);
recruitmentRoutes.get("/applicants/:id", requireRole("super_admin", "hr_manager"), recruitmentController.getApplicantById);
recruitmentRoutes.patch("/applicants/:id/status", requireRole("super_admin", "hr_manager"), recruitmentController.updateApplicantStatus);

// Interview management
recruitmentRoutes.get("/interviews", requireRole("super_admin", "hr_manager"), recruitmentController.getInterviews);
recruitmentRoutes.post("/interviews", requireRole("super_admin", "hr_manager"), recruitmentController.createInterview);
recruitmentRoutes.patch("/interviews/:id", requireRole("super_admin", "hr_manager"), recruitmentController.updateInterview);

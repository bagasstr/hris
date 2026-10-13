import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares";
import { performanceController } from "./performance.controller";

export const performanceRoutes = new Hono();

performanceRoutes.use("*", authMiddleware);

// Employee routes (View own reviews & KPIs)
performanceRoutes.get("/reviews/my", performanceController.getMyReviews);
performanceRoutes.get("/kpis/my", performanceController.getMyKpis);
performanceRoutes.post("/kpis", performanceController.createKpi);
performanceRoutes.patch("/kpis/:id", performanceController.updateKpi);
performanceRoutes.delete("/kpis/:id", performanceController.deleteKpi);

// Manager / Admin routes (Review appraisals & all KPIs)
performanceRoutes.get("/reviews", requireRole("super_admin", "hr_manager"), performanceController.getAllReviews);
performanceRoutes.get("/reviews/:id", requireRole("super_admin", "hr_manager"), performanceController.getReviewById);
performanceRoutes.post("/reviews", requireRole("super_admin", "hr_manager"), performanceController.createReview);
performanceRoutes.patch("/reviews/:id", requireRole("super_admin", "hr_manager"), performanceController.updateReview);
performanceRoutes.delete("/reviews/:id", requireRole("super_admin", "hr_manager"), performanceController.deleteReview);

performanceRoutes.get("/kpis", requireRole("super_admin", "hr_manager"), performanceController.getKpis);

import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares";
import { overtimeController } from "./overtime.controller";

export const overtimeRoutes = new Hono();

overtimeRoutes.use("*", authMiddleware);
overtimeRoutes.get("/my", overtimeController.getMyOvertime);
overtimeRoutes.post("/", overtimeController.create);
overtimeRoutes.get("/:id", overtimeController.getById);

// Admin / HR routes
overtimeRoutes.get("/", requireRole("super_admin", "hr_manager"), overtimeController.getAll);
overtimeRoutes.patch("/:id/status", requireRole("super_admin", "hr_manager"), overtimeController.updateStatus);

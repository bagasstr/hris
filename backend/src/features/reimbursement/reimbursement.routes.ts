import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares";
import { reimbursementController } from "./reimbursement.controller";

export const reimbursementRoutes = new Hono();

reimbursementRoutes.use("*", authMiddleware);
reimbursementRoutes.get("/my", reimbursementController.getMyReimbursements);
reimbursementRoutes.post("/", reimbursementController.create);
reimbursementRoutes.get("/:id", reimbursementController.getById);

// Admin / HR routes
reimbursementRoutes.get("/", requireRole("super_admin", "hr_manager"), reimbursementController.getAll);
reimbursementRoutes.patch("/:id/status", requireRole("super_admin", "hr_manager"), reimbursementController.updateStatus);

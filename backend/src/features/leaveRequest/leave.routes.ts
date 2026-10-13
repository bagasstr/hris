import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../middlewares";
import { leaveRequestController } from "./leave.controller";

export const leaveRequestRoutes = new Hono();

leaveRequestRoutes.use("*", authMiddleware);

// Specific employee routes
leaveRequestRoutes.get("/balance/my", leaveRequestController.getMyBalance);
leaveRequestRoutes.get("/holidays", leaveRequestController.getHolidays);
leaveRequestRoutes.post("/holidays", requireRole("super_admin", "hr_manager"), leaveRequestController.createHoliday);

leaveRequestRoutes.post("/", leaveRequestController.createLeave);
leaveRequestRoutes.get("/my", leaveRequestController.getMyLeaves);

// Admin / HR routes
leaveRequestRoutes.get("/", requireRole("super_admin", "hr_manager"), leaveRequestController.getAllLeave);
leaveRequestRoutes.patch(
  "/:id/status",
  requireRole("super_admin", "hr_manager"),
  leaveRequestController.updateStatus,
);

// Detail route
leaveRequestRoutes.get("/:id", leaveRequestController.getById);

import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../middlewares";
import { leaveRequestController } from "./leave.controller";

export const leaveRequestRoutes = new Hono();
leaveRequestRoutes.post(
  "/",
  authMiddleware,
  leaveRequestController.createLeave,
);
leaveRequestRoutes.get(
  "/my",
  authMiddleware,
  leaveRequestController.getMyLeaves,
);
leaveRequestRoutes.get("/:id", authMiddleware, leaveRequestController.getById);

leaveRequestRoutes.get(
  "/",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  leaveRequestController.getAllLeave,
);
leaveRequestRoutes.patch(
  "/:id/status",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  leaveRequestController.updateStatus,
);

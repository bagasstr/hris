import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../middlewares";
import { shiftController } from "./shift.controller";

export const shiftRoutes = new Hono();
shiftRoutes.get("/", authMiddleware, shiftController.getAll);
shiftRoutes.get("/:id", authMiddleware, shiftController.getById);
shiftRoutes.post(
  "/",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  shiftController.create,
);
shiftRoutes.put(
  "/:id",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  shiftController.update,
);
shiftRoutes.delete(
  "/:id",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  shiftController.delete,
);

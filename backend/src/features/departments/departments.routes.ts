import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { departmentsController } from "./departments.controller";
import { requireRole } from "../../middlewares";

export const departmentsRoutes = new Hono();

departmentsRoutes.get("/", authMiddleware, departmentsController.getAll);
departmentsRoutes.post(
  "/",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  departmentsController.create,
);

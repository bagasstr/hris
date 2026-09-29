import { Hono } from "hono";
import { employeesController } from "./employees.controller";
import { requireRole } from "../../middlewares/requireRole";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const employeesRoutes = new Hono();

employeesRoutes.get("/", authMiddleware, requireRole("super_admin"), employeesController.getAll);
employeesRoutes.get("/:id", authMiddleware, requireRole("super_admin"), employeesController.getById);
employeesRoutes.delete("/:id", authMiddleware, requireRole("super_admin"), employeesController.delete);

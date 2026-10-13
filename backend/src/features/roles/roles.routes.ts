import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares";
import { rolesController } from "./roles.controller";

export const rolesRoutes = new Hono();

rolesRoutes.use("*", authMiddleware);
rolesRoutes.get("/permissions", requireRole("super_admin", "hr_manager"), rolesController.getPermissions);
rolesRoutes.get("/", requireRole("super_admin", "hr_manager"), rolesController.getAll);
rolesRoutes.get("/:id", requireRole("super_admin", "hr_manager"), rolesController.getById);
rolesRoutes.post("/", requireRole("super_admin"), rolesController.create);
rolesRoutes.put("/:id", requireRole("super_admin"), rolesController.update);
rolesRoutes.delete("/:id", requireRole("super_admin"), rolesController.delete);

import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { positionsController } from "./positions.controller";

export const positionsRoutes = new Hono();

positionsRoutes.get("/", authMiddleware, positionsController.getAll);

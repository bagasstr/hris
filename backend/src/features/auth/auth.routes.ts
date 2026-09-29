import { Hono } from "hono";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const authRoutes = new Hono();

authRoutes.post("/login", authController.login);
authRoutes.post("/register", authController.register);
authRoutes.post("/logout", authController.logout);
authRoutes.get("/me", authMiddleware, authController.getMe);

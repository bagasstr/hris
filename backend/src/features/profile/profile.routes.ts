import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { profileController } from "./profile.controller";

export const profileRoutes = new Hono();

profileRoutes.get("/", authMiddleware, profileController.getProfile);
profileRoutes.put("/", authMiddleware, profileController.updateProfile);
profileRoutes.post("/change-password", authMiddleware, profileController.changePassword);

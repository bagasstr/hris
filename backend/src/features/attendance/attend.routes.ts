import { Hono } from "hono";
import { attendanceController } from "./attend.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/requireRole";

export const attendanceRoutes = new Hono();

// Route untuk Karyawan yang sedang login
attendanceRoutes.post("/clock-in", authMiddleware, attendanceController.clockIn);
attendanceRoutes.post("/clock-out", authMiddleware, attendanceController.clockOut);
attendanceRoutes.get("/today", authMiddleware, attendanceController.getTodayStatus);
attendanceRoutes.get("/history", authMiddleware, attendanceController.getMyHistory);

// Route untuk Admin / HR
attendanceRoutes.get(
  "/present",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  attendanceController.getPresentAll,
);
attendanceRoutes.get(
  "/absent",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  attendanceController.getAbsentAll,
);
attendanceRoutes.get(
  "/sick",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  attendanceController.getSickAll,
);
attendanceRoutes.get(
  "/late",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  attendanceController.getLateAll,
);
attendanceRoutes.get(
  "/leave",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  attendanceController.getLeaveAll,
);
attendanceRoutes.get(
  "/permit",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  attendanceController.getPermitAll,
);
attendanceRoutes.get(
  "/holiday",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  attendanceController.getHolidayAll,
);

import { Hono } from "hono";
import { authMiddleware, requireRole } from "../../middlewares";
import { bankChangeRequestController } from "./bankRequest.controller";

export const bankChangeRequestRoutes = new Hono();

// Karyawan mengajukan perubahan rekening
bankChangeRequestRoutes.post(
  "/",
  authMiddleware,
  bankChangeRequestController.create,
);

// Karyawan melihat riwayat pengajuannya sendiri
bankChangeRequestRoutes.get(
  "/my",
  authMiddleware,
  bankChangeRequestController.getMyRequests,
);

// Detail pengajuan (bisa dilihat oleh karyawan bersangkutan atau HR/Admin)
bankChangeRequestRoutes.get(
  "/:id",
  authMiddleware,
  bankChangeRequestController.getById,
);

// HR / Super Admin melihat semua pengajuan (bisa filter query ?status=pending)
bankChangeRequestRoutes.get(
  "/",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  bankChangeRequestController.getAll,
);

// HR / Super Admin menyetujui atau menolak pengajuan
bankChangeRequestRoutes.patch(
  "/:id/review",
  authMiddleware,
  requireRole("super_admin", "hr_manager"),
  bankChangeRequestController.review,
);

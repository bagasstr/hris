import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares";
import { payrollController } from "./payroll.controller";

export const payrollRoutes = new Hono();

payrollRoutes.use("*", authMiddleware);

// Employee routes
payrollRoutes.get("/my-payslips", payrollController.getMyPayslips);
payrollRoutes.get("/payslips/:id", payrollController.getPayslipById);

// Admin / HR routes
payrollRoutes.get("/salary-structures", requireRole("super_admin", "hr_manager"), payrollController.getAllSalaryStructures);
payrollRoutes.get("/salary-structures/:userId", requireRole("super_admin", "hr_manager"), payrollController.getSalaryStructure);
payrollRoutes.post("/salary-structures", requireRole("super_admin", "hr_manager"), payrollController.upsertSalaryStructure);

payrollRoutes.get("/periods", requireRole("super_admin", "hr_manager"), payrollController.getPeriods);
payrollRoutes.get("/periods/:id", requireRole("super_admin", "hr_manager"), payrollController.getPeriodById);
payrollRoutes.post("/periods", requireRole("super_admin", "hr_manager"), payrollController.createPeriod);
payrollRoutes.post("/periods/:periodId/generate", requireRole("super_admin", "hr_manager"), payrollController.generatePayroll);
payrollRoutes.patch("/periods/:id/status", requireRole("super_admin", "hr_manager"), payrollController.updatePeriodStatus);

import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "./features/auth";
import { employeesRoutes } from "./features/employees";
import { departmentsRoutes } from "./features/departments";
import { profileRoutes } from "./features/profile";
import { positionsRoutes } from "./features/positions";
import { attendanceRoutes } from "./features/attendance";
import { errorHandler, loggerMiddleware } from "./middlewares";
import { config } from "./config";
import { leaveRequestRoutes } from "./features/leaveRequest/leave.routes";
import { shiftRoutes } from "./features/shift";
import { bankChangeRequestRoutes } from "./features/bankChangeRequest";
import { rolesRoutes } from "./features/roles";
import { overtimeRoutes } from "./features/overtime";
import { reimbursementRoutes } from "./features/reimbursement";
import { payrollRoutes } from "./features/payroll";
import { recruitmentRoutes } from "./features/recruitment";
import { performanceRoutes } from "./features/performance";

const app = new Hono();

// Global Middlewares
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (origin) return origin;
      return config.corsOrigin && config.corsOrigin !== "*"
        ? config.corsOrigin
        : "http://localhost:3000";
    },
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use("*", loggerMiddleware);

// Error Handler
app.onError(errorHandler);

// Health Check
app.get("/health", (c) => {
  return c.json({
    name: "HR Management System API",
    status: "online",
    version: "1.0.0",
  });
});

// Feature Routes API v1
const api = new Hono();
api.route("/auth", authRoutes);
api.route("/profile", profileRoutes);
api.route("/departments", departmentsRoutes);
api.route("/positions", positionsRoutes);
api.route("/employees", employeesRoutes);
api.route("/attendance", attendanceRoutes);
api.route("/leaves", leaveRequestRoutes);
api.route("/shift", shiftRoutes);
api.route("/bank-requests", bankChangeRequestRoutes);
api.route("/roles", rolesRoutes);
api.route("/overtime", overtimeRoutes);
api.route("/reimbursement", reimbursementRoutes);
api.route("/payroll", payrollRoutes);
api.route("/recruitment", recruitmentRoutes);
api.route("/performance", performanceRoutes);

app.route("/api/v1", api);

export default {
  port: process.env.PORT,
  fetch: app.fetch,
};

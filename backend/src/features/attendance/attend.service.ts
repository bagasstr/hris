import { prisma } from "../../db";
import {
  Attendance,
  ClockInDto,
  ClockOutDto,
  CreateAttendanceDto,
} from "./attend.types";

export const attendanceService = {
  async getPresentAll(): Promise<Attendance[]> {
    const attend = await prisma.Attendance.where({ status: "present" })
      .include("user", (user) =>
        user
          .select(
            "id",
            "name",
            "phone",
            "email",
            "employeeCode",
            "role",
            "role",
            "avatar",
            "gender",
            "departmentId",
          )
          .include("department", (dept) => dept.select("id", "name"))
          .include("position", (pos) => pos.select("id", "name")),
      )
      .all();
    return attend as Attendance[];
  },
  async getAbsentAll(): Promise<Attendance[]> {
    const attend = await prisma.Attendance.where({ status: "absent" })
      .include("user", (user) =>
        user
          .select(
            "id",
            "name",
            "phone",
            "email",
            "employeeCode",
            "role",
            "role",
            "avatar",
            "gender",
            "departmentId",
          )
          .include("department", (dept) => dept.select("id", "name"))
          .include("position", (pos) => pos.select("id", "name")),
      )
      .all();
    return attend as Attendance[];
  },
  async getSickAll(): Promise<Attendance[]> {
    const attend = await prisma.Attendance.where({ status: "sick" })
      .include("user", (user) =>
        user
          .select(
            "id",
            "name",
            "phone",
            "email",
            "employeeCode",
            "role",
            "role",
            "avatar",
            "gender",
            "departmentId",
          )
          .include("department", (dept) => dept.select("id", "name"))
          .include("position", (pos) => pos.select("id", "name")),
      )
      .all();
    return attend as Attendance[];
  },

  async getLateAll(): Promise<Attendance[]> {
    const attend = await prisma.Attendance.where({ status: "late" })
      .include("user", (user) =>
        user
          .select(
            "id",
            "name",
            "phone",
            "email",
            "employeeCode",
            "role",
            "role",
            "avatar",
            "gender",
            "departmentId",
          )
          .include("department", (dept) => dept.select("id", "name"))
          .include("position", (pos) => pos.select("id", "name")),
      )
      .all();
    return attend as Attendance[];
  },

  async getLeaveAll(): Promise<Attendance[]> {
    const attend = await prisma.Attendance.where({ status: "leave" })
      .include("user", (user) =>
        user
          .select(
            "id",
            "name",
            "phone",
            "email",
            "employeeCode",
            "role",
            "role",
            "avatar",
            "gender",
            "departmentId",
          )
          .include("department", (dept) => dept.select("id", "name"))
          .include("position", (pos) => pos.select("id", "name")),
      )
      .all();
    return attend as Attendance[];
  },

  async getPermitAll(): Promise<Attendance[]> {
    const attend = await prisma.Attendance.where({ status: "permit" })
      .include("user", (user) =>
        user
          .select(
            "id",
            "name",
            "phone",
            "email",
            "employeeCode",
            "role",
            "role",
            "avatar",
            "gender",
            "departmentId",
          )
          .include("department", (dept) => dept.select("id", "name"))
          .include("position", (pos) => pos.select("id", "name")),
      )
      .all();
    return attend as Attendance[];
  },

  async getHolidayAll(): Promise<Attendance[]> {
    const attend = await prisma.Attendance.where({ status: "holiday" })
      .include("user", (user) =>
        user
          .select(
            "id",
            "name",
            "phone",
            "email",
            "employeeCode",
            "role",
            "role",
            "avatar",
            "gender",
            "departmentId",
          )
          .include("department", (dept) => dept.select("id", "name"))
          .include("position", (pos) => pos.select("id", "name")),
      )
      .all();
    return attend as Attendance[];
  },

  async clockIn(userId: string, data: ClockInDto = {}): Promise<Attendance> {
    const today = new Date().toISOString().split("T")[0];
    const nowIso = new Date().toISOString();
    const existing = await prisma.Attendance.where({
      userId,
      date: today,
    }).first();
    if (existing) {
      throw new Error("Anda sudah melakukan absensi masuk hari ini");
    }
    const attendance = await prisma.Attendance.create({
      userId,
      date: today,
      clockIn: nowIso,
      status: "present",
      clockInLat: data.clockInLat,
      clockInLng: data.clockInLng,
      clockInAddress: data.clockInAddress,
      clockInPhoto: data.clockInPhoto,
      notes: data.notes,
    });
    return attendance as Attendance;
  },

  async clockOut(userId: string, data: ClockOutDto = {}): Promise<Attendance> {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const nowIso = now.toISOString();

    const existing = await prisma.Attendance.where({
      userId,
      date: today,
    }).first();
    if (!existing) {
      throw new Error("Anda belum melakukan absensi masuk (clock-in) hari ini");
    }
    if (existing.clockOut) {
      throw new Error(
        "Anda sudah melakukan absensi keluar (clock-out) hari ini",
      );
    }

    let workHours = 0;
    if (existing.clockIn) {
      const inTime = new Date(existing.clockIn).getTime();
      const outTime = now.getTime();
      const diffInHours = (outTime - inTime) / (1000 * 60 * 60);
      workHours = Math.round(diffInHours * 100) / 100;
    }
    const updatedAttendance = await prisma.Attendance.where({
      id: existing.id,
    }).update({
      clockOut: nowIso,
      workHours,
      clockOutLat: data.clockOutLat,
      clockOutLng: data.clockOutLng,
      clockOutAddress: data.clockOutAddress,
      clockOutPhoto: data.clockOutPhoto,
      notes: data.notes
        ? existing.notes
          ? `${existing.notes} | out: ${data.notes}`
          : data.notes
        : existing.notes,
    });
    return updatedAttendance as Attendance;
  },

  async getTodayStatus(userId: string): Promise<Attendance | null> {
    const today = new Date().toISOString().split("T")[0];
    const attend = await prisma.Attendance.where({
      userId,
      date: today,
    }).first();
    return attend as Attendance | null;
  },

  async getMyHistory(userId: string): Promise<Attendance[]> {
    const history = await prisma.Attendance.where({ userId })
      .orderBy([(p) => p.date.desc(), (p) => p.createdAt.desc()])
      .all();
    return history as Attendance[];
  },
};

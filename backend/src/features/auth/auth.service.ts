import { prisma } from "../../prisma/db";
import { departmentsService } from "../departments/departments.service";
import { positionsService } from "../positions/positions.service";
import type { LoginDto, RegisterDto, User, UserProfile } from "./auth.types";

export const authService = {
  async login(
    payload: LoginDto,
    userAgent?: string,
  ): Promise<{ sessionToken: string; user: Omit<User, "password"> }> {
    const user = await prisma.User.where({ email: payload.email }).first();
    if (!user) {
      throw new Error("Email atau password salah");
    }
    const isMatch = await Bun.password.verify(payload.password, user.password);
    if (!isMatch) {
      throw new Error("Email atau password salah");
    }
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    await prisma.Session.create({
      id: crypto.randomUUID(),
      token: sessionToken,
      userId: user.id,
      userAgent: userAgent || null,
      expiresAt: expiresAt as any,
    });
    const { password, ...safeUser } = user;
    return {
      sessionToken,
      user: safeUser as any,
    };
  },

  async register(payload: RegisterDto): Promise<Omit<User, "password">> {
    const existing = await prisma.User.where({
      email: payload.email,
    }).first();
    if (existing) {
      throw new Error("Email sudah digunakan");
    }
    const roleName = payload.role || "employee";
    let targetRole = await prisma.Role.where({ name: roleName }).first();
    if (!targetRole) {
      targetRole = await prisma.Role.create({
        name: roleName,
        displayName: roleName.toUpperCase(),
        description: `Generated ${roleName} role`,
      });
    }
    let departmentId: string | null = null;
    if (payload.department) {
      const dept = await departmentsService.findOrCreate(payload.department);
      departmentId = dept.id;
    }
    let positionId: string | null = null;
    if (payload.position) {
      const pos = await positionsService.findOrCreate(
        payload.position,
        departmentId,
      );
      positionId = pos.id;
    }

    const hashedPassword = await Bun.password.hash(payload.password);
    const newUser = await prisma.User.create({
      email: payload.email,
      password: hashedPassword,
      name: payload.name,
      role: roleName,
      departmentId: departmentId,
      positionId: positionId,
    });
    await prisma.UserRole.create({
      userId: newUser.id,
      roleId: targetRole.id,
    });

    if (
      !payload.bankName?.trim() ||
      !payload.accNumber?.trim() ||
      !payload.accName.trim()
    ) {
      throw new Error("Informasi rekening bank wajib diisi lengkap");
    }
    await prisma.Banking.create({
      userId: newUser.id,
      bankName: payload.bankName.trim(),
      accName: payload.accName.trim(),
      accNumber: payload.accNumber.trim(),
    });

    const { password, ...safeUser } = newUser;
    return safeUser as any;
  },
  async logout(token: string): Promise<void> {
    if (!token) return;
    await prisma.Session.where({ token }).delete();
  },

  async getMe(userId: string): Promise<UserProfile> {
    const user = await prisma.User.where({ id: userId })
      .select("id", "name", "email", "createdAt")
      .include("userRoles", (role) => role.include("role"))
      .include("department", (dept) => dept.select("id", "name", "description"))
      .include("position", (pos) => pos.select("id", "name"))
      .include("banking", (bank) =>
        bank.select("id", "bankName", "accName", "accNumber"),
      )
      .first();
    if (!user) {
      throw new Error("User tidak ditemukan");
    }
    return user as UserProfile;
  },
};

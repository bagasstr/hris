import { prisma } from "../../prisma/db";
import type { UpdateProfileDto, ChangePasswordDto } from "./profile.types";
import type { UserProfile } from "../auth/auth.types";

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await prisma.User.where({ id: userId })
      .select("id", "name", "email", "createdAt", "updatedAt")
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

    return user as unknown as UserProfile;
  },

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserProfile> {
    const user = await prisma.User.where({ id: userId }).first();
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await prisma.User.where({ email: dto.email }).first();
      if (existing && existing.id !== userId) {
        throw new Error("Email sudah digunakan oleh user lain");
      }
    }

    const updateData: Partial<UpdateProfileDto> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.email !== undefined) updateData.email = dto.email;

    await prisma.User.where({ id: userId }).update(updateData);

    return this.getProfile(userId);
  },

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await prisma.User.where({ id: userId }).first();
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const isMatch = await Bun.password.verify(
      dto.currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new Error("Password saat ini salah");
    }

    if (dto.newPassword.length < 6) {
      throw new Error("Password baru minimal 6 karakter");
    }

    const hashedPassword = await Bun.password.hash(dto.newPassword);
    await prisma.User.where({ id: userId }).update({
      password: hashedPassword,
    });

    return { message: "Password berhasil diperbarui" };
  },
};

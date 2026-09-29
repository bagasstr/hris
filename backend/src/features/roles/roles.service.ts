import { prisma } from "../../db";
import { CreateRoleDto, Permission, Role, UpdateRoleDto } from "./roles.types";

export const rolesService = {
  async getAll(): Promise<Role[]> {
    const roles = await prisma.Role.include("rolePermissions", (rp) =>
      rp.include("permission"),
    ).all();
    return roles as Role[];
  },
  async getById(id: string): Promise<Role | null> {
    const role = await prisma.Role.where({ id })
      .include("rolePermissions", (rp) => rp.include("permission"))
      .first();
    if (!role) {
      throw new Error("Role tidak ditemukan");
    }
    return role as Role;
  },
  async create(payload: CreateRoleDto): Promise<Role> {
    const normalizedName = payload.name
      .trim()
      .toLowerCase()
      .replace(/\s+/, "_");
    const existing = await prisma.Role.where({ name: normalizedName }).first();
    if (existing) {
      throw new Error(`Role "${normalizedName}" sudah terdaftar`);
    }

    const role = await prisma.Role.create({
      name: normalizedName,
      displayName: payload.displayName.trim(),
      description: payload.description?.trim() || null,
    });

    if (payload.permissionIds && payload.permissionIds.length > 0) {
      for (const permissionId of payload.permissionIds) {
        await prisma.RolePermission.create({
          roleId: role.id,
          permissionId,
        });
      }
    }
    return (await this.getById(role.id)) as Role;
  },
  async update(id: string, payload: UpdateRoleDto): Promise<Role> {
    const existing = await prisma.Role.where({ id }).first();
    if (!existing) {
      throw new Error("Role tidak ditemukan");
    }
    const updateData: Record<string, any> = {};
    if (payload.displayName) {
      updateData.displayName = payload.displayName.trim();
    }
    if (payload.description !== undefined) {
      updateData.description = payload.description.trim();
    }
    if (Object.keys(updateData).length > 0) {
      await prisma.Role.where({ id }).update(updateData);
    }
    if (payload.permissionIds) {
      await prisma.RolePermission.where({ roleId: id }).delete();
      for (const permissionId of payload.permissionIds) {
        await prisma.RolePermission.create({
          roleId: id,
          permissionId,
        });
      }
    }
    return (await this.getById(id)) as Role;
  },
  async delete(id: string): Promise<Role> {
    const existing = await prisma.Role.where({ id }).first();
    if (!existing) {
      throw new Error("Role tidak ditemukan");
    }
    if (["super_admin", "employee"].includes(existing.name)) {
      throw new Error(`Role default "${existing.name}" tidak boleh dihapus`);
    }
    await prisma.RolePermission.where({ roleId: id }).delete();
    await prisma.Role.where({ id }).delete();
    return existing as Role;
  },
  async getAllPermissions(): Promise<Permission[]> {
    const permissions = await prisma.Permission.all();
    return permissions as Permission[];
  },
};

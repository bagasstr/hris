import { or } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../prisma/db";
import type {
  Employee,
  PaginationQuery,
  PaginationResult,
  UpdateEmployeeDto,
} from "./employees.types";

export const employeesService = {
  async getAll(
    query: PaginationQuery = {},
  ): Promise<PaginationResult<Employee>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const offset = (page - 1) * limit;
    const users = await prisma.User.where({ deletedAt: null })
      .select(
        "id",
        "name",
        "email",
        "role",
        "employeeCode",
        "status",
        "joinDate",
        "phone",
        "avatar",
        "createdAt",
      )
      .include("department", (dept) => dept.select("id", "name"))
      .include("position", (pos) => pos.select("id", "name"))
      .include("userRoles", (ur) => ur.include("role"))
      .include("banking", (bank) =>
        bank.select("id", "bankName", "accName", "accNumber"),
      )
      .offset(offset)
      .limit(limit)
      .all();

    const allUsers = await prisma.User.where({ deletedAt: null })
      .select("id")
      .all();
    const totalItems = allUsers.length;
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: users as unknown as Employee[],
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  },

  async getById(id: string): Promise<Employee | null> {
    const user = await prisma.User.where({ id })
      .select(
        "id",
        "name",
        "email",
        "role",
        "employeeCode",
        "status",
        "joinDate",
        "phone",
        "avatar",
        "birthdate",
        "gender",
        "address",
        "createdAt",
        "updatedAt",
      )
      .include("department", (dept) => dept.select("id", "name", "description"))
      .include("position", (pos) => pos.select("id", "name"))
      .include("userRoles", (ur) => ur.include("role"))
      .include("banking", (bank) =>
        bank.select("id", "bankName", "accName", "accNumber"),
      )
      .first();
    if (!user) {
      throw new Error("User tidak ditemukan");
    }
    return user as unknown as Employee;
  },

  async getByNameOrEmail(name?: string, email?: string) {
    if (!name && !email) {
      throw new Error("Parameter nama atau email harus diisi");
    }

    const user = await prisma.User.where((u) => {
      const matchCriteria = [];
      if (name) matchCriteria.push(u.name.eq(name));
      if (email) matchCriteria.push(u.email.eq(email));
      return or(...matchCriteria);
    })

      .select(
        "id",
        "name",
        "email",
        "role",
        "employeeCode",
        "status",
        "joinDate",
        "phone",
        "avatar",
        "birthdate",
        "gender",
        "address",
        "createdAt",
        "updatedAt",
        "deletedAt",
      )
      .include("department", (dept) => dept.select("id", "name", "description"))
      .include("position", (pos) => pos.select("id", "name"))
      .include("userRoles", (ur) => ur.include("role"))
      .include("banking", (bank) =>
        bank.select("id", "bankName", "accName", "accNumber"),
      )
      .first();

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    if (user.deletedAt !== null || user.status === "INACTIVE") {
      throw new Error("Karyawan sudah resign/mengundurkan diri");
    }

    return user as unknown as Employee;
  },

  async update(id: string, payload: UpdateEmployeeDto): Promise<Employee> {
    const existing = await prisma.User.where({ id }).first();
    if (!existing) {
      throw new Error("User tidak ditemukan");
    }

    if (payload.email && payload.email !== existing.email) {
      const emailExists = await prisma.User.where({
        email: payload.email,
      }).first();
      if (emailExists && emailExists.id !== id) {
        throw new Error("Email sudah digunakan");
      }
    }

    if (
      payload.employeeCode &&
      payload.employeeCode !== existing.employeeCode
    ) {
      const codeExists = await prisma.User.where({
        employeeCode: payload.employeeCode,
      }).first();
      if (codeExists && codeExists.id !== id) {
        throw new Error("Kode karyawan sudah digunakan");
      }
    }
    const { bankName, accName, accNumber, ...userFields } = payload;
    const userUpdateData = Object.fromEntries(
      Object.entries(userFields).filter(([_, value]) => value != undefined),
    );
    if (Object.keys(userUpdateData).length > 0) {
      await prisma.User.where({ id }).update(userUpdateData);
    }

    const bankingData = {
      ...(bankName?.trim() && { bankName: bankName.trim() }),
      ...(accName?.trim() && { accName: accName.trim() }),
      ...(accNumber?.trim() && { accNumber: accNumber.trim() }),
    };

    if (Object.keys(bankingData).length > 0) {
      const existingBanking = await prisma.Banking.where({
        userId: id,
      }).first();
      if (existingBanking) {
        await prisma.Banking.where({ userId: id }).update(bankingData);
      } else if (bankName && accName && accNumber) {
        await prisma.Banking.create({
          userId: id,
          bankName: bankName.trim(),
          accNumber: accNumber.trim(),
          accName: accName.trim(),
        });
      }
    }

    const updated = await this.getById(id);
    return updated as unknown as Employee;
  },

  // soft delete employee
  async delete(id: string) {
    const existing = await prisma.User.where({ id }).first();
    if (!existing) {
      throw new Error("User tidak ditemukan");
    }
    const deleted = {
      deletedAt: new Date().toISOString(),
      status: "INACTIVE",
    };
    const deletedUser = await prisma.User.where({ id }).update(deleted);
    return deletedUser as unknown as Employee;
  },
};

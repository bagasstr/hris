import { prisma } from "../../prisma/db";
import type { CreateDepartmentDto } from "./departments.types";

export const departmentsService = {
  async getAll() {
    return prisma.Department.all();
  },

  async findOrCreate(name: string, description?: string) {
    const trimmed = name.trim();
    let dept = await prisma.Department.where({ name: trimmed }).first();
    if (!dept) {
      dept = await prisma.Department.create({
        name: trimmed,
        description: description || `Department ${trimmed}`,
      });
    }
    return dept;
  },
};

import { prisma } from "../../prisma/db";

export const positionsService = {
  async getAll() {
    return prisma.Position.all();
  },

  async findOrCreate(name: string, departmentId?: string | null) {
    const trimmed = name.trim();
    let pos = await prisma.Position.where({ name: trimmed }).first();
    if (!pos) {
      pos = await prisma.Position.create({
        name: trimmed,
        departmentId: departmentId || null,
      });
    }
    return pos;
  },
};

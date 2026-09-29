import { prisma } from "../../db";
import { CreateShiftDto, Shift, UpdateShiftDto } from "./shift.types";

export const shiftService = {
  async getAll(): Promise<Shift[]> {
    const shifts = await prisma.Shift.all();
    return shifts as Shift[];
  },

  async getById(id: string): Promise<Shift | null> {
    const shift = await prisma.Shift.where({ id }).first();
    if (!shift) {
      throw new Error("Shift tidak ditemukan");
    }
    return shift as Shift;
  },

  async create(payload: CreateShiftDto): Promise<Shift> {
    const trimmedName = payload.name.trim();
    const existing = await prisma.Shift.where({ name: trimmedName }).first();
    if (existing) {
      throw new Error(`Shift dengan nama "${trimmedName}" sudah terdaftar`);
    }
    const shift = await prisma.Shift.create({
      name: trimmedName,
      startTime: payload.startTime.trim(),
      endTime: payload.endTime.trim(),
      graceTime: payload.graceTime ?? 0,
    });
    return shift as Shift;
  },

  async update(id: string, payload: UpdateShiftDto): Promise<Shift> {
    const existing = await prisma.Shift.where({ id }).first();
    if (!existing) {
      throw new Error("Shift tidak ditemukan");
    }

    if (payload.name && payload.name.trim() !== existing.name) {
      const duplicate = await prisma.Shift.where({
        name: payload.name.trim(),
      }).first();
      if (duplicate && duplicate.id !== id) {
        throw new Error(`Shift dengan nama "${payload.name}" sudah digunakan`);
      }
    }
    const updateData = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined),
    );
    const updated = await prisma.Shift.where({
      id,
    }).update(updateData);
    return updated as Shift;
  },

  async delete(id: string): Promise<Shift> {
    const existing = await prisma.Shift.where({ id }).first();
    if (!existing) {
      throw new Error("Shift tidak ditemukan");
    }
    await prisma.Shift.where({ id }).delete();
    return existing as Shift;
  },
};

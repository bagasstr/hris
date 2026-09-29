import { z } from "zod"

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid"),
    password: z
        .string()
        .min(1, "Kata sandi wajib diisi")
        .min(6, "Kata sandi minimal 6 karakter"),
    rememberMe: z.boolean().default(false).optional(),
    role: z.enum(["employee", "hr"]).default("employee"),
})

export type LoginFormValues = z.input<typeof loginSchema>

export const registerEmployeeSchema = z.object({
    fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    departmentId: z.string().min(1, "Departemen wajib dipilih"),
    role: z.enum(["admin", "hr", "manager", "employee"]).default("employee"),
})

export type RegisterEmployeeFormValues = z.infer<typeof registerEmployeeSchema>

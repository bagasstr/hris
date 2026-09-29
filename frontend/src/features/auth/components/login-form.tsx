"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    UserRound,
    ShieldCheck,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { loginSchema, type LoginFormValues } from "../schemas/auth-schema"
import { authService } from "../services/auth-service"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type LoginRole = "employee" | "hr"

interface LoginTabFormProps {
    role: LoginRole
}

function LoginTabForm({ role }: LoginTabFormProps) {
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)
    const [serverError, setServerError] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const isHR = role === "hr"

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
            role,
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true)
        setServerError(null)

        try {
            await authService.login(data)
            router.push(isHR ? "/hr/dashboard" : "/dashboard")
            router.refresh()
        } catch (err: unknown) {
            if (err instanceof Error) {
                setServerError(err.message)
            } else {
                setServerError(
                    "Gagal masuk. Silakan periksa kembali email & sandi Anda.",
                )
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='w-full space-y-5'>
            {serverError && (
                <div className='p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in slide-in-from-top-2'>
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                {/* Hidden role field */}
                <input type='hidden' {...register("role")} />

                {/* Email Field */}
                <div className='space-y-1.5'>
                    <label
                        htmlFor={`${role}-email`}
                        className='text-xs font-semibold text-foreground/80 tracking-wide'
                    >
                        {isHR ? "Email HR / Admin" : "Email Kantor"}
                    </label>
                    <div className='relative'>
                        <Mail className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
                        <Input
                            id={`${role}-email`}
                            type='email'
                            placeholder={
                                isHR
                                    ? "hr@perusahaan.com"
                                    : "nama@perusahaan.com"
                            }
                            className='pl-9 h-10 rounded-xl'
                            disabled={isLoading}
                            {...register("email")}
                        />
                    </div>
                    {errors.email && (
                        <p className='text-xs text-destructive font-medium'>
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div className='space-y-1.5'>
                    <div className='flex items-center justify-between'>
                        <label
                            htmlFor={`${role}-password`}
                            className='text-xs font-semibold text-foreground/80 tracking-wide'
                        >
                            Kata Sandi
                        </label>
                        <Link
                            href='/forgot-password'
                            className='text-xs text-primary hover:underline font-medium'
                        >
                            Lupa sandi?
                        </Link>
                    </div>
                    <div className='relative'>
                        <Lock className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
                        <Input
                            id={`${role}-password`}
                            type={showPassword ? "text" : "password"}
                            placeholder='••••••••'
                            className='pl-9 pr-10 h-10 rounded-xl'
                            disabled={isLoading}
                            {...register("password")}
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className='size-4' />
                            ) : (
                                <Eye className='size-4' />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className='text-xs text-destructive font-medium'>
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Remember Me */}
                <div className='flex items-center gap-2 pt-1'>
                    <input
                        id={`${role}-rememberMe`}
                        type='checkbox'
                        className='size-4 rounded border-border text-primary focus:ring-primary/30 accent-primary cursor-pointer'
                        {...register("rememberMe")}
                    />
                    <label
                        htmlFor={`${role}-rememberMe`}
                        className='text-xs text-muted-foreground select-none cursor-pointer'
                    >
                        Ingat saya di perangkat ini
                    </label>
                </div>

                {/* Submit Button */}
                <Button
                    type='submit'
                    className='h-10 w-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className='size-4 animate-spin mr-2' />
                            Memproses...
                        </>
                    ) : isHR ? (
                        "Masuk sebagai HR / Admin"
                    ) : (
                        "Masuk ke Portal Karyawan"
                    )}
                </Button>
            </form>
        </div>
    )
}

export function LoginForm() {
    return (
        <Tabs defaultValue='employee' className='w-full'>
            <TabsList className='grid w-full grid-cols-2 rounded-xl mb-5 h-10'>
                <TabsTrigger
                    value='employee'
                    className='rounded-lg text-xs font-semibold gap-1.5 data-[state=active]:shadow-sm'
                >
                    <UserRound className='size-3.5' />
                    Karyawan
                </TabsTrigger>
                <TabsTrigger
                    value='hr'
                    className='rounded-lg text-xs font-semibold gap-1.5 data-[state=active]:shadow-sm'
                >
                    <ShieldCheck className='size-3.5' />
                    HR / Admin
                </TabsTrigger>
            </TabsList>

            <TabsContent
                value='employee'
                className='mt-0 animate-in fade-in-0 slide-in-from-left-2 duration-200'
            >
                <LoginTabForm role='employee' />
            </TabsContent>

            <TabsContent
                value='hr'
                className='mt-0 animate-in fade-in-0 slide-in-from-right-2 duration-200'
            >
                <LoginTabForm role='hr' />
            </TabsContent>
        </Tabs>
    )
}

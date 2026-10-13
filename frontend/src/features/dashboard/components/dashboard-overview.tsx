"use client"

import * as React from "react"
import {
    Users,
    CalendarCheck,
    Clock,
    Banknote,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    XCircle,
    UserCheck,
    Briefcase,
    Receipt,
    Award,
} from "lucide-react"

const stats = [
    {
        title: "Total Karyawan",
        value: "128",
        change: "+4 bulan ini",
        trend: "up",
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
        title: "Hadir Hari Ini",
        value: "116",
        change: "90.6% tingkat kehadiran",
        trend: "up",
        icon: CalendarCheck,
        color: "text-emerald-600",
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
        title: "Sedang Cuti / Izin",
        value: "8",
        change: "4 menunggu persetujuan",
        trend: "neutral",
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
        title: "Total Payroll (Bulan Ini)",
        value: "Rp 640 Jt",
        change: "Periode Oktober 2026",
        trend: "up",
        icon: Banknote,
        color: "text-purple-600",
        bg: "bg-purple-50 dark:bg-purple-950/40",
    },
]

const pendingItems = [
    {
        label: "Pengajuan Cuti",
        count: 4,
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50 dark:bg-amber-950/40",
        href: "/leaves",
    },
    {
        label: "Permohonan Lembur",
        count: 7,
        icon: Briefcase,
        color: "text-blue-600",
        bg: "bg-blue-50 dark:bg-blue-950/40",
        href: "/overtime",
    },
    {
        label: "Klaim Reimbursement",
        count: 3,
        icon: Receipt,
        color: "text-rose-600",
        bg: "bg-rose-50 dark:bg-rose-950/40",
        href: "/reimbursement",
    },
    {
        label: "Pelamar Baru",
        count: 12,
        icon: UserCheck,
        color: "text-teal-600",
        bg: "bg-teal-50 dark:bg-teal-950/40",
        href: "/recruitment",
    },
]

const recentActivities = [
    {
        type: "leave_approved",
        icon: CheckCircle2,
        color: "text-emerald-500",
        text: "Cuti Budi Santoso disetujui",
        time: "5 menit lalu",
    },
    {
        type: "employee_joined",
        icon: UserCheck,
        color: "text-blue-500",
        text: "Karyawan baru bergabung: Siti Rahayu",
        time: "1 jam lalu",
    },
    {
        type: "payroll_processed",
        icon: Banknote,
        color: "text-purple-500",
        text: "Payroll Oktober 2026 diproses",
        time: "2 jam lalu",
    },
    {
        type: "overtime_rejected",
        icon: XCircle,
        color: "text-rose-500",
        text: "Lembur Ahmad Fauzi ditolak",
        time: "3 jam lalu",
    },
    {
        type: "alert",
        icon: AlertCircle,
        color: "text-amber-500",
        text: "12 karyawan belum absen hari ini",
        time: "Pagi ini",
    },
    {
        type: "kpi_updated",
        icon: Award,
        color: "text-indigo-500",
        text: "Review KPI Q3 2026 selesai",
        time: "Kemarin",
    },
]

const attendanceOverview = [
    { label: "Hadir", value: 116, color: "bg-emerald-500", pct: 90 },
    { label: "Terlambat", value: 8, color: "bg-amber-500", pct: 6 },
    { label: "Absen", value: 4, color: "bg-rose-500", pct: 3 },
    { label: "Cuti/Izin", value: 8, color: "bg-blue-500", pct: 6 },
]

export function DashboardOverview() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Ringkasan HR</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Selamat datang kembali! Berikut kondisi HR perusahaan per hari ini.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => {
                    const Icon = item.icon
                    return (
                        <div
                            key={item.title}
                            className="rounded-xl border bg-card p-5 shadow-xs space-y-3 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">
                                    {item.title}
                                </span>
                                <div
                                    className={`size-9 rounded-lg flex items-center justify-center ${item.bg}`}
                                >
                                    <Icon className={`size-4 ${item.color}`} />
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold tracking-tight">
                                    {item.value}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    {item.trend === "up" && (
                                        <TrendingUp className="size-3 text-emerald-500" />
                                    )}
                                    {item.change}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Middle Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Kehadiran Hari Ini */}
                <div className="rounded-xl border bg-card p-5 shadow-xs">
                    <h3 className="text-sm font-semibold mb-4">Kehadiran Hari Ini</h3>
                    <div className="space-y-3">
                        {attendanceOverview.map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-muted-foreground">
                                        {item.label}
                                    </span>
                                    <span className="text-xs font-semibold">
                                        {item.value}
                                    </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                                        style={{ width: `${item.pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Perlu Tindakan */}
                <div className="rounded-xl border bg-card p-5 shadow-xs">
                    <h3 className="text-sm font-semibold mb-4">Perlu Tindakan</h3>
                    <div className="space-y-2">
                        {pendingItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors group"
                                >
                                    <div
                                        className={`size-8 rounded-lg flex items-center justify-center ${item.bg} shrink-0`}
                                    >
                                        <Icon className={`size-4 ${item.color}`} />
                                    </div>
                                    <span className="text-sm flex-1 group-hover:text-foreground text-muted-foreground transition-colors">
                                        {item.label}
                                    </span>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted">
                                        {item.count}
                                    </span>
                                </a>
                            )
                        })}
                    </div>
                </div>

                {/* Aktivitas Terbaru */}
                <div className="rounded-xl border bg-card p-5 shadow-xs">
                    <h3 className="text-sm font-semibold mb-4">Aktivitas Terbaru</h3>
                    <div className="space-y-3">
                        {recentActivities.map((item, idx) => {
                            const Icon = item.icon
                            return (
                                <div key={idx} className="flex items-start gap-3">
                                    <Icon className={`size-4 mt-0.5 shrink-0 ${item.color}`} />
                                    <div className="min-w-0">
                                        <p className="text-xs text-foreground leading-snug">
                                            {item.text}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {item.time}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

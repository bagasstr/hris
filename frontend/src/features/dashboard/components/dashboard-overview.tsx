import * as React from "react"
import { Users, CalendarCheck, Clock, Banknote } from "lucide-react"

const stats = [
    {
        title: "Total Karyawan",
        value: "128",
        change: "+4 bulan ini",
        icon: Users,
    },
    {
        title: "Hadir Hari Ini",
        value: "116",
        change: "90.6% kehadiran",
        icon: CalendarCheck,
    },
    {
        title: "Sedang Cuti / Izin",
        value: "8",
        change: "4 menunggu persetujuan",
        icon: Clock,
    },
    {
        title: "Total Payroll (Bulan Ini)",
        value: "Rp 640.000.000",
        change: "Periode September",
        icon: Banknote,
    },
]

export function DashboardOverview() {
    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-2xl font-bold tracking-tight'>Ringkasan HR</h1>
                <p className='text-sm text-muted-foreground'>
                    Selamat datang di sistem manajemen HR. Berikut status operasional perusahaan saat ini.
                </p>
            </div>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                {stats.map((item) => {
                    const Icon = item.icon
                    return (
                        <div
                            key={item.title}
                            className='rounded-xl border bg-card p-5 shadow-xs space-y-3'
                        >
                            <div className='flex items-center justify-between'>
                                <span className='text-xs font-medium text-muted-foreground'>
                                    {item.title}
                                </span>
                                <div className='size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary'>
                                    <Icon className='size-4' />
                                </div>
                            </div>
                            <div>
                                <div className='text-2xl font-bold tracking-tight'>
                                    {item.value}
                                </div>
                                <p className='text-xs text-muted-foreground mt-1'>
                                    {item.change}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

import {
    LayoutDashboard,
    Users,
    Building2,
    CalendarCheck,
    CalendarDays,
    Banknote,
    Receipt,
    UserPlus,
    Award,
    Settings,
    type LucideIcon,
} from "lucide-react"

export interface NavItem {
    title: string
    href: string
    icon: LucideIcon
    badge?: string
}

export interface NavGroupItem {
    label: string
    items: NavItem[]
}

// Menu terstruktur berdasarkan modul HR
export const NAV_GROUPS: NavGroupItem[] = [
    {
        label: "Overview",
        items: [
            {
                title: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        label: "Manajemen Karyawan",
        items: [
            {
                title: "Karyawan",
                href: "/employees",
                icon: Users,
            },
            {
                title: "Departemen & Jabatan",
                href: "/departments",
                icon: Building2,
            },
            {
                title: "Rekrutmen & Pelamar",
                href: "/recruitment",
                icon: UserPlus,
            },
        ],
    },
    {
        label: "Waktu & Kehadiran",
        items: [
            {
                title: "Presensi / Absensi",
                href: "/attendance",
                icon: CalendarCheck,
            },
            {
                title: "Cuti & Izin",
                href: "/leaves",
                icon: CalendarDays,
            },
        ],
    },
    {
        label: "Kompensasi & Kinerja",
        items: [
            {
                title: "Payroll / Gaji",
                href: "/payroll",
                icon: Banknote,
            },
            {
                title: "Klaim / Reimbursement",
                href: "/reimbursement",
                icon: Receipt,
            },
            {
                title: "Performa & KPI",
                href: "/performance",
                icon: Award,
            },
        ],
    },
    {
        label: "Sistem",
        items: [
            {
                title: "Pengaturan",
                href: "/settings",
                icon: Settings,
            },
        ],
    },
]

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items)

// Backward-compatible aliases
export type SidebarItem = NavItem
export type SidebarGroupItem = NavGroupItem
export const SIDEBAR_GROUPS = NAV_GROUPS
export const SIDEBAR_ITEMS = NAV_ITEMS

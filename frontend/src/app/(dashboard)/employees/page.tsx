"use client"

import * as React from "react"
import {
    Users,
    Search,
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    Filter,
    UserCheck,
    UserX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { employeeService, departmentService, positionService, type Employee, type Department, type Position } from "@/lib/services"

function getStatusBadge(status?: string | null) {
    if (status === "active") return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-0 text-xs">Aktif</Badge>
    if (status === "inactive") return <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border-0 text-xs">Non-aktif</Badge>
    return <Badge variant="secondary" className="text-xs">{status || "—"}</Badge>
}

function getRoleBadge(role: string) {
    const map: Record<string, string> = {
        super_admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
        hr_manager: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
        employee: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    }
    const labels: Record<string, string> = {
        super_admin: "Super Admin",
        hr_manager: "HR Manager",
        employee: "Karyawan",
    }
    return (
        <Badge className={`border-0 text-xs ${map[role] || map.employee}`}>
            {labels[role] || role}
        </Badge>
    )
}

function getInitials(name?: string | null, email?: string) {
    if (name) return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    if (email) return email.slice(0, 2).toUpperCase()
    return "??"
}

interface EmployeeFormData {
    name: string
    email: string
    password: string
    nik: string
    employeeCode: string
    role: string
    gender: string
    phone: string
    joinDate: string
    departmentId: string
    positionId: string
}

export default function EmployeesPage() {
    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [departments, setDepartments] = React.useState<Department[]>([])
    const [positions, setPositions] = React.useState<Position[]>([])
    const [loading, setLoading] = React.useState(true)
    const [search, setSearch] = React.useState("")
    const [filterDept, setFilterDept] = React.useState("all")
    const [filterStatus, setFilterStatus] = React.useState("all")
    const [showForm, setShowForm] = React.useState(false)
    const [editTarget, setEditTarget] = React.useState<Employee | null>(null)
    const [submitting, setSubmitting] = React.useState(false)
    const [form, setForm] = React.useState<EmployeeFormData>({
        name: "", email: "", password: "", nik: "", employeeCode: "",
        role: "employee", gender: "", phone: "", joinDate: "",
        departmentId: "", positionId: "",
    })

    React.useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setLoading(true)
        try {
            const [emp, dept, pos] = await Promise.all([
                employeeService.getAll(),
                departmentService.getAll(),
                positionService.getAll(),
            ])
            setEmployees(emp)
            setDepartments(dept)
            setPositions(pos)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const filtered = employees.filter(e => {
        const matchSearch = !search || [e.name, e.email, e.employeeCode, e.nik]
            .some(v => v?.toLowerCase().includes(search.toLowerCase()))
        const matchDept = filterDept === "all" || e.departmentId === filterDept
        const matchStatus = filterStatus === "all" || e.status === filterStatus
        return matchSearch && matchDept && matchStatus
    })

    function openAdd() {
        setEditTarget(null)
        setForm({ name: "", email: "", password: "", nik: "", employeeCode: "", role: "employee", gender: "", phone: "", joinDate: "", departmentId: "", positionId: "" })
        setShowForm(true)
    }

    function openEdit(emp: Employee) {
        setEditTarget(emp)
        setForm({
            name: emp.name || "", email: emp.email, password: "", nik: emp.nik || "",
            employeeCode: emp.employeeCode || "", role: emp.role, gender: emp.gender || "",
            phone: emp.phone || "", joinDate: emp.joinDate || "",
            departmentId: emp.departmentId || "", positionId: emp.positionId || "",
        })
        setShowForm(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (editTarget) {
                const { password, ...updateData } = form
                await employeeService.update(editTarget.id, updateData)
            } else {
                await employeeService.create(form)
            }
            setShowForm(false)
            await loadData()
        } catch (err: any) {
            alert(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Yakin ingin menghapus karyawan ini?")) return
        try {
            await employeeService.delete(id)
            await loadData()
        } catch (err: any) {
            alert(err.message)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="size-6" />
                        Manajemen Karyawan
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Kelola data seluruh karyawan perusahaan
                    </p>
                </div>
                <Button onClick={openAdd} className="gap-2">
                    <Plus className="size-4" />
                    Tambah Karyawan
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama, email, NIK..."
                        className="pl-9"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <Select value={filterDept} onValueChange={v => setFilterDept(v ?? "all")}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="size-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Departemen" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Departemen</SelectItem>
                        {departments.map(d => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={v => setFilterStatus(v ?? "all")}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Non-aktif</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats mini */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <UserCheck className="size-4 text-emerald-500" />
                    {employees.filter(e => e.status === "active").length} Aktif
                </span>
                <span className="flex items-center gap-1.5">
                    <UserX className="size-4 text-rose-500" />
                    {employees.filter(e => e.status === "inactive").length} Non-aktif
                </span>
                <span>Total: {filtered.length} karyawan ditampilkan</span>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Karyawan</TableHead>
                            <TableHead>Kode</TableHead>
                            <TableHead>Departemen</TableHead>
                            <TableHead>Posisi</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Bergabung</TableHead>
                            <TableHead className="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 8 }).map((_, j) => (
                                        <TableCell key={j}>
                                            <div className="h-4 bg-muted rounded animate-pulse" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                    <Users className="size-10 mx-auto mb-3 opacity-30" />
                                    <p>Tidak ada karyawan ditemukan</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map(emp => (
                                <TableRow key={emp.id} className="hover:bg-muted/30">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-8">
                                                <AvatarImage src={emp.avatar || undefined} />
                                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                                    {getInitials(emp.name, emp.email)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{emp.name || "—"}</p>
                                                <p className="text-xs text-muted-foreground">{emp.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm font-mono text-muted-foreground">
                                        {emp.employeeCode || "—"}
                                    </TableCell>
                                    <TableCell className="text-sm">{emp.department?.name || "—"}</TableCell>
                                    <TableCell className="text-sm">{emp.position?.name || "—"}</TableCell>
                                    <TableCell>{getRoleBadge(emp.role)}</TableCell>
                                    <TableCell>{getStatusBadge(emp.status)}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {emp.joinDate || "—"}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger render={
                                                <Button variant="ghost" size="icon-sm">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            } />
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="size-4" />
                                                    Lihat Detail
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEdit(emp)}>
                                                    <Pencil className="size-4" />
                                                    Edit Data
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(emp.id)}
                                                >
                                                    <Trash2 className="size-4" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editTarget ? "Edit Data Karyawan" : "Tambah Karyawan Baru"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="emp-name">Nama Lengkap *</Label>
                                <Input id="emp-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="emp-email">Email *</Label>
                                <Input id="emp-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                            </div>
                        </div>
                        {!editTarget && (
                            <div className="space-y-1.5">
                                <Label htmlFor="emp-password">Password *</Label>
                                <Input id="emp-password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required={!editTarget} />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="emp-nik">NIK</Label>
                                <Input id="emp-nik" value={form.nik} onChange={e => setForm(f => ({ ...f, nik: e.target.value }))} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="emp-code">Kode Karyawan</Label>
                                <Input id="emp-code" value={form.employeeCode} onChange={e => setForm(f => ({ ...f, employeeCode: e.target.value }))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="emp-role">Role</Label>
                                <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v ?? "employee" }))}>
                                    <SelectTrigger id="emp-role"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employee">Karyawan</SelectItem>
                                        <SelectItem value="hr_manager">HR Manager</SelectItem>
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="emp-gender">Jenis Kelamin</Label>
                                <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v ?? "" }))}>
                                    <SelectTrigger id="emp-gender"><SelectValue placeholder="Pilih" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Laki-laki</SelectItem>
                                        <SelectItem value="female">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="emp-dept">Departemen</Label>
                                <Select value={form.departmentId || "none"} onValueChange={v => setForm(f => ({ ...f, departmentId: !v || v === "none" ? "" : v }))}>
                                    <SelectTrigger id="emp-dept"><SelectValue placeholder="Pilih Departemen" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">— Tidak Ada —</SelectItem>
                                        {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="emp-pos">Posisi / Jabatan</Label>
                                <Select value={form.positionId || "none"} onValueChange={v => setForm(f => ({ ...f, positionId: !v || v === "none" ? "" : v }))}>
                                    <SelectTrigger id="emp-pos"><SelectValue placeholder="Pilih Posisi" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">— Tidak Ada —</SelectItem>
                                        {positions.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="emp-phone">No. Telepon</Label>
                                <Input id="emp-phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="emp-join">Tanggal Bergabung</Label>
                                <Input id="emp-join" type="date" value={form.joinDate} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} />
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Tambah Karyawan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

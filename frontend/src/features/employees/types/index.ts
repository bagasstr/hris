export interface Employee {
    id: string
    employeeCode: string
    fullName: string
    email: string
    phone?: string
    departmentId: string
    departmentName: string
    position: string
    joinDate: string
    status: "active" | "inactive" | "probation"
    avatarUrl?: string
}

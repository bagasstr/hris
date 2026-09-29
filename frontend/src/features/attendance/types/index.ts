export interface AttendanceRecord {
    id: string
    employeeId: string
    employeeName: string
    date: string
    checkIn?: string
    checkOut?: string
    status: "present" | "late" | "absent" | "leave"
    notes?: string
}

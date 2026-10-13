import { apiClient } from "@/lib/api-client"

// --- EMPLOYEES ---
export interface Employee {
    id: string
    name: string | null
    email: string
    nik?: string | null
    employeeCode?: string | null
    role: string
    status?: string | null
    gender?: string | null
    birthdate?: string | null
    phone?: string | null
    address?: string | null
    joinDate?: string | null
    avatar?: string | null
    departmentId?: string | null
    positionId?: string | null
    department?: { id: string; name: string } | null
    position?: { id: string; name: string } | null
    banking?: { bankName: string; accNumber: string; accName: string } | null
    createdAt?: string
}

export interface CreateEmployeeDto {
    name: string
    email: string
    password: string
    nik?: string
    employeeCode?: string
    role?: string
    gender?: string
    birthdate?: string
    phone?: string
    address?: string
    joinDate?: string
    departmentId?: string
    positionId?: string
}

export const employeeService = {
    async getAll(params?: { search?: string; departmentId?: string; status?: string }) {
        const res = await apiClient<{ success: boolean; data: { employees: Employee[] } }>(
            "/api/v1/employees",
            { params }
        )
        return res.data.employees
    },
    async getById(id: string) {
        const res = await apiClient<{ success: boolean; data: { employee: Employee } }>(
            `/api/v1/employees/${id}`
        )
        return res.data.employee
    },
    async create(dto: CreateEmployeeDto) {
        const res = await apiClient<{ success: boolean; data: { employee: Employee } }>(
            "/api/v1/employees",
            { method: "POST", body: JSON.stringify(dto) }
        )
        return res.data.employee
    },
    async update(id: string, dto: Partial<CreateEmployeeDto>) {
        const res = await apiClient<{ success: boolean; data: { employee: Employee } }>(
            `/api/v1/employees/${id}`,
            { method: "PATCH", body: JSON.stringify(dto) }
        )
        return res.data.employee
    },
    async delete(id: string) {
        return apiClient(`/api/v1/employees/${id}`, { method: "DELETE" })
    },
}

// --- DEPARTMENTS ---
export interface Department {
    id: string
    name: string
    description?: string | null
    createdAt?: string
}

export const departmentService = {
    async getAll() {
        const res = await apiClient<{ success: boolean; data: { departments: Department[] } }>(
            "/api/v1/departments"
        )
        return res.data.departments
    },
    async create(dto: { name: string; description?: string }) {
        const res = await apiClient<{ success: boolean; data: { department: Department } }>(
            "/api/v1/departments",
            { method: "POST", body: JSON.stringify(dto) }
        )
        return res.data.department
    },
    async update(id: string, dto: { name?: string; description?: string }) {
        const res = await apiClient<{ success: boolean; data: { department: Department } }>(
            `/api/v1/departments/${id}`,
            { method: "PATCH", body: JSON.stringify(dto) }
        )
        return res.data.department
    },
    async delete(id: string) {
        return apiClient(`/api/v1/departments/${id}`, { method: "DELETE" })
    },
}

// --- POSITIONS ---
export interface Position {
    id: string
    name: string
    departmentId?: string | null
    department?: { id: string; name: string } | null
    createdAt?: string
}

export const positionService = {
    async getAll(departmentId?: string) {
        const res = await apiClient<{ success: boolean; data: { positions: Position[] } }>(
            "/api/v1/positions",
            { params: departmentId ? { departmentId } : undefined }
        )
        return res.data.positions
    },
    async create(dto: { name: string; departmentId?: string }) {
        const res = await apiClient<{ success: boolean; data: { position: Position } }>(
            "/api/v1/positions",
            { method: "POST", body: JSON.stringify(dto) }
        )
        return res.data.position
    },
    async update(id: string, dto: { name?: string; departmentId?: string }) {
        const res = await apiClient<{ success: boolean; data: { position: Position } }>(
            `/api/v1/positions/${id}`,
            { method: "PATCH", body: JSON.stringify(dto) }
        )
        return res.data.position
    },
    async delete(id: string) {
        return apiClient(`/api/v1/positions/${id}`, { method: "DELETE" })
    },
}

// --- ATTENDANCE ---
export interface Attendance {
    id: string
    userId: string
    date: string
    clockIn?: string | null
    clockOut?: string | null
    status: string
    lateMinutes?: number | null
    earlyMinutes?: number | null
    workHours?: number | null
    notes?: string | null
    isApproved?: boolean | null
    user?: { id: string; name: string | null; email: string; employeeCode?: string | null } | null
    createdAt?: string
}

export const attendanceService = {
    async getAll(params?: { userId?: string; startDate?: string; endDate?: string }) {
        const res = await apiClient<{ success: boolean; data: { attendance: Attendance[] } }>(
            "/api/v1/attendance",
            { params }
        )
        return res.data.attendance
    },
    async getMyAttendance() {
        const res = await apiClient<{ success: boolean; data: { attendance: Attendance[] } }>(
            "/api/v1/attendance/my"
        )
        return res.data.attendance
    },
    async clockIn(dto: { lat?: number; lng?: number; notes?: string }) {
        const res = await apiClient<{ success: boolean; data: { attendance: Attendance } }>(
            "/api/v1/attendance/clock-in",
            { method: "POST", body: JSON.stringify(dto) }
        )
        return res.data.attendance
    },
    async clockOut(dto: { lat?: number; lng?: number; notes?: string }) {
        const res = await apiClient<{ success: boolean; data: { attendance: Attendance } }>(
            "/api/v1/attendance/clock-out",
            { method: "POST", body: JSON.stringify(dto) }
        )
        return res.data.attendance
    },
}

// --- LEAVE REQUESTS ---
export interface LeaveRequest {
    id: string
    userId: string
    type: string
    startDate: string
    endDate: string
    reason: string
    attachment?: string | null
    status: string
    approvedBy?: string | null
    user?: { id: string; name: string | null; email: string } | null
    createdAt?: string
}

export const leaveService = {
    async getAll(params?: { status?: string }) {
        const res = await apiClient<{ success: boolean; data: { leaveRequests: LeaveRequest[] } }>(
            "/api/v1/leaves",
            { params }
        )
        return res.data.leaveRequests
    },
    async getMy() {
        const res = await apiClient<{ success: boolean; data: { leaveRequests: LeaveRequest[] } }>(
            "/api/v1/leaves/my"
        )
        return res.data.leaveRequests
    },
    async create(dto: { type: string; startDate: string; endDate: string; reason: string }) {
        const res = await apiClient<{ success: boolean; data: { leaveRequest: LeaveRequest } }>(
            "/api/v1/leaves",
            { method: "POST", body: JSON.stringify(dto) }
        )
        return res.data.leaveRequest
    },
    async updateStatus(id: string, status: string) {
        const res = await apiClient<{ success: boolean; data: { leaveRequest: LeaveRequest } }>(
            `/api/v1/leaves/${id}/status`,
            { method: "PATCH", body: JSON.stringify({ status }) }
        )
        return res.data.leaveRequest
    },
}

// --- OVERTIME ---
export interface OvertimeRequest {
    id: string
    userId: string
    date: string
    startTime: string
    endTime: string
    durationHours: number
    reason: string
    status: string
    notes?: string | null
    user?: { id: string; name: string | null; email: string } | null
    createdAt?: string
}

export const overtimeService = {
    async getAll() {
        const res = await apiClient<{ success: boolean; data: { overtimeRequests: OvertimeRequest[] } }>(
            "/api/v1/overtime"
        )
        return res.data.overtimeRequests
    },
    async getMy() {
        const res = await apiClient<{ success: boolean; data: { overtimeRequests: OvertimeRequest[] } }>(
            "/api/v1/overtime/my"
        )
        return res.data.overtimeRequests
    },
    async create(dto: { date: string; startTime: string; endTime: string; durationHours: number; reason: string }) {
        const res = await apiClient<{ success: boolean; data: { overtimeRequest: OvertimeRequest } }>(
            "/api/v1/overtime",
            { method: "POST", body: JSON.stringify(dto) }
        )
        return res.data.overtimeRequest
    },
    async updateStatus(id: string, dto: { status: string; notes?: string }) {
        const res = await apiClient<{ success: boolean; data: { overtimeRequest: OvertimeRequest } }>(
            `/api/v1/overtime/${id}/status`,
            { method: "PATCH", body: JSON.stringify(dto) }
        )
        return res.data.overtimeRequest
    },
}

// --- PAYROLL ---
export interface PayrollPeriod {
    id: string
    name: string
    startDate: string
    endDate: string
    payDate: string
    status: string
    totalAmount: number
    createdAt?: string
}

export interface Payslip {
    id: string
    periodId: string
    userId: string
    basicSalary: number
    totalAllowance: number
    totalDeduction: number
    overtimePay: number
    netSalary: number
    status: string
    paidAt?: string | null
    notes?: string | null
    user?: { id: string; name: string | null; email: string } | null
    period?: PayrollPeriod | null
    createdAt?: string
}

export const payrollService = {
    async getPeriods() {
        const res = await apiClient<{ success: boolean; data: { periods: PayrollPeriod[] } }>(
            "/api/v1/payroll/periods"
        )
        return res.data.periods
    },
    async getPeriodById(id: string) {
        const res = await apiClient<{ success: boolean; data: { period: PayrollPeriod; payslips: Payslip[] } }>(
            `/api/v1/payroll/periods/${id}`
        )
        return res.data
    },
    async createPeriod(dto: { name: string; startDate: string; endDate: string; payDate: string }) {
        const res = await apiClient<{ success: boolean; data: { period: PayrollPeriod } }>(
            "/api/v1/payroll/periods",
            { method: "POST", body: JSON.stringify(dto) }
        )
        return res.data.period
    },
    async processPeriod(id: string) {
        const res = await apiClient<{ success: boolean; data: { period: PayrollPeriod } }>(
            `/api/v1/payroll/periods/${id}/process`,
            { method: "POST" }
        )
        return res.data.period
    },
    async getMyPayslips() {
        const res = await apiClient<{ success: boolean; data: { payslips: Payslip[] } }>(
            "/api/v1/payroll/my-payslips"
        )
        return res.data.payslips
    },
}

// --- REIMBURSEMENT ---
export interface Reimbursement {
    id: string
    userId: string
    title: string
    category: string
    amount: number
    date: string
    description?: string | null
    attachment?: string | null
    status: string
    rejectedReason?: string | null
    approvedById?: string | null
    paidAt?: string | null
    user?: { id: string; name: string | null; email: string } | null
    createdAt?: string
}

export const reimbursementService = {
    async getAll(params?: { status?: string }) {
        const res = await apiClient<{ success: boolean; data: { reimbursements: Reimbursement[] } }>(
            "/api/v1/reimbursement",
            { params }
        )
        return res.data.reimbursements
    },
    async getMy() {
        const res = await apiClient<{ success: boolean; data: { reimbursements: Reimbursement[] } }>(
            "/api/v1/reimbursement/my"
        )
        return res.data.reimbursements
    },
    async create(dto: { title: string; category: string; amount: number; date: string; description?: string }) {
        const res = await apiClient<{ success: boolean; data: { reimbursement: Reimbursement } }>(
            "/api/v1/reimbursement",
            { method: "POST", body: JSON.stringify(dto) }
        )
        return res.data.reimbursement
    },
    async updateStatus(id: string, dto: { status: string; rejectedReason?: string }) {
        const res = await apiClient<{ success: boolean; data: { reimbursement: Reimbursement } }>(
            `/api/v1/reimbursement/${id}/status`,
            { method: "PATCH", body: JSON.stringify(dto) }
        )
        return res.data.reimbursement
    },
}

// --- RECRUITMENT ---
export interface JobPosting {
    id: string
    title: string
    employmentType: string
    location?: string | null
    description: string
    requirements?: string | null
    salaryMin?: number | null
    salaryMax?: number | null
    status: string
    deadline?: string | null
    department?: { id: string; name: string } | null
    position?: { id: string; name: string } | null
    createdAt?: string
}

export interface Applicant {
    id: string
    jobPostingId: string
    name: string
    email: string
    phone?: string | null
    resumeUrl?: string | null
    status: string
    notes?: string | null
    appliedAt?: string
    jobPosting?: { id: string; title: string } | null
}

export const recruitmentService = {
    async getJobs(params?: { status?: string }) {
        const res = await apiClient<{ success: boolean; data: { jobs: JobPosting[] } }>(
            "/api/v1/recruitment/jobs",
            { params }
        )
        return res.data.jobs
    },
    async createJob(dto: Partial<JobPosting> & { title: string; description: string }) {
        const res = await apiClient<{ success: boolean; data: { job: JobPosting } }>(
            "/api/v1/recruitment/jobs",
            { method: "POST", body: JSON.stringify(dto) }
        )
        return res.data.job
    },
    async updateJob(id: string, dto: Partial<JobPosting>) {
        const res = await apiClient<{ success: boolean; data: { job: JobPosting } }>(
            `/api/v1/recruitment/jobs/${id}`,
            { method: "PATCH", body: JSON.stringify(dto) }
        )
        return res.data.job
    },
    async deleteJob(id: string) {
        return apiClient(`/api/v1/recruitment/jobs/${id}`, { method: "DELETE" })
    },
    async getApplicants(params?: { jobId?: string; status?: string }) {
        const res = await apiClient<{ success: boolean; data: { applicants: Applicant[] } }>(
            "/api/v1/recruitment/applicants",
            { params }
        )
        return res.data.applicants
    },
    async updateApplicantStatus(id: string, dto: { status: string; notes?: string }) {
        const res = await apiClient<{ success: boolean; data: { applicant: Applicant } }>(
            `/api/v1/recruitment/applicants/${id}/status`,
            { method: "PATCH", body: JSON.stringify(dto) }
        )
        return res.data.applicant
    },
}

// --- PERFORMANCE ---
export interface PerformanceReview {
    id: string
    userId: string
    period: string
    rating?: number | null
    score?: number | null
    feedback?: string | null
    strengths?: string | null
    improvements?: string | null
    status: string
    user?: { id: string; name: string | null; email: string } | null
    createdAt?: string
}

export interface KpiItem {
    id: string
    userId: string
    title: string
    description?: string | null
    targetValue: number
    currentValue: number
    unit: string
    weight?: number | null
    status: string
    dueDate?: string | null
    createdAt?: string
}

export const performanceService = {
    async getMyReviews() {
        const res = await apiClient<{ success: boolean; data: { reviews: PerformanceReview[] } }>(
            "/api/v1/performance/reviews/my"
        )
        return res.data.reviews
    },
    async getAllReviews(params?: { period?: string; userId?: string }) {
        const res = await apiClient<{ success: boolean; data: { reviews: PerformanceReview[] } }>(
            "/api/v1/performance/reviews",
            { params }
        )
        return res.data.reviews
    },
    async createReview(dto: { userId: string; period: string; rating?: number; feedback?: string }) {
        const res = await apiClient<{ success: boolean; data: { review: PerformanceReview } }>(
            "/api/v1/performance/reviews",
            { method: "POST", body: JSON.stringify(dto) }
        )
        return res.data.review
    },
    async getMyKpis() {
        const res = await apiClient<{ success: boolean; data: { kpis: KpiItem[] } }>(
            "/api/v1/performance/kpis/my"
        )
        return res.data.kpis
    },
    async createKpi(dto: { title: string; targetValue?: number; unit?: string; dueDate?: string }) {
        const res = await apiClient<{ success: boolean; data: { kpi: KpiItem } }>(
            "/api/v1/performance/kpis",
            { method: "POST", body: JSON.stringify(dto) }
        )
        return res.data.kpi
    },
    async updateKpi(id: string, dto: Partial<KpiItem>) {
        const res = await apiClient<{ success: boolean; data: { kpi: KpiItem } }>(
            `/api/v1/performance/kpis/${id}`,
            { method: "PATCH", body: JSON.stringify(dto) }
        )
        return res.data.kpi
    },
}

// --- PROFILE ---
export interface UserProfile {
    id: string
    name: string | null
    email: string
    role: string
    nik?: string | null
    employeeCode?: string | null
    phone?: string | null
    address?: string | null
    avatar?: string | null
    birthdate?: string | null
    gender?: string | null
    joinDate?: string | null
    status?: string | null
    department?: { id: string; name: string } | null
    position?: { id: string; name: string } | null
    banking?: { bankName: string; accNumber: string; accName: string } | null
}

export const profileService = {
    async getProfile() {
        const res = await apiClient<{ success: boolean; data: { user: UserProfile } }>(
            "/api/v1/profile"
        )
        return res.data.user
    },
    async updateProfile(dto: Partial<UserProfile>) {
        const res = await apiClient<{ success: boolean; data: { user: UserProfile } }>(
            "/api/v1/profile",
            { method: "PATCH", body: JSON.stringify(dto) }
        )
        return res.data.user
    },
    async changePassword(dto: { currentPassword: string; newPassword: string }) {
        return apiClient("/api/v1/profile/change-password", {
            method: "PATCH",
            body: JSON.stringify(dto),
        })
    },
}

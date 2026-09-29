import { TimestamptzString } from "@prisma/orm-postgres/target/codec-types";
import { User } from "../auth";

export interface AttendanceUser {
  id: string;
  name: string | null;
  phone?: string | null;
  email: string;
  employeeCode?: string | null;
  role: string;
  avatar?: string | null;
  gender?: string | null;
  departmentId?: string | null;
  department?: {
    id: string;
    name: string;
  } | null;
  position?: {
    id: string;
    name: string;
  } | null;
}
export interface Attendance {
  id: string;
  userId: string;
  user: AttendanceUser;
  date: string;
  clockIn?: TimestamptzString | null;
  clockOut?: TimestamptzString | null;
  status: string;
  lateMinutes?: number | null;
  earlyMinutes?: number | null;
  workHours?: number | null;
  clockInLat?: number | null;
  clockInLng?: number | null;
  clockOutLat?: number | null;
  clockOutLng?: number | null;
  clockInAddress?: string | null;
  clockOutAddress?: string | null;
  clockInPhoto?: string | null;
  clockOutPhoto?: string | null;
  ipAddress?: string | null;
  notes?: string | null;
  isApproved?: boolean | null;
  approveById?: string | null;
  createdAt: TimestamptzString | string;
  updatedAt: TimestamptzString | string;
}

export interface CreateAttendanceDto {
  userId?: string; // Opsional jika ID diambil langsung dari token login
  date?: string; // Format "YYYY-MM-DD" (jika kosong, default hari ini di server)
  clockIn?: string; // ISO Timestamp
  clockOut?: string; // ISO Timestamp
  status?:
    | "present"
    | "late"
    | "absent"
    | "sick"
    | "leave"
    | "permit"
    | "holiday"
    | string;
  notes?: string; // Catatan dari karyawan / HR
  clockInLat?: number; // Latitude GPS saat absen
  clockInLng?: number; // Longitude GPS saat absen
  clockInAddress?: string; // Alamat hasil reverse geocoding
  clockInPhoto?: string; // URL foto selfie bukti kehadiran
  ipAddress?: string; // IP Address perangkat
}
// Khusus request body saat karyawan melakukan tombol "Clock In" (Check-in)
export interface ClockInDto {
  notes?: string;
  clockInLat?: number;
  clockInLng?: number;
  clockInAddress?: string;
  clockInPhoto?: string;
}
// Khusus request body saat "Clock Out" (Check-out)
export interface ClockOutDto {
  notes?: string;
  clockOutLat?: number;
  clockOutLng?: number;
  clockOutAddress?: string;
  clockOutPhoto?: string;
}

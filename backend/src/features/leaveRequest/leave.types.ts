import { TimestamptzString } from "@prisma/orm-postgres/target/codec-types";

export interface LeaveUser {
  id: string;
  name: string | null;
  email: string;
  employeeCode?: string | null;
  avatar?: string | null;
  department?: {
    id: string;
    name: string;
  } | null;
  position?: {
    id: string;
    name: string;
  } | null;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  user?: LeaveUser;
  type: "annual_leave" | "sick" | "permit" | string;
  startDate: string;
  endDate: string;
  reason: string;
  attachment?: string | null;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string | null;
  createdAt: TimestamptzString | string;
  updatedAt: TimestamptzString | string;
}

export interface CreateLeaveRequestDto {
  type: "annual_leave" | "sick" | "permit" | string;
  startDate: string;
  endDate: string;
  reason: string;
  attachment?: string | null;
}

export interface UpdateLeaveStatusDto {
  status: "approved" | "rejected";
}

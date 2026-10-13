export interface OvertimeRequest {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  notes?: string | null;
  approvedById?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    employeeCode: string | null;
    department?: { id: string; name: string } | null;
    position?: { id: string; name: string } | null;
  };
}

export interface CreateOvertimeDto {
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  reason: string;
}

export interface UpdateOvertimeStatusDto {
  status: "approved" | "rejected";
  notes?: string;
}

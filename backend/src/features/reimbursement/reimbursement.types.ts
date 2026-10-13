export interface Reimbursement {
  id: string;
  userId: string;
  title: string;
  category: "medical" | "transport" | "meals" | "office" | "other";
  amount: number;
  date: string;
  description?: string | null;
  attachment?: string | null;
  status: "pending" | "approved" | "rejected" | "paid";
  rejectedReason?: string | null;
  approvedById?: string | null;
  paidAt?: string | null;
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

export interface CreateReimbursementDto {
  title: string;
  category: "medical" | "transport" | "meals" | "office" | "other";
  amount: number;
  date: string;
  description?: string;
  attachment?: string;
}

export interface UpdateReimbursementStatusDto {
  status: "approved" | "rejected" | "paid";
  rejectedReason?: string;
}

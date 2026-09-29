export interface BankChangeRequest {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    employeeCode?: string | null;
    avatar?: string | null;
  };
  bankName: string;
  accName: string;
  accNumber: string;
  reason?: string | null;
  attachment?: string | null;
  status: "pending" | "approved" | "rejected" | string;
  rejectedReason?: string | null;
  approvedById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBankChangeRequestDto {
  bankName: string;
  accName: string;
  accNumber: string;
  reason?: string;
  attachment?: string;
}

export interface ReviewBankChangeRequestDto {
  status: "approved" | "rejected";
  rejectedReason?: string;
}

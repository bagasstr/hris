export interface BankingInfo {
  id: string;
  bankName: string;
  accName: string;
  accNumber: string;
}

export interface Employee {
  id: string;
  name: string | null;
  email: string;
  role: string;
  employeeCode?: string | null;
  status?: string | null;
  joinDate?: string | null;
  phone?: string | null;
  avatar?: string | null;
  department?: { id: string; name: string } | null;
  position?: { id: string; name: string } | null;
  banking?: BankingInfo | null;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
  phone?: string;
  employeeCode?: string;
  departmentId?: string | null;
  positionId?: string | null;
  status?: string;
  joinDate?: string;
  birthdate?: string;
  gender?: string;
  address?: string;
  avatar?: string;
  bankName?: string;
  accName?: string;
  accNumber?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

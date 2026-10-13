export interface SalaryStructure {
  id: string;
  userId: string;
  basicSalary: number;
  allowance: number;
  mealAllowance: number;
  transportAllowance: number;
  bpjsKesehatan: boolean;
  bpjsKetenagakerjaan: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    employeeCode: string | null;
  };
}

export interface UpsertSalaryStructureDto {
  userId: string;
  basicSalary: number;
  allowance?: number;
  mealAllowance?: number;
  transportAllowance?: number;
  bpjsKesehatan?: boolean;
  bpjsKetenagakerjaan?: boolean;
}

export interface PayrollPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: "draft" | "processed" | "approved" | "paid";
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
  payslips?: Payslip[];
}

export interface CreatePayrollPeriodDto {
  name: string;
  startDate: string;
  endDate: string;
  payDate: string;
}

export interface PayslipItem {
  id: string;
  payslipId: string;
  name: string;
  type: "earning" | "deduction";
  amount: number;
  createdAt?: string;
}

export interface Payslip {
  id: string;
  periodId: string;
  userId: string;
  basicSalary: number;
  totalAllowance: number;
  totalDeduction: number;
  overtimePay: number;
  netSalary: number;
  status: "draft" | "approved" | "paid";
  paidAt?: string | null;
  notes?: string | null;
  items?: PayslipItem[];
  user?: {
    id: string;
    name: string | null;
    email: string;
    employeeCode: string | null;
    department?: { id: string; name: string } | null;
    position?: { id: string; name: string } | null;
  };
  period?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    payDate: string;
  };
}

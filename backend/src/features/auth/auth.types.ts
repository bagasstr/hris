export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  userRoles: UserRoleItem[];
}

export interface LoginDto {
  email: string;
  role: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "hr" | "employee";
  position?: string;
  department?: string;
  accName: string;
  accNumber: string;
  bankName: string;
}

export interface UserRoleItem {
  userId: string;
  roleId: string;
  createdAt: string;
}

export interface BankingInfo {
  id: string;
  bankName: string;
  accName: string;
  accNumber: string;
}

// Type Prisma
export type UserProfile = Omit<User, "password" | "role"> & {
  role?: string;
  userRoles: UserRoleItem[];
  banking?: BankingInfo | null;
};

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

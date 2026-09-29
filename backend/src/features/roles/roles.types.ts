export interface Permission {
  id: string;
  name: string;
  displayName: string;
  group: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  permission?: Permission;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string | null;
  rolePermission?: RolePermission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleDto {
  name: string;
  displayName: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRoleDto {
  displayName?: string;
  description?: string;
  permissionIds?: string[];
}

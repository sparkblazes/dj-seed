// src/redux/userManagement/rolehaspermission/rolehaspermissionTypes.ts

export interface RoleHasPermission {
  _id: string;
  role_id: {
    _id: string;
    role_name: string;
  };
  permission_id: {
    _id: string;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RoleHasPermissionListResponse {
  success: boolean;
  message: string;
  data: {
    rolePermissions: RoleHasPermission[];
    pagination: Pagination;
  };
}

export interface RoleHasPermissionSingleResponse {
  success: boolean;
  message: string;
  data: RoleHasPermission;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface CreateRoleHasPermissionInput {
  role_id: string;
  permission_id: string;
}

export interface UpdateRoleHasPermissionInput extends Partial<CreateRoleHasPermissionInput> {}

export interface DropdownRoleHasPermissionResponse {
  success: boolean;
  data: { _id: string; label: string }[];
}

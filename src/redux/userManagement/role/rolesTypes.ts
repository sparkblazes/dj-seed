// src/redux/types/roles.types.ts

export interface Role {
  _id: string;
  role_name: string;
  description: string;
  permissions:{
    _id: string;
    module_name: string;
  },
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RoleListResponse {
  success: boolean;
  message: string;
  data: {
    roles: Role[];
    pagination: Pagination;
  };
}

export interface RoleSingleResponse {
  success: boolean;
  message: string;
  data: Role;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface CreateRoleInput {
  role_name: string;
  description: string;
  permissions: string[];
}

export interface DropdownRoleResponse {
  success: boolean;
  data: { _id: string; module_name: string }[];
}

export interface UpdateRoleInput extends Partial<CreateRoleInput> {}

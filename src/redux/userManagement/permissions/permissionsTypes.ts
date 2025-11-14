// src/redux/userManagement/permissions/permissionsTypes.ts

// Module names
export type ModuleName = "templates" | "business" | "payments";

// Action types
export type ActionType = "create" | "read" | "update" | "delete";

// Permission interface
export interface Permission {
  _id: string;
  module_name: {
    _id: string;
    name: string;
    slug: string;
    route_name: string; 
  };
  actions: ActionType[];
  created_at?: string;
}

// Pagination info
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API responses
export interface PermissionListResponse {
  success: boolean;
  message: string;
  data: {
    permissions: Permission[];
    pagination: Pagination;
  };
}

export interface ModulePermissionListResponse {
  success: boolean;
  message: string;
  data: any[];
}

export interface PermissionSingleResponse {
  success: boolean;
  message: string;
  data: Permission;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// Input types
export interface CreatePermissionInput {
  module_name: ModuleName;
  actions: ActionType[];
}

export interface UpdatePermissionInput extends Partial<CreatePermissionInput> {}

// ✅ Dropdown response type
export interface DropdownPermissionListResponse {
  success: boolean;
  data: { _id: string; module_name: ModuleName }[];
}

export interface ModuleList {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  route_name: string;
  parent_id?: {
    _id: string;
    name: string;
  } | null;
  sort_order?: number;
  description?: string;
  created_at?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ModuleListResponse {
  success: boolean;
  message: string;
  data: {
    modules: ModuleList[];
    pagination: Pagination;
  };
}

export interface ModuleSingleResponse {
  success: boolean;
  message: string;
  data: ModuleList;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface CreateModuleInput {
  name: string;
  slug: string;
  icon?: string;
  route_name: string;
  parent_id?: string | null;
  sort_order?: number;
  description?: string;
}

export interface UpdateModuleInput extends Partial<CreateModuleInput> {}

export interface DropdownModuleListResponse {
  success: boolean;
  data: { _id: string; name: string }[];
}

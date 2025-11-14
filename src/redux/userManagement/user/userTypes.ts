// src/redux/types/userTypes.ts

export interface BusinessProfile {
  business_name?: string;
  tagline?: string;
  about?: string;
  logo?: string;
  website?: string;
  social_links?: Record<string, string>;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  contact_person?: string;
  contact_info?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  provider?: "local" | "google" | "facebook" | "apple";
  providerId?: string;
  profile_pic?: string;
  role_id?: string;
  plan_id?: string;
  language?: string;
  timezone?: string;
  wallet_balance?: number;
  status?: "active" | "inactive" | "banned";
  last_login?: string;
  last_ip?: string;
  device_tokens?: string[];
  business_profile?: BusinessProfile;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: Pagination;
  };
}

export interface UserSingleResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// ✅ Includes all fields needed during create/update
export interface CreateUserInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role_id?: string;
  plan_id?: string;
  profile_pic?: string;
  language?: string;
  timezone?: string;
  wallet_balance?: number;
  status?: "active" | "inactive" | "banned";
  last_ip?: string;
  business_profile?: BusinessProfile;
}

// ✅ Allow partial updates for edit user
export interface UpdateUserInput extends Partial<CreateUserInput> {}

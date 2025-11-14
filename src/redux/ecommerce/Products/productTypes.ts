export interface Product {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  department: string;
  location: string;
  type: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  benefits: string;
  deadline: string;
  is_remote: boolean;
  allow_external_apply: boolean;
  apply_url: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  status: number;
  is_featured: boolean;
  order: number;
  published_at: string;
  views_count: number;
}

// Each dropdown item
export interface ProductDropdown {
  id: number;
  text: string;
}

// Generic reusable API wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
export type ProductDropdownResponse = ApiResponse<ProductDropdown[]>;

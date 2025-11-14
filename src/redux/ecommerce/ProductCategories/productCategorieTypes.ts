export interface ProductCategorie {
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

export interface ProductCategorieDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

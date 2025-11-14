export interface Faqs {
  data: {
    id: any;
    category_id: string;
    question: string;
    answer: string;
    tags: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    status: boolean;
    is_featured: boolean;
    order: number;
    views_count: number;
  }
}

export interface FaqDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

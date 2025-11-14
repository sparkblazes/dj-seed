//src/redux/engagement/FaqCategories/faqCategoriesTypes.ts
export interface FaqCategories {
  data: {
    id: any;
    name: string;
    slug: string;
    description: string;
    icon: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    order: number;
    status: boolean;
    is_featured: boolean;
  }
}

export interface FaqCategoriesDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

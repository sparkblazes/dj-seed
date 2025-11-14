export interface Page {
  data: any;
  date: {
     data: any;
    id: number;
    title: string;
    slug: string;
    content: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    og_image: string;
    parent_id: string;
    type: string;
    template: string;
    is_featured: boolean;
    is_menu_visible: boolean;
    order: 0;
    status: boolean;
    visibility: string;
    published_at: string;
  }
}

export interface PageDropdown {
  id: number;
  title: string;
}
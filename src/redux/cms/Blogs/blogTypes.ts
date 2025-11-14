export interface Blog {
   uuid: any;
  data: {
    category_id: string;
    author_id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    tags: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    og_image: string;
    status: boolean;
    is_featured: boolean;
    published_at: string;
    views_count: 0;
    order: 0
  }
}

export interface BlogDropdown {
  id: number;
  title: string;
}


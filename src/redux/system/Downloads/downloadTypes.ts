export interface Download {
  uuid: any;
  data: {
    id: any;
    title: string;
    slug: string;
    file: string;
    description: string;
    file_type: string;
    version: string;
    file_size: number;
    mime_type: string;
    thumbnail: string;
    category: string;
    tags: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    status: boolean;
    is_featured: boolean;
    order: number;
    published_at: string;
    download_count: number;
    views_count: number;
    uploaded_by: string;
  }
}

export interface DownloadDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

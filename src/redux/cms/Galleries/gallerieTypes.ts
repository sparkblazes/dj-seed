export interface Gallerie {
  uuid: any;
  data: {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover_image: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    status: boolean;
    order: 0,
    published_at: string;
    is_featured: string;
  }
}

export interface GallerieDropdown {
  id: number;
  title: string;
}

// export interface PaginationMeta {
//   current_page: number;
//   per_page: number;
//   total: number;
//   last_page: number;
// }

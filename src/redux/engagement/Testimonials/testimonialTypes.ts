export interface Testimonial {
  uuid: any
  data: {
    name: string;
    designation?: string;
    company?: string;
    location?: string;
    message: string;
    rating?: number;
    image?: string;
    video_url?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    status: string;        // required
    is_featured: boolean;  // required
    order: number;         // required
    meta_title?: string;
    meta_description?: string;
  }
}

export interface TestimonialDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface Event {
  uuid: any;
  data: {
    id: any;
    title: string;
    slug: string;
    subtitle: string;
    description: string;
    banner_image: string;
    thumbnail: string;
    start_date: string;
    end_date: string;
    location: string;
    type: string;
    event_url: string;
    organizer: string;
    contact_email: string;
    contact_phone: string;
    is_registration_open: boolean;
    max_attendees: number;
    registered_count: number;
    ticket_price: number;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    status: boolean;
    is_featured: boolean;
    order: number;
    published_at: string;
    views_count: number;
  }
}

export interface EventDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

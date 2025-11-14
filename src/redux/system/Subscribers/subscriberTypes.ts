export interface Subscriber {
  uuid: any
  data: {
    id: any;
    email: string;
    name: string;
    status: boolean;
    source: string;
    ip_address: string;
    user_agent: string;
    subscribed_at: string;
    unsubscribed_at: string;
    is_bounced: boolean;
    is_verified: boolean;
  }
}

export interface SubscriberDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

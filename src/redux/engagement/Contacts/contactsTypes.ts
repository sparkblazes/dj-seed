export interface Contacts {
  uuid: any;
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    company: string;
    department: string;
    source: number;
    ip_address: number;
    user_agent: string;
    status: string;
    is_spam: boolean;
    follow_up_date: string;
    notes: string;
    assigned_to: string;
  }
}

export interface ContactsDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

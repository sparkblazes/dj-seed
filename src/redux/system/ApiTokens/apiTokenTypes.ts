export interface ApiToken {
  uuid: any;
  data: {
    id: any;
    user_id: string;
    token: string;
    token_type: string;
    scopes: string;
    expires_at: string;
    device_name: string;
    ip_address: string;
    user_agent: string;
    last_used_at: string;
    usage_count: number;
    is_revoked: boolean;
    is_active: boolean;
  }
}

export interface ApiTokenApiDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

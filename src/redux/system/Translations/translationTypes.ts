export interface Translation {
  uuid: any;
  data: {
    id: any;
    language_id: string;
    group: string;
    namespace: string;
    key: string;
    value: string;
    context: string;
    is_html: boolean;
    is_active: boolean;
    version: number;
    last_reviewed_at: string;
  }
}

export interface TranslationDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

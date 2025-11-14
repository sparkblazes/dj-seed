export interface Language {
  uuid: any;
  data: {
    code: string;
    locale: string;
    name: string;
    native_name: string;
    flag: string;
    direction: string;
    is_default: boolean;
    status: boolean;
    order: number;
  }
}

export interface LanguageDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

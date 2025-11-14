export interface Setting {
  uuid: any;
  data: {
    id: any;
    key: string;
    value: string;
    type: string;
    group: string;
    label: string;
    description: string;
    is_autoload: boolean;
    order: number;
  }
}

export interface SettingDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

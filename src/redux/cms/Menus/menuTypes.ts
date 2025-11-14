export interface Menu {
  uuid: any;
  data: {
    uuid: any;
    id: number;
    name: string;
    slug:string
    position: string;
    is_active: boolean;
    is_default: boolean,
    order: 0,
    icon: string,
    css_class: string,
    description: string,
  }
}

export interface MenuDropdown {
  id: number;
  title: string;
}

// export interface PaginationMeta {
//   current_page: number;
//   per_page: number;
//   total: number;
//   last_page: number;
// }

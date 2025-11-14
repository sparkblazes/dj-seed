export interface Banner {
  uuid: any;
  data: {
    title: string;
    subtitle: string;
    image: string;
    background_image: string;
    video_url: string;
    button_text: string;
    button_link: string;
    link: string;
    order: number;
    status: boolean;
    position: string;
    target: "_self";
    start_date: string;
    end_date: string;
  }
}

export interface BannerDropdown {
  id: number;
  title: string;
}

// export interface PaginationMeta {
//   current_page: number;
//   per_page: number;
//   total: number;
//   last_page: number;
// }

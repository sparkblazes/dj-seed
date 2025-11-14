export interface SeoSetting {
  uuid: any;
  data: {
    id: any;
    page_type: string;
    page_id: number;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    og_title: string;
    og_description: string;
    og_type: string;
    og_image: string;
    og_url: string;
    twitter_card: string;
    twitter_title: string;
    twitter_description: string;
    twitter_image: string;
    canonical_url: string;
    robots: string;
    json_ld: string;
    schema_type: string;
  }
}

export interface SeoSettingDropdown {
  id: number;
  title: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

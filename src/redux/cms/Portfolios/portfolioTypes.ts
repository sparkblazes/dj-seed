export interface Portfolio {
  
  uuid: any;
  data:{
  video: string;
  client_name: string;
  image: string;
  banner_image: string;
  subtitle: string;
  author_id: string;
  category_id: string;
  technologies: string;
  project_url: string;
  gallery: string;
  completed_at: string;
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  type: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  status: number;
  is_featured: boolean;
  order: number;
  published_at: string;
  views_count: number;
}
}
export interface PortfolioDropdown {
  id: number;
  title: string;
}


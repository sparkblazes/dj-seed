export interface BlogCategorie {
  uuid: any;
  data:{
  image: string;
  icon: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  status: number;
  is_featured: boolean;
  order: number;
  }
}

export interface BlogCategorieDropdown {
  id: number;
  title: string;
}
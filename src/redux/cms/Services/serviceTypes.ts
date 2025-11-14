export interface Service {
  uuid: any;
  data:{
  icon: string;
  price: string;
  discount_price: string;
  banner_image: string;
  image: string;
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  department: string;
  type: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  status: number;
  is_featured: boolean;
  order: number;
  published_at: string;

}
}

export interface ServiceDropdown {
  id: number;
  title: string;
}



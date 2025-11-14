export interface PortfolioCategorie {
  uuid: any;
  data: {
    name: string;
    slug: string;
    description: string;
    id: number;
    title: string;
    short_description: string;
    image: string;
    icon: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    status: number;
    is_featured: boolean;
    order: number;
  }
}

export interface PortfolioCategorieDropdown {
  id: number;
  title: string;
}

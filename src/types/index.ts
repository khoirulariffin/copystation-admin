
export type User = {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  views: number;
  createdAt: string;
  updatedAt: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  views: number;
  createdAt: string;
  updatedAt: string;
  image?: string;
};

export type DashboardStats = {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  productViews: {
    current: number;
    previous: number;
    percentChange: number;
  };
  totalArticles: number;
  articleViews: {
    current: number;
    previous: number;
    percentChange: number;
  };
  userActivity: {
    total: number;
    active: number;
    percentChange: number;
  };
};

export type ProductCategory = 
  | 'Paper' 
  | 'Stationery' 
  | 'Office Supplies' 
  | 'Printing Services' 
  | 'Electronics' 
  | 'Art Supplies';

export type ArticleCategory = 
  | 'Tips & Tricks' 
  | 'Office Hacks' 
  | 'Productivity' 
  | 'Product Reviews' 
  | 'Tutorials';

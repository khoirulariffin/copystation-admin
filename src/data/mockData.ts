import { User, Product, Article, DashboardStats } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3B82F6&color=fff',
    createdAt: '2023-01-15T08:30:00Z',
    lastLogin: '2023-06-10T14:22:00Z'
  },
  {
    id: '2',
    email: 'editor@example.com',
    role: 'editor',
    avatar: 'https://ui-avatars.com/api/?name=Editor+Smith&background=10B981&color=fff',
    createdAt: '2023-02-20T10:15:00Z',
    lastLogin: '2023-06-09T11:45:00Z'
  },
  {
    id: '3',
    email: 'viewer@example.com',
    role: 'viewer',
    avatar: 'https://ui-avatars.com/api/?name=Viewer+Johnson&background=EF4444&color=fff',
    createdAt: '2023-03-05T14:20:00Z',
    lastLogin: '2023-06-08T09:30:00Z'
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Copy Paper A4',
    description: 'High-quality 80gsm white copy paper, perfect for everyday printing and copying needs.',
    price: 45000,
    category: 'Paper',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&h=400',
    views: 320,
    createdAt: '2023-04-10T08:30:00Z',
    updatedAt: '2023-06-01T11:20:00Z'
  },
  {
    id: '2',
    name: 'Gel Pen Set (10 Colors)',
    description: 'Set of 10 vibrant gel pens with smooth ink flow, ideal for writing and creative projects.',
    price: 35000,
    category: 'Stationery',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=600&h=400',
    views: 245,
    createdAt: '2023-04-15T09:45:00Z',
    updatedAt: '2023-06-02T13:10:00Z'
  },
  {
    id: '3',
    name: 'Professional Stapler',
    description: 'Heavy-duty stapler with ergonomic design, can staple up to 20 sheets at once.',
    price: 85000,
    category: 'Office Supplies',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1583377825569-80c9e67aa330?auto=format&fit=crop&w=600&h=400',
    views: 189,
    createdAt: '2023-04-20T14:20:00Z',
    updatedAt: '2023-06-03T10:35:00Z'
  },
  {
    id: '4',
    name: 'Color Laser Printing Service',
    description: 'Professional color laser printing service, excellent for presentations and brochures.',
    price: 2500,
    category: 'Printing Services',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1595079676601-f1adf5be5dee?auto=format&fit=crop&w=600&h=400',
    views: 412,
    createdAt: '2023-04-25T11:30:00Z',
    updatedAt: '2023-06-04T15:45:00Z'
  },
  {
    id: '5',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI settings and quiet click buttons.',
    price: 120000,
    category: 'Electronics',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=600&h=400',
    views: 356,
    createdAt: '2023-04-30T16:40:00Z',
    updatedAt: '2023-06-05T12:55:00Z'
  },
  {
    id: '6',
    name: 'Artist Sketchbook A3',
    description: 'High-quality sketchbook with 120gsm paper, perfect for drawing and sketching.',
    price: 75000,
    category: 'Art Supplies',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=600&h=400',
    views: 210,
    createdAt: '2023-05-05T10:15:00Z',
    updatedAt: '2023-06-06T09:20:00Z'
  }
];

// Mock Articles
export const mockArticles: Article[] = [
  {
    id: '1',
    title: '10 Ways to Organize Your Office Desk',
    content: `<p>An organized desk is essential for productivity and mental clarity. Here are 10 simple ways to keep your workspace tidy and efficient.</p><h2>1. Use Desk Organizers</h2><p>Invest in quality desk organizers to keep small items like paper clips, pens, and sticky notes in their designated places.</p><h2>2. Cable Management</h2><p>Keep cables organized with cable clips or cable sleeves to prevent tangling and create a cleaner look.</p><h2>3. Document Filing System</h2><p>Implement a simple filing system for your documents to prevent paper clutter on your desk.</p><!-- More content would go here -->`,
    category: 'Office Hacks',
    author: {
      id: '1',
      name: 'Admin User',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3B82F6&color=fff'
    },
    views: 478,
    createdAt: '2023-05-12T08:45:00Z',
    updatedAt: '2023-06-07T11:30:00Z',
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=600&h=400'
  },
  {
    id: '2',
    title: 'How to Choose the Right Paper for Your Printing Needs',
    content: `<p>Selecting the right paper can make a significant difference in your printing projects. This guide will help you understand different paper types and their uses.</p><h2>Paper Weight</h2><p>Paper weight is measured in GSM (grams per square meter). Higher GSM means thicker paper:</p><ul><li>80-90 GSM: Standard office paper</li><li>100-120 GSM: Brochures and flyers</li><li>160-200 GSM: Posters and presentations</li><li>250+ GSM: Business cards and premium materials</li></ul><!-- More content would go here -->`,
    category: 'Product Reviews',
    author: {
      id: '2',
      name: 'Editor Smith',
      avatar: 'https://ui-avatars.com/api/?name=Editor+Smith&background=10B981&color=fff'
    },
    views: 356,
    createdAt: '2023-05-15T14:20:00Z',
    updatedAt: '2023-06-08T13:45:00Z',
    image: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=600&h=400'
  },
  {
    id: '3',
    title: '5 Time-Saving Tips for Document Scanning',
    content: `<p>Document scanning can be tedious, but with these tips, you can streamline the process and save valuable time.</p><h2>1. Prepare Your Documents</h2><p>Remove staples and paper clips, and arrange documents in batches of similar sizes before scanning.</p><h2>2. Use the Right Scanner Settings</h2><p>Adjust DPI based on your needs: 300 DPI for most documents, 600 DPI for documents with small text or images.</p><!-- More content would go here -->`,
    category: 'Tips & Tricks',
    author: {
      id: '1',
      name: 'Admin User',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3B82F6&color=fff'
    },
    views: 289,
    createdAt: '2023-05-18T11:30:00Z',
    updatedAt: '2023-06-09T10:15:00Z',
    image: 'https://images.unsplash.com/photo-1512487186979-a7014b1241c2?auto=format&fit=crop&w=600&h=400'
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalProducts: mockProducts.length,
  availableProducts: mockProducts.filter(p => p.stock > 0).length,
  outOfStockProducts: mockProducts.filter(p => p.stock === 0).length,
  productViews: {
    current: 1832,
    previous: 1547,
    percentChange: 18.4
  },
  totalArticles: mockArticles.length,
  articleViews: {
    current: 1123,
    previous: 987,
    percentChange: 13.8
  },
  userActivity: {
    total: 342,
    active: 128,
    percentChange: 8.5
  }
};

export const productCategories = [
  'Paper', 
  'Stationery', 
  'Office Supplies', 
  'Printing Services', 
  'Electronics', 
  'Art Supplies'
];

export const articleCategories = [
  'Tips & Tricks', 
  'Office Hacks', 
  'Productivity', 
  'Product Reviews', 
  'Tutorials'
];

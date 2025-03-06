
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Grid, List, ChevronRight } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

const ProductsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error(`Failed to fetch products: ${error.message}`);
        throw error;
      }

      return data as Product[];
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .order('category');

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
      return uniqueCategories;
    }
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <PublicLayout>
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Our Products</h1>
          <p className="text-xl text-white/80 max-w-3xl">
            Browse our catalog of high-quality office supplies and printing services.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="w-full lg:w-1/4 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Filter Products</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === 'all' ? 'All Products' : selectedCategory}
                {searchTerm && <span className="text-lg font-normal ml-2">containing "{searchTerm}"</span>}
              </h2>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 mr-2">View:</span>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="h-9 w-9"
                >
                  <Grid className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="h-9 w-9"
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.stock <= 10 && product.stock > 0 && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                          Low Stock: {product.stock} left
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">
                          Rp {product.price.toLocaleString()}
                        </span>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="sm:w-1/4 relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover aspect-video sm:aspect-auto"
                      />
                      {product.stock <= 10 && product.stock > 0 && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                          Low Stock: {product.stock} left
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    <div className="p-6 sm:w-3/4 flex flex-col">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                        <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                      </div>
                      <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <span className="font-bold text-xl">
                          Rp {product.price.toLocaleString()}
                        </span>
                        <Button className="sm:w-auto">View Details</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProductsPage;

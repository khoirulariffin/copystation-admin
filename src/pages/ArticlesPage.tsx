
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Grid, List, ChevronRight, ArrowRight } from 'lucide-react';
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
import { Article } from '@/types';

const ArticlesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      console.log('Fetching articles...');
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles(
            id,
            email,
            avatar
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error(`Failed to fetch articles: ${error.message}`);
        throw error;
      }

      console.log('Received data from Supabase:', data);

      // Map the database fields to match our Article type
      return data.map((article: any) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        category: article.category,
        author: {
          id: article.profiles?.id || article.author_id,
          name: article.profiles?.email || 'Unknown Author',
          avatar: article.profiles?.avatar || 'https://ui-avatars.com/api/?name=Unknown&background=random&color=fff',
        },
        views: article.views,
        createdAt: article.created_at,
        updatedAt: article.updated_at,
        image: article.image || '',
      })) as Article[];
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['article-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
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

  const filteredArticles = articles?.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  console.log('Filtered articles:', filteredArticles);

  return (
    <PublicLayout>
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4">Our Articles</h1>
          <p className="text-xl text-white/80 max-w-3xl">
            Read our latest articles, tips, and insights about office supplies and printing services.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="w-full lg:w-1/4 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Filter Articles</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <Input
                  placeholder="Search articles..."
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
                {selectedCategory === 'all' ? 'All Articles' : selectedCategory}
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
            ) : filteredArticles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <p className="text-gray-500 mb-4">No articles found matching your criteria.</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={article.image || "https://placehold.co/600x400?text=No+Image"} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-500 mb-1">{article.category}</p>
                      <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {article.content.replace(/<[^>]*>?/gm, "").substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={article.author.avatar} 
                            alt={article.author.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="text-sm text-gray-600">{article.author.name}</span>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/articles/${article.id}`} className="flex items-center">
                            Read More <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <div 
                    key={article.id}
                    className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="sm:w-1/4 relative">
                      <img 
                        src={article.image || "https://placehold.co/600x400?text=No+Image"} 
                        alt={article.title}
                        className="w-full h-full object-cover aspect-video sm:aspect-auto"
                      />
                    </div>
                    <div className="p-6 sm:w-3/4 flex flex-col">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{article.category}</p>
                        <h3 className="font-semibold text-xl mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-4">
                          {article.content.replace(/<[^>]*>?/gm, "").substring(0, 200)}...
                        </p>
                      </div>
                      <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center">
                          <img 
                            src={article.author.avatar} 
                            alt={article.author.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="text-sm text-gray-600">{article.author.name}</span>
                        </div>
                        <Button asChild className="sm:w-auto">
                          <Link to={`/articles/${article.id}`}>Read Full Article</Link>
                        </Button>
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

export default ArticlesPage;

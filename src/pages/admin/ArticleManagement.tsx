import React, { useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { FileText, Plus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import SearchFilter from '@/components/admin/SearchFilter';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Article } from '@/types';
import { articleCategories } from '@/data/mockData';
import ArticleForm from '@/components/admin/ArticleForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ArticleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { user } = useAuth();
  
  const { data: articles, isLoading, refetch } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles:author_id (
            id,
            email,
            avatar
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error(`Failed to fetch articles: ${error.message}`);
        console.error('Supabase error:', error);
        throw error;
      }
      
      return data.map((article: any) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        category: article.category,
        author: {
          id: article.profiles.id,
          name: article.profiles.email,
          avatar: article.profiles.avatar
        },
        views: article.views,
        createdAt: article.created_at,
        updatedAt: article.updated_at,
        image: article.image
      }));
    },
  });

  const filteredArticles = articles?.filter(article => {
    const matchesSearchTerm = !searchTerm || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      article.category === selectedCategory;
    
    return matchesSearchTerm && matchesCategory;
  }) || [];

  const columns: Column<Article>[] = [
    {
      header: 'Title',
      accessor: (article) => (
        <div className="flex items-center gap-3">
          {article.image ? (
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-10 h-10 rounded object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <FileText className="h-5 w-5 text-gray-500" />
            </div>
          )}
          <span className="font-medium">{article.title}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
    },
    {
      header: 'Author',
      accessor: (article) => article.author.name,
    },
    {
      header: 'Views',
      accessor: 'views',
    },
    {
      header: 'Published Date',
      accessor: (article) => new Date(article.createdAt).toLocaleDateString(),
    },
  ];

  const handleAdd = () => {
    setSelectedArticle(null);
    setIsFormDialogOpen(true);
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setIsFormDialogOpen(true);
  };

  const handleDelete = (article: Article) => {
    setSelectedArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedArticle) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', selectedArticle.id);
      
      if (error) throw error;
      
      toast.success(`Article "${selectedArticle.title}" deleted successfully`);
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete article: ${error.message}`);
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (articleData: Partial<Article>) => {
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return;
    }
    
    try {
      const now = new Date().toISOString();
      
      if (selectedArticle) {
        const { error } = await supabase
          .from('articles')
          .update({
            title: articleData.title,
            content: articleData.content,
            category: articleData.category,
            image: articleData.image,
            updated_at: now
          })
          .eq('id', selectedArticle.id);
        
        if (error) throw error;
        
        toast.success(`Article "${articleData.title}" updated successfully`);
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([{
            title: articleData.title,
            content: articleData.content,
            category: articleData.category,
            author_id: user.id,
            image: articleData.image,
            views: 0,
            created_at: now,
            updated_at: now
          }]);
        
        if (error) throw error;
        
        toast.success(`Article "${articleData.title}" created successfully`);
      }
      
      setIsFormDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save article');
      console.error(error);
    }
  };

  return (
    <AdminLayout title="Article Management">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Articles</h2>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Article</span>
        </Button>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={articleCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        placeholder="Search articles by title or content..."
      />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading articles...</p>
        </div>
      ) : (
        <DataTable
          data={filteredArticles}
          columns={columns}
          keyExtractor={(article) => article.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      
      <ConfirmDialog
        title="Delete Article"
        description={`Are you sure you want to delete "${selectedArticle?.title}"? This action cannot be undone.`}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
      
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedArticle ? 'Edit Article' : 'Add Article'}
            </DialogTitle>
          </DialogHeader>
          <ArticleForm 
            article={selectedArticle}
            categories={articleCategories}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ArticleManagement;

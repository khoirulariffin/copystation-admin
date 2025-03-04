
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
import { mockArticles, articleCategories } from '@/data/mockData';
import ArticleForm from '@/components/admin/ArticleForm';

const ArticleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // In a real app, this would be a query to your backend/API
  const { data: articles, isLoading, refetch } = useQuery({
    queryKey: ['articles'],
    queryFn: () => Promise.resolve(mockArticles),
  });

  const filteredArticles = articles?.filter(article => {
    // Filter by search term
    const matchesSearchTerm = !searchTerm || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
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
      // In a real app, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Article "${selectedArticle.title}" deleted successfully`);
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error('Failed to delete article');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (articleData: Partial<Article>) => {
    try {
      // In a real app, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedArticle) {
        toast.success(`Article "${articleData.title}" updated successfully`);
      } else {
        toast.success(`Article "${articleData.title}" created successfully`);
      }
      
      setIsFormDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error(selectedArticle ? 'Failed to update article' : 'Failed to create article');
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

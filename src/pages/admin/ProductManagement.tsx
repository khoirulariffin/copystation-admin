
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import SearchFilter from '@/components/admin/SearchFilter';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product } from '@/types';
import { mockProducts, productCategories } from '@/data/mockData';
import ProductForm from '@/components/admin/ProductForm';

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // In a real app, this would be a query to your backend/API
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => Promise.resolve(mockProducts),
  });

  const filteredProducts = products?.filter(product => {
    // Filter by search term
    const matchesSearchTerm = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || 
      product.category === selectedCategory;
    
    return matchesSearchTerm && matchesCategory;
  }) || [];

  const columns: Column<Product>[] = [
    {
      header: 'Product',
      accessor: (product) => (
        <div className="flex items-center gap-3">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-10 h-10 rounded object-cover"
          />
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground truncate max-w-[300px]">
              {product.description.length > 60 
                ? product.description.substring(0, 60) + '...' 
                : product.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
    },
    {
      header: 'Price',
      accessor: (product) => `Rp${product.price.toLocaleString()}`,
    },
    {
      header: 'Stock',
      accessor: (product) => (
        <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock > 0 ? product.stock : 'Out of Stock'}
        </span>
      ),
    },
    {
      header: 'Views',
      accessor: 'views',
    },
  ];

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsFormDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    
    setIsDeleting(true);
    
    try {
      // In a real app, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Product "${selectedProduct.name}" deleted successfully`);
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (productData: Partial<Product>) => {
    try {
      // In a real app, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedProduct) {
        toast.success(`Product "${productData.name}" updated successfully`);
      } else {
        toast.success(`Product "${productData.name}" created successfully`);
      }
      
      setIsFormDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error(selectedProduct ? 'Failed to update product' : 'Failed to create product');
      console.error(error);
    }
  };

  return (
    <AdminLayout title="Product Management">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Products</h2>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={productCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        placeholder="Search products by name or description..."
      />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading products...</p>
        </div>
      ) : (
        <DataTable
          data={filteredProducts}
          columns={columns}
          keyExtractor={(product) => product.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      
      <ConfirmDialog
        title="Delete Product"
        description={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
      
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm 
            product={selectedProduct}
            categories={productCategories}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ProductManagement;


import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import SearchFilter from '@/components/admin/SearchFilter';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';
import UserForm from '@/components/admin/UserForm';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // In a real app, this would be a query to your backend/API
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => Promise.resolve(mockUsers),
  });

  const filteredUsers = users?.filter(user => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }) || [];

  const columns: Column<User>[] = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Role',
      accessor: 'role',
      cell: (user) => (
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
          ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 
            user.role === 'editor' ? 'bg-green-100 text-green-800' : 
            'bg-gray-100 text-gray-800'}`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      ),
    },
    {
      header: 'Last Login',
      accessor: (user) => user.lastLogin 
        ? new Date(user.lastLogin).toLocaleDateString() 
        : 'Never',
    },
  ];

  const handleAdd = () => {
    setSelectedUser(null);
    setIsFormDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    setIsDeleting(true);
    
    try {
      // In a real app, you would call your API here
      // For mock data, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`User "${selectedUser.name}" deleted successfully`);
      setIsDeleteDialogOpen(false);
      // Refetch users after delete
      refetch();
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (userData: Partial<User>) => {
    try {
      // In a real app, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedUser) {
        toast.success(`User "${userData.name}" updated successfully`);
      } else {
        toast.success(`User "${userData.name}" created successfully`);
      }
      
      setIsFormDialogOpen(false);
      // Refetch users after create/update
      refetch();
    } catch (error) {
      toast.error(selectedUser ? 'Failed to update user' : 'Failed to create user');
      console.error(error);
    }
  };

  return (
    <AdminLayout title="User Management">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Users</h2>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search users by name or email..."
      />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading users...</p>
        </div>
      ) : (
        <DataTable
          data={filteredUsers}
          columns={columns}
          keyExtractor={(user) => user.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      
      <ConfirmDialog
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
      
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Edit User' : 'Add User'}
            </DialogTitle>
          </DialogHeader>
          <UserForm 
            user={selectedUser}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UserManagement;

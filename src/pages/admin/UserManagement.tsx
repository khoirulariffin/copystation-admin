
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { User as UserIcon, Edit, Trash2, UserPlus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserForm from '@/components/admin/UserForm';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { User } from '@/types';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer'; // Role must be one of these specific values
  avatar?: string;
  created_at: string;
  last_login?: string;
};

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Fetch users from Supabase
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Fetch profiles from Supabase
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error(`Failed to fetch users: ${error.message}`);
        console.error('Supabase error:', error);
        throw error;
      }

      // Get emails for the profiles
      const emailPromises = profiles.map(async (profile) => {
        try {
          // Get the user's email from auth.users via our edge function
          const { data: { user } } = await supabase.functions.invoke('admin-operations', {
            body: { action: 'getUserById', data: { userId: profile.id } }
          });
          
          return {
            ...profile,
            // Ensure role is one of the valid types
            role: profile.role as 'admin' | 'editor' | 'viewer',
            email: user?.email || 'Unknown email'
          } as UserProfile; // Explicitly cast to UserProfile type
        } catch (err) {
          console.warn(`Couldn't fetch email for user ${profile.id}:`, err);
          return {
            ...profile,
            // Ensure role is one of the valid types
            role: profile.role as 'admin' | 'editor' | 'viewer',
            email: 'Unknown email'
          } as UserProfile; // Explicitly cast to UserProfile type
        }
      });

      return await Promise.all(emailPromises);
    },
  });

  // Filter users based on search term and role filter
  const filteredUsers = users?.filter(user => {
    const matchesSearchTerm = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoleFilter = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearchTerm && matchesRoleFilter;
  }) || [];

  // Define columns for DataTable
  const columns: Column<UserProfile>[] = [
    {
      header: 'User',
      accessor: (user) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-gray-500" />
            </div>
          )}
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: (user) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
          ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 
           user.role === 'editor' ? 'bg-blue-100 text-blue-800' : 
           'bg-gray-100 text-gray-800'}`}>
          {user.role}
        </span>
      ),
    },
    {
      header: 'Joined Date',
      accessor: (user) => new Date(user.created_at).toLocaleDateString(),
    },
    {
      header: 'Last Login',
      accessor: (user) => user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never',
    },
  ];

  const handleAdd = () => {
    setSelectedUser(null);
    setIsFormDialogOpen(true);
  };

  const handleEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setIsFormDialogOpen(true);
  };

  const handleDelete = (user: UserProfile) => {
    // Prevent deleting yourself
    if (user.id === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }
    
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    setIsDeleting(true);
    
    try {
      // Delete user using our edge function
      const { error } = await supabase.functions.invoke('admin-operations', {
        body: { action: 'deleteUser', data: { userId: selectedUser.id } }
      });
      
      if (error) throw new Error(error);
      
      toast.success(`User "${selectedUser.name}" deleted successfully`);
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete user: ${error.message}`);
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (userData: Partial<UserProfile>) => {
    try {
      if (selectedUser) {
        // Update existing user
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            name: userData.name,
            avatar: userData.avatar,
          })
          .eq('id', selectedUser.id);
        
        if (updateError) throw updateError;
        
        // If role is changing, use the edge function to update it
        if (userData.role && userData.role !== selectedUser.role) {
          const { error } = await supabase.functions.invoke('admin-operations', {
            body: { 
              action: 'updateUserRole', 
              data: { userId: selectedUser.id, role: userData.role }
            }
          });
          
          if (error) throw new Error(error);
        }
        
        toast.success(`User "${userData.name}" updated successfully`);
      } else {
        // Create new user with edge function
        if (!userData.email || !userData.role) {
          throw new Error('Email and role are required');
        }
        
        const { error } = await supabase.functions.invoke('admin-operations', {
          body: { 
            action: 'inviteUser', 
            data: { email: userData.email, role: userData.role }
          }
        });
        
        if (error) throw new Error(error);
        
        toast.success(`User invited successfully. They will receive an email with instructions.`);
      }
      
      setIsFormDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save user');
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

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
        description={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
      
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
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

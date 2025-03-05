
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@/types';

// Define the base schema for common fields
const baseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'editor', 'viewer']),
  avatar: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

// Schema with email for creating new users
const newUserSchema = baseSchema.extend({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Type for all possible form values
type UserFormValues = z.infer<typeof baseSchema> | z.infer<typeof newUserSchema>;

// Props for user form
type UserFormProps = {
  user: Partial<User> | null;
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
};

const UserForm = ({ user, onSubmit, onCancel }: UserFormProps) => {
  const isEditing = !!user;
  
  // Create the form with the correct schema type
  const form = useForm<UserFormValues>({
    resolver: zodResolver(isEditing ? baseSchema : newUserSchema),
    defaultValues: {
      name: user?.name || '',
      role: user?.role || 'viewer',
      avatar: user?.avatar || '',
      ...(isEditing ? {} : { email: '', password: '' }),
    } as UserFormValues,
  });

  // Handle form submission
  const handleSubmit = (values: UserFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {!isEditing && (
          <>
            <FormField
              control={form.control}
              name={"email" as keyof UserFormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={"password" as keyof UserFormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.jpg" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;

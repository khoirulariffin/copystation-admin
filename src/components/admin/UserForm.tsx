
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

// Define validation schema based on whether we're creating or editing
const getUserSchema = (isEditing = false) => {
  // Base schema fields
  const baseSchema = {
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['admin', 'editor', 'viewer']),
    avatar: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  };
  
  // Add email field only for creating new users
  return isEditing 
    ? z.object(baseSchema)
    : z.object({
        ...baseSchema,
        email: z.string().email('Invalid email address'),
      });
};

// Define types for form values based on schema
type BaseUserFormValues = {
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
};

type NewUserFormValues = BaseUserFormValues & {
  email: string;
};

type UserFormValues = BaseUserFormValues | NewUserFormValues;

type UserFormProps = {
  user: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
};

const UserForm = ({ user, onSubmit, onCancel }: UserFormProps) => {
  const isEditing = !!user;
  const schema = getUserSchema(isEditing);
  
  // Define the form with correct typing
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      role: user?.role || 'viewer',
      avatar: user?.avatar || '',
      ...(isEditing ? {} : { email: '' }),
    },
  });

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof schema>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {!isEditing && (
          <FormField
            control={form.control}
            name="email"
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

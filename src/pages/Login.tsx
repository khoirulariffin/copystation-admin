
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    console.log("Login page - isAuthenticated:", isAuthenticated, "isLoading:", isLoading);
    if (isAuthenticated && !isLoading) {
      console.log("User is authenticated, redirecting to admin");
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Attempting login with:", email);
      await login(email, password);
      console.log("Login function completed, isAuthenticated should update soon");
      // Navigation happens in the useEffect when isAuthenticated changes
    } catch (error) {
      // Error is handled inside the login function
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to create demo users (admin and editor)
  const createDemoUsers = async () => {
    setIsSubmitting(true);
    
    try {
      // Create admin user
      const { data: adminData, error: adminError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Admin User'
          }
        }
      });
      
      if (adminError) throw adminError;
      
      // Set admin role directly in profiles table
      if (adminData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', adminData.user.id);
          
        if (profileError) throw profileError;
      }
      
      // Create editor user
      const { data: editorData, error: editorError } = await supabase.auth.signUp({
        email: 'editor@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Editor User'
          }
        }
      });
      
      if (editorError) throw editorError;
      
      // Set editor role directly in profiles table
      if (editorData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'editor' })
          .eq('id', editorData.user.id);
          
        if (profileError) throw profileError;
      }
      
      toast.success('Demo users created! Check emails for confirmation links or disable email verification in Supabase dashboard.');
      
      // Fill in the admin email for convenience
      setEmail('admin@example.com');
      setPassword('password123');
      
    } catch (error: any) {
      console.error('Error creating demo users:', error);
      toast.error(error.message || 'Failed to create demo users');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-blue-100 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CopyStation</h1>
          <p className="text-gray-600 mt-2">Admin Portal</p>
        </div>
        
        <Card className="shadow-xl border-none">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <p className="text-sm text-gray-500">
              Don't have an account yet? Create demo users below.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={createDemoUsers}
              disabled={isSubmitting}
            >
              Create Demo Users (Admin & Editor)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;


import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get user profile from Supabase
  const getUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('Retrieved user profile:', data);
      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  };

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setIsLoading(true);
        
        if (event === 'SIGNED_IN' && session) {
          const profile = await getUserProfile(session.user.id);
          
          if (profile) {
            // Validate and cast role to the correct type
            const validRole = profile.role as 'admin' | 'editor' | 'viewer';
            
            setUser({
              id: session.user.id,
              name: profile.name,
              email: session.user.email || '',
              role: validRole,
              avatar: profile.avatar
            });
            
            console.log('User authenticated and profile loaded', validRole);
            
            // Update last login timestamp
            await supabase
              .from('profiles')
              .update({ last_login: new Date().toISOString() })
              .eq('id', session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      console.log('Initializing auth');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('Found existing session:', session.user.id);
        const profile = await getUserProfile(session.user.id);
        
        if (profile) {
          // Validate and cast role to the correct type
          const validRole = profile.role as 'admin' | 'editor' | 'viewer';
          
          setUser({
            id: session.user.id,
            name: profile.name,
            email: session.user.email || '',
            role: validRole,
            avatar: profile.avatar
          });
          
          console.log('User profile loaded from existing session', validRole);
        } else {
          console.log('No profile found for user with existing session');
        }
      } else {
        console.log('No existing session found');
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log('Login successful, session:', data?.session?.user?.id);
      toast.success('Login successful');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

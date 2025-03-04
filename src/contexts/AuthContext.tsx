
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
  const [session, setSession] = useState<Session | null>(null);

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

  const setUserData = async (session: Session) => {
    try {
      console.log('Setting user data for session:', session.user.id);
      const profile = await getUserProfile(session.user.id);
      
      if (profile) {
        // Validate and cast role to the correct type
        const validRole = profile.role as 'admin' | 'editor' | 'viewer';
        
        setUser({
          id: session.user.id,
          name: profile.name || session.user.email?.split('@')[0] || 'User',
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
      } else {
        console.log('No profile found for user, creating default profile');
        
        // Create a default profile if none exists
        const { data, error } = await supabase
          .from('profiles')
          .insert([
            { 
              id: session.user.id, 
              name: session.user.email?.split('@')[0] || 'User',
              role: 'viewer',
              avatar: `https://ui-avatars.com/api/?name=${session.user.email?.split('@')[0] || 'User'}&background=random&color=fff`
            }
          ])
          .select();
          
        if (error) {
          console.error('Error creating profile:', error);
        } else if (data && data.length > 0) {
          setUser({
            id: session.user.id,
            name: data[0].name,
            email: session.user.email || '',
            role: data[0].role as 'admin' | 'editor' | 'viewer',
            avatar: data[0].avatar
          });
          
          console.log('Created and loaded default profile');
        }
      }
    } catch (error) {
      console.error('Error in setUserData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setIsLoading(true);
        
        if (session) {
          setSession(session);
          if (event === 'SIGNED_IN') {
            await setUserData(session);
          } else if (event === 'TOKEN_REFRESHED') {
            await setUserData(session);
          }
        } else {
          console.log('No session in auth state change event');
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      console.log('Initializing auth');
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session ? 'Session found' : 'No session');
        
        if (session) {
          setSession(session);
          await setUserData(session);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        setUser(null);
        setIsLoading(false);
      }
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
      
      // Set session explicitly
      if (data?.session) {
        setSession(data.session);
        await setUserData(data.session);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
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
        isAuthenticated: !!user && !!session, 
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

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Function to get user profile from Supabase
  const getUserProfile = async (userId: string) => {
    try {
      const profilePromise = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      const timeoutPromise = new Promise<{ data: null; error: Error }>(
        (_, reject) =>
          setTimeout(() => reject(new Error("Profile fetch timeout")), 3000)
      );

      const result = (await Promise.race([profilePromise, timeoutPromise])) as {
        data: any;
        error: any;
      };

      if (result.error) {
        console.warn("Quick profile fetch failed, using minimal data");
        return {
          id: userId,
          name: "User",
          role: "viewer" as const,
        };
      }

      return result.data;
    } catch (error) {
      console.warn("Profile fetch failed or timed out");
      return {
        id: userId,
        name: "User",
        role: "viewer" as const,
      };
    }
  };

  const setUserData = async (session: Session) => {
    try {
      const profile = await getUserProfile(session.user.id);

      if (profile) {
        setUser({
          id: session.user.id,
          name: profile.name || session.user.email?.split("@")[0] || "User",
          email: session.user.email || "",
          role: profile.role || "viewer",
          avatar:
            profile.avatar ||
            `https://ui-avatars.com/api/?name=${
              session.user.email?.split("@")[0]
            }&background=random`,
        });
      }
    } catch (error) {
      console.error("Fallback user data setup");
      setUser({
        id: session.user.id,
        name: session.user.email?.split("@")[0] || "User",
        email: session.user.email || "",
        role: "viewer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setIsLoading(true);

      if (session) {
        setSession(session);
        if (event === "SIGNED_IN") {
          await setUserData(session);
        } else if (event === "TOKEN_REFRESHED") {
          await setUserData(session);
        }
      } else {
        console.log("No session in auth state change event");
        setUser(null);
        setSession(null);
        setIsLoading(false);
      }
    });

    // Get initial session
    const initializeAuth = async () => {
      console.log("Initializing auth");
      setIsLoading(true);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log(
          "Initial session check:",
          session ? "Session found" : "No session"
        );

        if (session) {
          setSession(session);
          await setUserData(session);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in initializeAuth:", error);
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
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Login successful, session:", data?.session?.user?.id);
      toast.success("Login successful");

      // Set session explicitly
      if (data?.session) {
        setSession(data.session);
        await setUserData(data.session);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user && !!session,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

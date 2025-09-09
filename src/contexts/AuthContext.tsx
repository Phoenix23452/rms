import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper function to clean up auth state
  const cleanupAuthState = () => {
    console.log("Cleaning up auth state");
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        localStorage.removeItem(key);
      }
    });

    // Also clear from sessionStorage if present
    if (typeof sessionStorage !== "undefined") {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
          sessionStorage.removeItem(key);
        }
      });
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");

    // Check for existing session FIRST
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      // Immediately update state on auth changes
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);

      // Handle specific auth events
      if (event === "SIGNED_OUT") {
        console.log("User signed out, clearing state");
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Perform thorough cleanup first
      console.log("Cleaning up auth state before login");
      cleanupAuthState();

      // Try to sign out any existing session to prevent conflicts
      try {
        console.log("Attempting global sign out before login");
        await supabase.auth.signOut({ scope: "global" });
      } catch (err) {
        console.log("Preliminary signout failed:", err);
      }

      console.log(`Attempting to login with email: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error from Supabase:", error);
        throw error;
      }

      console.log("Login successful:", data?.user?.email);
      console.log("User metadata:", data?.user?.user_metadata);

      // Update state
      setUser(data?.user || null);
      setSession(data?.session || null);
      setIsAuthenticated(!!data?.session);

      toast.success("Logged in successfully!");

      // Force navigation based on role
      const userEmail = data?.user?.email?.toLowerCase() || "";
      if (userEmail.includes("admin")) {
        window.location.href = "/admin";
      } else if (userEmail.includes("rider")) {
        window.location.href = "/rider";
      } else {
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.message || "Failed to log in. Please check your credentials.",
      );
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string = "customer",
  ) => {
    try {
      // Clear any existing auth state before registration
      cleanupAuthState();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) throw error;

      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out user");

      // Clear storage to prevent auth issues
      cleanupAuthState();

      // Global sign out to clear all sessions
      // const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) throw error;

      // Reset state
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);

      toast.success("Logged out successfully");

      // Force page refresh to clear any cached state
      window.location.href = "/auth/login";
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return;
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

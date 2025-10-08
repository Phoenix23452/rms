import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

// Dummy user type
interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface Session {
  token: string;
}

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

  useEffect(() => {
    console.log("Initializing dummy auth state...");
    // Optionally load from localStorage here if needed
  }, []);

  const login = async (email: string, password: string) => {
    console.log(`Mock login with email: ${email}`);
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const fakeUser: User = {
      id: "123",
      email,
      name: "John Doe",
      role: email.includes("admin")
        ? "admin"
        : email.includes("rider")
          ? "rider"
          : "customer",
    };

    const fakeSession: Session = {
      token: "mock-token-abc123",
    };

    setUser(fakeUser);
    setSession(fakeSession);
    setIsAuthenticated(true);

    toast.success("Logged in (mock)");

    if (fakeUser.role === "admin") {
      window.location.href = "/admin";
    } else if (fakeUser.role === "rider") {
      window.location.href = "/rider";
    } else {
      window.location.href = "/";
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string = "customer",
  ) => {
    console.log("Mock register:", { name, email, role });
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Account created (mock)");
  };

  const logout = async () => {
    console.log("Mock logout");
    await new Promise((resolve) => setTimeout(resolve, 300));

    setUser(null);
    setSession(null);
    setIsAuthenticated(false);

    toast.success("Logged out (mock)");
    window.location.href = "/auth/login";
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

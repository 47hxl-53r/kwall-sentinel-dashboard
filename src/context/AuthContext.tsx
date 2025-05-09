
import { createContext, useState, useEffect, ReactNode } from "react";
import { User, getCurrentUser, saveUser, login as apiLogin, logout as apiLogout } from "@/services/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in session storage on initial load
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Auth context: login attempt");
      const user = await apiLogin(username, password);
      if (user) {
        setUser(user);
        saveUser(user);
        return true;
      }
      console.log("Auth context: login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await apiLogout();
    setUser(null);
    setIsLoading(false);
    
    // Use react-router's navigate instead of directly changing window.location
    // to prevent a full page reload
    // window.location.href = "/login"; - This causes a full page reload
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

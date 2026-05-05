import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authApi } from '@/services/api/authApi';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('access-token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await authApi.me();
        setUser(res.data);
      } catch {
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);

    localStorage.setItem('access-token', res.data.accessToken);
    localStorage.setItem('refresh-token', res.data.refreshToken);

    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('csrf-token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user || localStorage.getItem('access-token')),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
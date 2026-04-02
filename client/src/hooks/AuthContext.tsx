import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User, LoginDTO, CreateUserDTO } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<any>;
  verifyEmail: (token: string, email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  const login = (email: string, password: string) => {
    const dto: LoginDTO = { email, password };
    return auth.login(dto);
  };

  const register = (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    const dto: CreateUserDTO = { email, password, firstName, lastName };
    return auth.register(dto);
  };

  useEffect(() => {
    // Check if user is already logged in
    auth.getCurrentUser().catch(() => {
      // User not logged in
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        loading: auth.loading,
        error: auth.error,
        login,
        logout: auth.logout,
        register,
        verifyEmail: auth.verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

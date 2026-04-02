import { useCallback, useState } from 'react';
import apiClient from '../utils/api';
import type { User, LoginDTO, CreateUserDTO } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/auth/me');
      setUser(response.data.data);
      setError(null);
    } catch (err: any) {
      setUser(null);

      // 401 on bootstrapping session is expected for guests.
      if (err?.response?.status === 401) {
        setError(null);
      } else {
        setError(err.response?.data?.error || 'Failed to fetch user');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (dto: CreateUserDTO) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/auth/register', dto);
      setError(null);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (dto: LoginDTO) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/auth/login', dto);
      setUser(response.data.data.user);
      setError(null);
      return response.data.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await apiClient.post('/auth/logout');
      setUser(null);
      setError(null);
    } catch (err: any) {
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (token: string, email: string) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/auth/verify-email', {
        token,
        email,
      });
      setError(null);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Email verification failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    getCurrentUser,
    register,
    login,
    logout,
    verifyEmail,
  };
}

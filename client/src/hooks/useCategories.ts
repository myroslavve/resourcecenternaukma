import { useCallback, useState } from 'react';
import apiClient from '../utils/api';
import type { Category } from '../types';

interface CreateCategoryDTO {
  name: string;
  description?: string;
}

interface UpdateCategoryDTO {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export function useCategories() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/categories');
      setError(null);
      return response.data.data as Category[];
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch categories';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (dto: CreateCategoryDTO) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/categories', dto);
      setError(null);
      return response.data.data as Category;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create category';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(
    async (id: string, dto: UpdateCategoryDTO) => {
      try {
        setLoading(true);
        const response = await apiClient.put(`/categories/${id}`, dto);
        setError(null);
        return response.data.data as Category;
      } catch (err: any) {
        const message =
          err.response?.data?.error || 'Failed to update category';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await apiClient.delete(`/categories/${id}`);
      setError(null);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete category';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const activateCategory = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await apiClient.post(`/categories/${id}/activate`);
      setError(null);
      return response.data.data as Category;
    } catch (err: any) {
      const message =
        err.response?.data?.error || 'Failed to activate category';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateCategory = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await apiClient.post(`/categories/${id}/deactivate`);
      setError(null);
      return response.data.data as Category;
    } catch (err: any) {
      const message =
        err.response?.data?.error || 'Failed to deactivate category';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    activateCategory,
    deactivateCategory,
  };
}

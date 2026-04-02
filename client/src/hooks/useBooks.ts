import { useCallback, useState } from 'react';
import apiClient from '../utils/api';
import type {
  Book,
  CreateBookDTO,
  UpdateBookDTO,
  PaginatedResponse,
} from '../types';

export function useBooks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBooks = useCallback(
    async (
      query?: string,
      category?: string,
      genre?: string,
      page: number = 1,
    ) => {
      try {
        setLoading(true);
        const response = await apiClient.get('/books', {
          params: { query, category, genre, page, limit: 20 },
        });
        setError(null);
        return response.data.data as PaginatedResponse<Book>;
      } catch (err: any) {
        const message = err.response?.data?.error || 'Failed to search books';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getBook = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/books/${id}`);
      setError(null);
      return response.data.data as Book;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch book';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getActiveBooks = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.get('/books/active', {
        params: { page, limit: 20 },
      });
      setError(null);
      return response.data.data as PaginatedResponse<Book>;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch books';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllBooks = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.get('/books/all/list', {
        params: { page, limit: 20 },
      });
      setError(null);
      return response.data.data as PaginatedResponse<Book>;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch all books';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBook = useCallback(async (dto: CreateBookDTO) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/books', dto);
      setError(null);
      return response.data.data as Book;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create book';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBook = useCallback(async (id: string, dto: UpdateBookDTO) => {
    try {
      setLoading(true);
      const response = await apiClient.put(`/books/${id}`, dto);
      setError(null);
      return response.data.data as Book;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update book';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBook = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await apiClient.delete(`/books/${id}`);
      setError(null);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete book';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const activateBook = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await apiClient.post(`/books/${id}/activate`);
      setError(null);
      return response.data.data as Book;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to activate book';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateBook = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await apiClient.post(`/books/${id}/deactivate`);
      setError(null);
      return response.data.data as Book;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to deactivate book';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    searchBooks,
    getBook,
    getActiveBooks,
    getAllBooks,
    createBook,
    updateBook,
    deleteBook,
    activateBook,
    deactivateBook,
  };
}

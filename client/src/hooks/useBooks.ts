import { useCallback, useState } from 'react';
import apiClient from '../utils/api';
import { IS_GRAPHQL_MODE } from '../utils/api';
import { getGraphqlErrorMessage, graphqlRequest } from '../utils/graphqlClient';
import type {
  Book,
  CreateBookDTO,
  UpdateBookDTO,
  PaginatedResponse,
} from '../types';

export function useBooks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookFields = `
    _id
    title
    author
    isbn
    description
    imageUrl
    downloadUrl
    category
    genre
    publishedYear
    totalCopies
    isActive
    createdAt
    updatedAt
  `;

  const searchBooks = useCallback(
    async (
      query?: string,
      category?: string,
      genre?: string,
      page: number = 1,
    ) => {
      try {
        setLoading(true);
        if (IS_GRAPHQL_MODE) {
          const data = await graphqlRequest<{
            searchBooks: PaginatedResponse<Book>;
          }>(
            `query SearchBooks($input: SearchBooksInput!) {
              searchBooks(input: $input) {
                items { ${bookFields} }
                total
                page
                limit
                pages
              }
            }`,
            {
              input: {
                query,
                category,
                genre,
                page,
                limit: 20,
              },
            },
          );

          setError(null);
          return data.searchBooks;
        }

        const response = await apiClient.get('/books', {
          params: { query, category, genre, page, limit: 20 },
        });
        setError(null);
        return response.data.data as PaginatedResponse<Book>;
      } catch (err: any) {
        const message = IS_GRAPHQL_MODE
          ? getGraphqlErrorMessage(err, 'Failed to search books')
          : err.response?.data?.error || 'Failed to search books';
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
      if (IS_GRAPHQL_MODE) {
        const data = await graphqlRequest<{ book: Book }>(
          `query GetBook($id: ID!) {
            book(id: $id) { ${bookFields} }
          }`,
          { id },
        );

        setError(null);
        return data.book;
      }

      const response = await apiClient.get(`/books/${id}`);
      setError(null);
      return response.data.data as Book;
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to fetch book')
        : err.response?.data?.error || 'Failed to fetch book';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getActiveBooks = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      if (IS_GRAPHQL_MODE) {
        const data = await graphqlRequest<{
          activeBooks: PaginatedResponse<Book>;
        }>(
          `query ActiveBooks($page: Int, $limit: Int) {
            activeBooks(page: $page, limit: $limit) {
              items { ${bookFields} }
              total
              page
              limit
              pages
            }
          }`,
          { page, limit: 20 },
        );

        setError(null);
        return data.activeBooks;
      }

      const response = await apiClient.get('/books/active', {
        params: { page, limit: 20 },
      });
      setError(null);
      return response.data.data as PaginatedResponse<Book>;
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to fetch books')
        : err.response?.data?.error || 'Failed to fetch books';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllBooks = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      if (IS_GRAPHQL_MODE) {
        const data = await graphqlRequest<{ books: PaginatedResponse<Book> }>(
          `query Books($page: Int, $limit: Int) {
            books(page: $page, limit: $limit) {
              items { ${bookFields} }
              total
              page
              limit
              pages
            }
          }`,
          { page, limit: 20 },
        );

        setError(null);
        return data.books;
      }

      const response = await apiClient.get('/books/all/list', {
        params: { page, limit: 20 },
      });
      setError(null);
      return response.data.data as PaginatedResponse<Book>;
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to fetch all books')
        : err.response?.data?.error || 'Failed to fetch all books';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBook = useCallback(async (dto: CreateBookDTO) => {
    try {
      setLoading(true);
      if (IS_GRAPHQL_MODE) {
        const data = await graphqlRequest<{ createBook: Book }>(
          `mutation CreateBook($input: CreateBookInput!) {
            createBook(input: $input) { ${bookFields} }
          }`,
          { input: dto },
        );

        setError(null);
        return data.createBook;
      }

      const response = await apiClient.post('/books', dto);
      setError(null);
      return response.data.data as Book;
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to create book')
        : err.response?.data?.error || 'Failed to create book';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBook = useCallback(async (id: string, dto: UpdateBookDTO) => {
    try {
      setLoading(true);
      if (IS_GRAPHQL_MODE) {
        const data = await graphqlRequest<{ updateBook: Book }>(
          `mutation UpdateBook($id: ID!, $input: UpdateBookInput!) {
            updateBook(id: $id, input: $input) { ${bookFields} }
          }`,
          { id, input: dto },
        );

        setError(null);
        return data.updateBook;
      }

      const response = await apiClient.put(`/books/${id}`, dto);
      setError(null);
      return response.data.data as Book;
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to update book')
        : err.response?.data?.error || 'Failed to update book';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBook = useCallback(async (id: string) => {
    try {
      setLoading(true);
      if (IS_GRAPHQL_MODE) {
        await graphqlRequest<{ deleteBook: boolean }>(
          `mutation DeleteBook($id: ID!) {
            deleteBook(id: $id)
          }`,
          { id },
        );

        setError(null);
        return;
      }

      await apiClient.delete(`/books/${id}`);
      setError(null);
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to delete book')
        : err.response?.data?.error || 'Failed to delete book';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const activateBook = useCallback(async (id: string) => {
    try {
      setLoading(true);
      if (IS_GRAPHQL_MODE) {
        const data = await graphqlRequest<{ activateBook: Book }>(
          `mutation ActivateBook($id: ID!) {
            activateBook(id: $id) { ${bookFields} }
          }`,
          { id },
        );

        setError(null);
        return data.activateBook;
      }

      const response = await apiClient.post(`/books/${id}/activate`);
      setError(null);
      return response.data.data as Book;
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to activate book')
        : err.response?.data?.error || 'Failed to activate book';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateBook = useCallback(async (id: string) => {
    try {
      setLoading(true);
      if (IS_GRAPHQL_MODE) {
        const data = await graphqlRequest<{ deactivateBook: Book }>(
          `mutation DeactivateBook($id: ID!) {
            deactivateBook(id: $id) { ${bookFields} }
          }`,
          { id },
        );

        setError(null);
        return data.deactivateBook;
      }

      const response = await apiClient.post(`/books/${id}/deactivate`);
      setError(null);
      return response.data.data as Book;
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to deactivate book')
        : err.response?.data?.error || 'Failed to deactivate book';
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

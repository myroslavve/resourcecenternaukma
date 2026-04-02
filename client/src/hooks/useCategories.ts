import { useCallback, useState } from 'react';
import apiClient from '../utils/api';
import { IS_GRAPHQL_MODE } from '../utils/api';
import { getGraphqlErrorMessage, graphqlRequest } from '../utils/graphqlClient';
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

  const categoryFields = `
    _id
    name
    description
    isActive
    createdAt
    updatedAt
  `;

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      if (IS_GRAPHQL_MODE) {
        const data = await graphqlRequest<{ categories: Category[] }>(
          `query Categories {
            categories { ${categoryFields} }
          }`,
        );

        setError(null);
        return data.categories;
      }

      const response = await apiClient.get('/categories');
      setError(null);
      return response.data.data as Category[];
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to fetch categories')
        : err.response?.data?.error || 'Failed to fetch categories';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (dto: CreateCategoryDTO) => {
    try {
      setLoading(true);
      if (IS_GRAPHQL_MODE) {
        const data = await graphqlRequest<{ createCategory: Category }>(
          `mutation CreateCategory($input: CreateCategoryInput!) {
            createCategory(input: $input) { ${categoryFields} }
          }`,
          { input: dto },
        );

        setError(null);
        return data.createCategory;
      }

      const response = await apiClient.post('/categories', dto);
      setError(null);
      return response.data.data as Category;
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to create category')
        : err.response?.data?.error || 'Failed to create category';
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
        if (IS_GRAPHQL_MODE) {
          const data = await graphqlRequest<{ updateCategory: Category }>(
            `mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
              updateCategory(id: $id, input: $input) { ${categoryFields} }
            }`,
            { id, input: dto },
          );

          setError(null);
          return data.updateCategory;
        }

        const response = await apiClient.put(`/categories/${id}`, dto);
        setError(null);
        return response.data.data as Category;
      } catch (err: any) {
        const message = IS_GRAPHQL_MODE
          ? getGraphqlErrorMessage(err, 'Failed to update category')
          : err.response?.data?.error || 'Failed to update category';
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
      if (IS_GRAPHQL_MODE) {
        await graphqlRequest<{ deleteCategory: boolean }>(
          `mutation DeleteCategory($id: ID!) {
            deleteCategory(id: $id)
          }`,
          { id },
        );

        setError(null);
        return;
      }

      await apiClient.delete(`/categories/${id}`);
      setError(null);
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to delete category')
        : err.response?.data?.error || 'Failed to delete category';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const activateCategory = useCallback(async (id: string) => {
    try {
      setLoading(true);
      if (IS_GRAPHQL_MODE) {
        const data = await graphqlRequest<{ activateCategory: Category }>(
          `mutation ActivateCategory($id: ID!) {
            activateCategory(id: $id) { ${categoryFields} }
          }`,
          { id },
        );

        setError(null);
        return data.activateCategory;
      }

      const response = await apiClient.post(`/categories/${id}/activate`);
      setError(null);
      return response.data.data as Category;
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to activate category')
        : err.response?.data?.error || 'Failed to activate category';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateCategory = useCallback(async (id: string) => {
    try {
      setLoading(true);
      if (IS_GRAPHQL_MODE) {
        const data = await graphqlRequest<{ deactivateCategory: Category }>(
          `mutation DeactivateCategory($id: ID!) {
            deactivateCategory(id: $id) { ${categoryFields} }
          }`,
          { id },
        );

        setError(null);
        return data.deactivateCategory;
      }

      const response = await apiClient.post(`/categories/${id}/deactivate`);
      setError(null);
      return response.data.data as Category;
    } catch (err: any) {
      const message = IS_GRAPHQL_MODE
        ? getGraphqlErrorMessage(err, 'Failed to deactivate category')
        : err.response?.data?.error || 'Failed to deactivate category';
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

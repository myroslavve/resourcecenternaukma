import axios, { AxiosError } from 'axios';

const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_API_URL || 'http://localhost:5001/api/graphql';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await axios.post<GraphQLResponse<T>>(
    GRAPHQL_URL,
    {
      query,
      variables,
    },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.data.errors?.length) {
    throw new Error(
      response.data.errors[0].message || 'GraphQL request failed',
    );
  }

  if (!response.data.data) {
    throw new Error('Empty GraphQL response');
  }

  return response.data.data;
}

export function getGraphqlErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) {
    return err.message;
  }

  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<{
      errors?: Array<{ message?: string }>;
    }>;
    const gqlMsg = axiosErr.response?.data?.errors?.[0]?.message;
    if (gqlMsg) {
      return gqlMsg;
    }
  }

  return fallback;
}

import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';

export const API_MODE =
  (import.meta.env.VITE_API_MODE || 'rest').toLowerCase() === 'graphql'
    ? 'graphql'
    : 'rest';

export const IS_GRAPHQL_MODE = API_MODE === 'graphql';

const REST_API_BASE_URL = import.meta.env.VITE_REST_API_BASE_URL || 'http://localhost:5000/api';
const GRAPHQL_AUTH_BASE_URL =
  import.meta.env.VITE_GRAPHQL_AUTH_BASE_URL || 'http://localhost:5001/api';

const API_BASE_URL = IS_GRAPHQL_MODE
  ? GRAPHQL_AUTH_BASE_URL
  : REST_API_BASE_URL;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Keep API errors in app state; avoid hard reload redirects on 401.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error),
);

export default apiClient;

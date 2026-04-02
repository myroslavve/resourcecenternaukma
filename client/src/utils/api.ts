import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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

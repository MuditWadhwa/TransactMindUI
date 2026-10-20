import { BASE_URL } from '@/config';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiResponse } from '@/types/auth.dto';

export class ApiError extends Error {
  apiResponse?: ApiResponse;
  status: number;

  constructor(message: string, status: number, apiResponse?: ApiResponse) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.apiResponse = apiResponse;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const isAuthRoute = endpoint.includes('/auth/') && endpoint !== '/auth/logout';
  if (!isAuthRoute) {
    try {
      const store = useAuthStore.getState();
      const token = store.getToken();

      const tokenType = store.auth?.tokenType || 'Bearer';

      if (token) {
        headers.set('Authorization', `${tokenType} ${token}`);
      } else {
        console.warn('No valid auth token found for secure endpoint. Endpoint: ' + endpoint);
      }
    } catch (e) {
      console.error('Failed to append authorization header', e);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let apiResponse: ApiResponse | undefined;
    try {
      if (errorBody) {
        apiResponse = JSON.parse(errorBody) as ApiResponse;
      }
    } catch { }

    const errorMessage = apiResponse?.message || errorBody || `API Error: ${response.statusText}`;
    throw new ApiError(errorMessage, response.status, apiResponse);
  }

  if (response.status === 204 || response.status === 205) {
    return {} as T;
  }

  const text = await response.text();
  if (!text || !text.trim()) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch (err) {
    console.warn('Error parsing response as JSON:', err);
    return text as unknown as T;
  }
}
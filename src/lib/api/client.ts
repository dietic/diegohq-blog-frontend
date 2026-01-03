/**
 * API client for backend communication
 */

import { API_BASE_URL } from './config';

export interface ApiError {
  detail: string;
  status: number;
}

export class ApiClientError extends Error {
  status: number;
  detail: string;

  constructor(message: string, status: number, detail: string) {
    super(message);
    this.status = status;
    this.detail = detail;
    this.name = 'ApiClientError';
  }
}

export interface RequestOptions extends RequestInit {
  token?: string;
  timeout?: number;
}

const DEFAULT_TIMEOUT = 10000; // 10 seconds

/**
 * Make an API request
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      let detail = 'An error occurred';
      try {
        const errorData = await response.json();
        detail = errorData.detail || detail;
      } catch {
        // Ignore JSON parse errors
      }
      throw new ApiClientError(
        `API Error: ${response.status}`,
        response.status,
        detail
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiClientError('Request timeout', 408, 'The request timed out');
    }
    throw error;
  }
}

/**
 * API client methods
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiClient, API_ENDPOINTS, type LoginResponse, type UserResponse } from '@/lib/api';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const TOKEN_TYPE = 'Bearer';

interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Get the current access token from cookies
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

/**
 * Get the current refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

/**
 * Set authentication cookies
 */
async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): Promise<void> {
  const cookieStore = await cookies();

  // Access token expires based on backend response
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expiresIn,
    path: '/',
  });

  // Refresh token has longer expiry (7 days)
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Clear authentication cookies
 */
async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

/**
 * Login with email and password (for regular users via desktop)
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      { email, password }
    );

    await setAuthCookies(
      response.access_token,
      response.refresh_token,
      response.expires_in
    );

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

/**
 * Login with email and password (for admin users only)
 * Rejects non-admin users at login time
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      { email, password }
    );

    await setAuthCookies(
      response.access_token,
      response.refresh_token,
      response.expires_in
    );

    // Check if user is actually an admin
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      // Clear cookies since non-admin shouldn't be logged in here
      await clearAuthCookies();
      return {
        success: false,
        error: 'You do not have admin access',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Admin login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

/**
 * Logout and clear tokens
 */
export async function logout(): Promise<void> {
  const token = await getAccessToken();

  if (token) {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout, undefined, { token });
    } catch (error) {
      console.error('Logout API error:', error);
    }
  }

  await clearAuthCookies();
  redirect('/admin-login');
}

/**
 * Refresh the access token
 */
export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.refresh,
      { refresh_token: refreshToken }
    );

    await setAuthCookies(
      response.access_token,
      response.refresh_token,
      response.expires_in
    );

    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    await clearAuthCookies();
    return false;
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<UserResponse | null> {
  const token = await getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const user = await apiClient.get<UserResponse>('/users/me', { token });
    return user;
  } catch (error) {
    // Try to refresh token
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = await getAccessToken();
      if (newToken) {
        try {
          return await apiClient.get<UserResponse>('/users/me', {
            token: newToken,
          });
        } catch {
          return null;
        }
      }
    }
    return null;
  }
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return !!token;
}

/**
 * Check if the user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

/**
 * Require admin authentication or redirect to login
 */
export async function requireAdmin(): Promise<UserResponse> {
  // First check if we have a token at all
  const token = await getAccessToken();
  if (!token) {
    redirect('/admin-login');
  }

  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect('/admin-login');
    }

    if (user.role !== 'admin') {
      redirect('/admin-login?error=unauthorized');
    }

    return user;
  } catch (error) {
    console.error('Auth check failed:', error);
    redirect('/admin-login');
  }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    // Try to logout on the backend
    if (accessToken) {
      try {
        await apiClient.post(API_ENDPOINTS.auth.logout, undefined, {
          token: accessToken,
        });
      } catch {
        // Ignore backend logout errors, still clear cookies
      }
    }

    // Clear cookies
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}

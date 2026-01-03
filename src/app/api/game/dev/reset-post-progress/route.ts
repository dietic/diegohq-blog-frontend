import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/auth/actions';
import { apiClient } from '@/lib/api/client';

export async function DELETE() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const token = await getAccessToken();

    const response = await apiClient.delete<{ success: boolean; deleted_count: number }>(
      '/game/dev/reset-post-progress',
      { token: token || undefined }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to reset post progress:', error);

    if (error instanceof Error && 'status' in error && 'detail' in error) {
      const apiError = error as unknown as { status: number; detail: string };
      return NextResponse.json(
        { error: apiError.detail || 'Failed to reset post progress' },
        { status: apiError.status }
      );
    }

    return NextResponse.json(
      { error: 'Failed to reset post progress' },
      { status: 500 }
    );
  }
}

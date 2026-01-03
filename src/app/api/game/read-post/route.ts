import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/auth/actions';
import { apiClient } from '@/lib/api/client';
import type { ReadPostResponse } from '@/lib/api/types';

export async function POST(request: NextRequest) {
  try {
    const token = await getAccessToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { post_slug } = body;

    if (!post_slug) {
      return NextResponse.json(
        { error: 'post_slug is required' },
        { status: 400 }
      );
    }

    const response = await apiClient.post<ReadPostResponse>(
      '/game/read-post',
      { post_slug },
      { token }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to claim XP:', error);

    if (error instanceof Error && 'status' in error && 'detail' in error) {
      const apiError = error as unknown as { status: number; detail: string };
      return NextResponse.json(
        { error: apiError.detail || 'Failed to claim XP' },
        { status: apiError.status }
      );
    }

    return NextResponse.json(
      { error: 'Failed to claim XP' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/auth/actions';
import { apiClient } from '@/lib/api/client';

interface PostStatusResponse {
  has_read: boolean;
  post_slug: string;
}

export async function GET(request: NextRequest) {
  try {
    const token = await getAccessToken();

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('slug');

    if (!postSlug) {
      return NextResponse.json(
        { error: 'slug parameter is required' },
        { status: 400 }
      );
    }

    const response = await apiClient.get<PostStatusResponse>(
      `/game/post-status/${encodeURIComponent(postSlug)}`,
      { token }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to get post status:', error);

    if (error instanceof Error && 'status' in error && 'detail' in error) {
      const apiError = error as unknown as { status: number; detail: string };
      return NextResponse.json(
        { error: apiError.detail || 'Failed to get post status' },
        { status: apiError.status }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get post status' },
      { status: 500 }
    );
  }
}

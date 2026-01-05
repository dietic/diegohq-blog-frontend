import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/auth/actions';
import { apiClient } from '@/lib/api/client';
import type { QuestProgressResponse } from '@/lib/api/types';

export async function GET(request: NextRequest) {
  try {
    const token = await getAccessToken();
    const searchParams = request.nextUrl.searchParams;
    const includeInProgress = searchParams.get('include_in_progress') === 'true';

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const queryString = includeInProgress ? '?include_in_progress=true' : '';
    const response = await apiClient.get<QuestProgressResponse[]>(
      `/quests/progress${queryString}`,
      { token }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch quest progress:', error);

    if (error instanceof Error && 'status' in error && 'detail' in error) {
      const apiError = error as unknown as { status: number; detail: string };
      return NextResponse.json(
        { error: apiError.detail || 'Failed to fetch quest progress' },
        { status: apiError.status }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch quest progress' },
      { status: 500 }
    );
  }
}

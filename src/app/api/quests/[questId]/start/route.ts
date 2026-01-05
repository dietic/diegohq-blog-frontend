import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/auth/actions';
import { apiClient } from '@/lib/api/client';
import type { StartQuestResponse } from '@/lib/api/types';

interface RouteParams {
  params: Promise<{ questId: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const token = await getAccessToken();
    const { questId } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const response = await apiClient.post<StartQuestResponse>(
      `/quests/${questId}/start`,
      {},
      { token }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to start quest:', error);

    if (error instanceof Error && 'status' in error && 'detail' in error) {
      const apiError = error as unknown as { status: number; detail: string };
      return NextResponse.json(
        { error: apiError.detail || 'Failed to start quest' },
        { status: apiError.status }
      );
    }

    return NextResponse.json({ error: 'Failed to start quest' }, { status: 500 });
  }
}

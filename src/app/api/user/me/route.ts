import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/actions';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Return only the fields needed for profile display
    return NextResponse.json({
      username: user.username,
      level: user.level,
      xp: user.xp,
      current_streak: user.current_streak,
      longest_streak: user.longest_streak,
      avatar_url: user.avatar_url,
      role: user.role,
    });
  } catch (error) {
    console.error('Failed to get user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

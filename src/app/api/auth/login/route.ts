import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { login, getCurrentUser } from '@/lib/auth/actions';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await login(email, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Login failed' },
        { status: 401 }
      );
    }

    // Check if user is an admin - admins should use /admin-login instead
    const user = await getCurrentUser();
    if (user?.role === 'admin') {
      // Clear the cookies since admin shouldn't be logged in here
      const cookieStore = await cookies();
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');

      return NextResponse.json(
        { error: 'Admin users must use the admin login portal' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

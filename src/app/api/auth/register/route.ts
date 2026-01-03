import { NextResponse } from 'next/server';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { username, email, password }: RegisterRequest = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    await apiClient.post(API_ENDPOINTS.auth.register, {
      username,
      email,
      password,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Register error:', error);
    const message = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

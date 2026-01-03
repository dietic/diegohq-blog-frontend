import { NextResponse } from 'next/server';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    await apiClient.post('/contact', {
      name,
      email,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    const message = error instanceof Error ? error.message : 'Failed to submit form';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

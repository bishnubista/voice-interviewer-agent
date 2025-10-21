import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', valid: false },
        { status: 401 }
      );
    }

    // In a real app, you might fetch more user details from Clerk
    // For now, return basic validation
    return NextResponse.json({
      valid: true,
      userId,
    });

  } catch (error) {
    console.error('Auth verification error:', error);

    return NextResponse.json(
      { error: 'Verification failed', valid: false },
      { status: 500 }
    );
  }
}

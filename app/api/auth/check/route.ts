import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({ 
      authenticated: !!session,
      session: session ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name
        }
      } : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      error: 'Failed to check authentication status',
      authenticated: false,
      errorDetail: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/app/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check protected routes (history page)
  if (pathname.startsWith('/history')) {
    const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // If not authenticated, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/history/:path*'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from './actions/token.actions';

export async function middleware(request: NextRequest) {
  const token = await getToken();
  console.log('Token in middleware:', token);
  const pathname = request.nextUrl.pathname;
  if (pathname.includes('login') || pathname.includes('register')) {
    console.log('Accessing login or register page');
    if (token) {
      console.log('Redirecting to dashboard because token exists');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      console.log('No token found, allowing access to login or register page');
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};

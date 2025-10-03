import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

// Constants
const ADMIN_SESSION_TOKEN_COOKIE = 'admin-session-token';
const JWT_SECRET_KEY = process.env.ADMIN_JWT_SECRET_KEY;
const LOGIN_URL = '/login';
const DASHBOARD_URL = '/dashboard';

interface AdminJWTPayload extends JWTPayload {
  userId: string;
  role: string;
  email: string;
}

/**
 * Verifies the JWT token.
 * @param token The JWT token to verify.
 * @returns The decoded JWT payload if the token is valid, otherwise throws an error.
 */
async function verifyJWT(token: string): Promise<AdminJWTPayload> {
  if (!JWT_SECRET_KEY) {
    console.error('FATAL: ADMIN_JWT_SECRET_KEY is not defined in environment variables.');
    throw new Error('JWT secret key is not configured.');
  }

  const secret = new TextEncoder().encode(JWT_SECRET_KEY);
  
  try {
    const { payload } = await jwtVerify<AdminJWTPayload>(token, secret);
    return payload;
  } catch (error) {
    console.warn('JWT verification failed:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Invalid or expired token.');
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminTokenCookie = request.cookies.get(ADMIN_SESSION_TOKEN_COOKIE);
  const token = adminTokenCookie?.value;

  const isAuthPath = pathname.startsWith(LOGIN_URL) || pathname.startsWith('/mfa');
  const isAdminPath = pathname.startsWith('/admin') || pathname === DASHBOARD_URL;

  let decodedPayload: AdminJWTPayload | null = null;
  let isTokenValid = false;

  if (token) {
    try {
      decodedPayload = await verifyJWT(token);
      isTokenValid = decodedPayload?.role === 'Administrator';
    } catch (error) {
      // Token is invalid or expired
      isTokenValid = false;
    }
  }
  
  // 1. Handle redirection for invalid/expired tokens
  if (token && !isTokenValid) {
    // If on an admin path with an invalid token, redirect to login and clear the cookie.
    if (isAdminPath) {
      const response = NextResponse.redirect(new URL(LOGIN_URL, request.url));
      response.cookies.delete(ADMIN_SESSION_TOKEN_COOKIE);
      console.log(`Invalid token access attempt on ${pathname}. Redirecting to login.`);
      return response;
    }
  }

  // 2. Protect admin routes for unauthenticated users
  if (isAdminPath && !isTokenValid) {
    const requestedPage = request.nextUrl.pathname;
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_URL;
    if (requestedPage !== '/') {
        url.searchParams.set('redirect_to', requestedPage);
    }
    console.log(`Unauthenticated access to ${pathname}. Redirecting to login.`);
    return NextResponse.redirect(url);
  }

  // 3. Redirect authenticated users away from auth pages
  if (isAuthPath && isTokenValid) {
    console.log(`Authenticated user accessing ${pathname}. Redirecting to dashboard.`);
    return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
  }

  // 4. If all checks pass, allow the request to continue
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
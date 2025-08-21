import { NextResponse, NextRequest } from 'next/server';
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'mm_mock_uid';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (!req.cookies.get(JWT_COOKIE_NAME)) {
    res.cookies.set(
      JWT_COOKIE_NAME,
      process.env.MOCK_USER_ID || '550e8400-e29b-41d4-a716-446655440001',
      { httpOnly: true, sameSite: 'lax', path: '/' }
    );
  }

  // light security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return res;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get('auth-storage')?.value;
  let token = null;
  let isExpired = false;
  let isOnboarded = false;

  if (authCookie) {
    try {
      const parsed = JSON.parse(authCookie);
      const authData = parsed?.state?.auth;

      if (authData) {
        token = authData.accessToken;
        isOnboarded = Boolean(authData.onboarded ?? authData.isOnboarded ?? authData.isOnbaorded);

        if (Date.now() >= authData.expireAt) {
          isExpired = true;
        }
      }
    } catch (e) {
      console.error('Failed to parse auth storage cookie', e);
    }
  }

  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) && (!token || isExpired)) {
    const response = NextResponse.redirect(new URL('/auth?mode=login', request.url));

    if (isExpired) {
      response.cookies.delete('auth-storage');
    }
    return response;
  }

  if (pathname.startsWith('/auth') && token && !isExpired) {
    return NextResponse.redirect(new URL(isOnboarded ? '/dashboard' : '/onboarding', request.url));
  }

  if (pathname.startsWith('/onboarding') && token && !isExpired && isOnboarded) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/dashboard') && token && !isExpired && !isOnboarded) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth', '/onboarding'],
};
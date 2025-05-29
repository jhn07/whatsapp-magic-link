import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const configData = {
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || 'session',
  PROTECTED_PATHS: ['/dashboard'],
  AUTH_REDIRECT_PATH: '/',
}


const isProtectedPath = (pathname: string) => {
  return configData.PROTECTED_PATHS.some(path => pathname.startsWith(path));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the path is protected
  if (isProtectedPath(pathname)) {
    try {

      const token = req.cookies.get(configData.SESSION_COOKIE_NAME)?.value;

      if (!token) {
        const redirectUrl = new URL(configData.AUTH_REDIRECT_PATH, req.url);
        redirectUrl.searchParams.set('from', pathname);

        return NextResponse.redirect(redirectUrl);
      }

      const response = NextResponse.next();

      // Set security headers
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return response;
    } catch (error) {
      console.error('Middleware error:', error);
      // If there is an error, also redirect to the main page
      return NextResponse.redirect(new URL(configData.AUTH_REDIRECT_PATH, req.url));
    }
  }

  return NextResponse.next();
}

// Config for performance optimization
export const config = {
  // Specify which paths trigger the middleware
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
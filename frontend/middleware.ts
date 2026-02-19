import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect root "/" to default language
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Let next-intl handle the rest
  return intlMiddleware(request);
}

// Apply middleware to all routes except api, _next/static, images, favicon
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|uploads).*)']
};

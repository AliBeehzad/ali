import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n';

import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default function middleware(request: any) {
  const pathname = request.nextUrl.pathname;

  // If user visits root "/", redirect to default language
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|uploads).*)']
};

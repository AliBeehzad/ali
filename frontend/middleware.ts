import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // If user visits root "/", redirect to default language
    if (pathname === '/') {
      return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
    }

    return intlMiddleware(request);
  } catch (err) {
    console.error('Middleware failed:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|uploads).*)']
};

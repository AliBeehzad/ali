import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localeDetection: true,
  localePrefix: 'as-needed'
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|uploads).*)']
};
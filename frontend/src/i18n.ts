import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ps', 'fa'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale comes from middleware
  let locale = requestLocale;

  // If locale is missing or invalid → fallback to default
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  try {
    return {
      locale,
      messages: (await import(`./messages/${locale}.json`)).default
    };
  } catch (error) {
    console.error(`Failed to load messages for ${locale}, falling back to en`);
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/en.json`)).default
    };
  }
});

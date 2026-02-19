import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ps', 'fa'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate locale - fallback to default if invalid
  const validLocale: Locale =
    requestLocale && locales.includes(requestLocale as Locale)
      ? (requestLocale as Locale)
      : defaultLocale;

  // Load messages
  try {
    const messages = (await import(`./messages/${validLocale}.json`)).default;
    return {
      locale: validLocale,  // must be string
      messages,
    };
  } catch (err) {
    console.error(`Failed to load messages for ${validLocale}, falling back to en`);
    const messages = (await import(`./messages/en.json`)).default;
    return {
      locale: defaultLocale,
      messages,
    };
  }
});

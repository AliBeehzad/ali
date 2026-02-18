import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ps', 'fa'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate locale - if invalid, use default
  const validLocale = locale && locales.includes(locale as Locale) 
    ? locale as Locale 
    : defaultLocale;

  try {
    return {
      locale: validLocale,
      messages: (await import(`./messages/${validLocale}.json`)).default
    };
  } catch (error) {
    console.error(`Failed to load messages for ${validLocale}, falling back to en`);
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/en.json`)).default
    };
  }
});
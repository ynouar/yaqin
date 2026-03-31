import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export const locales = ['fr', 'en', 'ar', 'ur', 'tr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

function isValidLocale(locale: string | undefined): locale is Locale {
  return locales.includes(locale as Locale);
}

export default getRequestConfig(async () => {
  // Locale is forwarded as a header by middleware (read from NEXT_LOCALE cookie).
  // Reading headers() here avoids the "Runtime data outside Suspense" error
  // that occurs when reading cookies() directly in a cached layout.
  const headerStore = await headers();
  const locale = headerStore.get('x-locale') ?? undefined;
  const resolvedLocale = isValidLocale(locale) ? locale : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});

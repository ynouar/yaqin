import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

/**
 * Async Server Component that reads locale (from cookies via middleware header)
 * and provides translations to the client tree.
 *
 * Must be wrapped in <Suspense> at the call site — this is the correct
 * cacheComponents pattern: dynamic data stays inside Suspense boundaries
 * so the outer layout can be a fast static HTML shell.
 */
export async function IntlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

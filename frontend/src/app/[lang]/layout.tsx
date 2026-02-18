import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // IMPORTANT: Await the params
  const { lang } = await params;
  
  // Load messages for this locale
  const messages = await getMessages({ locale: lang });

  return (
    <NextIntlClientProvider messages={messages} locale={lang}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
import { HeaderClient } from '@/components/header-client';
import { QueryProvider } from '@/components/providers/query-provider';
import { i18n, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return {
    title:
      lang === 'vi'
        ? 'vhistory - Từ điển phương ngữ Việt Nam'
        : 'vhistory - Vietnamese Dialect Dictionary',
    description:
      lang === 'vi'
        ? 'Gìn giữ di sản ngôn ngữ Việt Nam.'
        : 'Preserving the heritage of Vietnamese language.',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className='flex flex-col min-h-screen'>
      <QueryProvider>
        <Toaster position='top-center' richColors />
        <HeaderClient lang={lang} dict={dict} />
        <main className='flex-1'>{children}</main>
        <footer className='py-8 bg-sand-100 text-center text-sand-400 text-sm'>
          &copy; {new Date().getFullYear()} vhistory.{' '}
          {lang === 'vi' ? 'Gìn giữ di sản.' : 'Preserving Heritage.'}
        </footer>
      </QueryProvider>
    </div>
  );
}

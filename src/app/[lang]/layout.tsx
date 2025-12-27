import '../globals.css';
import type { Metadata } from 'next';
import { Merriweather, Inter } from 'next/font/google';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { UserMenu } from '@/components/user-menu';
import { LanguageSwitcher } from '@/components/language-switcher';
import { i18n, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

const merriweather = Merriweather({
  variable: '--font-serif',
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '700', '900'],
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
});

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
  const dict = getDictionary(lang);

  return (
    <html lang={lang}>
      <body
        className={cn(
          merriweather.variable,
          inter.variable,
          'antialiased min-h-screen flex flex-col'
        )}
      >
        <header className='p-6 border-b border-sand-200 bg-sand-50 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80'>
          <nav className='max-w-7xl mx-auto flex items-center justify-between'>
            <Link
              href={`/${lang}`}
              className='font-serif text-2xl font-bold text-terracotta-700 hover:text-terracotta-600 transition-colors'
            >
              vhistory
            </Link>
            <div className='flex items-center gap-6'>
              <div className='flex gap-4 text-sm font-medium text-sand-500'>
                <Link
                  href={`/${lang}`}
                  className='hover:text-terracotta-600 transition-colors'
                >
                  {dict.nav.home}
                </Link>
                <Link
                  href='#'
                  className='hover:text-terracotta-600 transition-colors'
                >
                  {dict.nav.about}
                </Link>
                <Link
                  href='#'
                  className='hover:text-terracotta-600 transition-colors'
                >
                  {dict.nav.contribute}
                </Link>
              </div>
              <Separator orientation='vertical' className='h-6 bg-sand-200' />
              <LanguageSwitcher currentLocale={lang} />
              <UserMenu />
            </div>
          </nav>
        </header>
        <main className='flex-1'>{children}</main>
        <footer className='py-8 bg-sand-100 text-center text-sand-400 text-sm'>
          &copy; {new Date().getFullYear()} vhistory.{' '}
          {lang === 'vi' ? 'Gìn giữ di sản.' : 'Preserving Heritage.'}
        </footer>
      </body>
    </html>
  );
}

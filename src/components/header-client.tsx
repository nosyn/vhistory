'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { UserMenu } from '@/components/user-menu';
import { LanguageSwitcher } from '@/components/language-switcher';
import { SearchCommand } from '@/components/search-command';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

interface HeaderClientProps {
  lang: Locale;
  dict: Dictionary;
}

export function HeaderClient({ lang, dict }: HeaderClientProps) {
  const pathname = usePathname();
  const isDashboard = pathname === `/${lang}`;

  return (
    <header className='p-6 border-b border-sand-200 bg-sand-50 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80'>
      <nav className='max-w-7xl mx-auto flex items-center justify-between gap-4'>
        <Link
          href={`/${lang}`}
          className='font-serif text-2xl font-bold text-terracotta-700 hover:text-terracotta-600 transition-colors shrink-0'
        >
          vhistory
        </Link>
        
        {!isDashboard && (
          <div className='flex-1 max-w-md'>
            <SearchCommand lang={lang} />
          </div>
        )}
        
        <div className='flex items-center gap-6 shrink-0'>
          <div className='hidden md:flex gap-4 text-sm font-medium text-sand-500'>
            <Link
              href={`/${lang}`}
              className='hover:text-terracotta-600 transition-colors'
            >
              {dict.nav.home}
            </Link>
            <Link
              href={`/${lang}/blog`}
              className='hover:text-terracotta-600 transition-colors'
            >
              {dict.nav.blog}
            </Link>
            <Link
              href={`/${lang}/about`}
              className='hover:text-terracotta-600 transition-colors'
            >
              {dict.nav.about}
            </Link>
            <Link
              href={`/${lang}/contribute`}
              className='hover:text-terracotta-600 transition-colors'
            >
              {dict.nav.contribute}
            </Link>
          </div>
          <Separator orientation='vertical' className='hidden md:block h-6 bg-sand-200' />
          <LanguageSwitcher currentLocale={lang} />
          <UserMenu />
        </div>
      </nav>
    </header>
  );
}

import type { ReactNode } from 'react';
import Link from 'next/link';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';

export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className='min-h-[calc(100vh-9rem)] flex items-center justify-center bg-sand-50 px-4 py-12'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <Link href={`/${lang}`} className='inline-block'>
            <h1 className='font-serif text-4xl font-bold text-terracotta-700 mb-2'>
              vhistory
            </h1>
          </Link>
          <p className='text-sand-500'>{dict.auth.tagline}</p>
        </div>

        {children}
      </div>
    </div>
  );
}

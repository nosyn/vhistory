import Link from 'next/link';
import { headers } from 'next/headers';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '@/components/ui/empty';
import { Home, BookOpen } from 'lucide-react';
import { getDictionary } from '@/i18n/dictionaries';
import { i18n, type Locale } from '@/i18n/config';

export default async function NotFound() {
  // Get the language from the pathname
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const langMatch = pathname.match(/^\/([a-z]{2})\//);
  const lang = (langMatch?.[1] || i18n.defaultLocale) as Locale;

  const dict = await getDictionary(lang);

  return (
    <div className='min-h-[80vh] flex items-center justify-center p-6'>
      <Empty className='border-sand-200 bg-white/80 backdrop-blur-sm shadow-xl max-w-2xl'>
        <EmptyHeader>
          <EmptyMedia
            variant='icon'
            className='bg-terracotta-100 h-24 w-32 mb-6'
          >
            <span className='text-5xl font-serif font-bold text-terracotta-600'>
              404
            </span>
          </EmptyMedia>
          <EmptyTitle className='text-3xl font-serif text-terracotta-800'>
            {dict.notFound.title}
          </EmptyTitle>
          <EmptyDescription className='text-base text-sand-600'>
            {dict.notFound.description}
            <br />
            {dict.notFound.suggestion}
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full'>
            <Link href={`/${lang}`} className='w-full'>
              <Button
                size='lg'
                className='bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full w-full'
              >
                <Home className='mr-2 h-5 w-5' />
                {dict.notFound.homeButton}
              </Button>
            </Link>
            <Link href={`/${lang}/blog`} className='w-full'>
              <Button
                size='lg'
                variant='outline'
                className='border-terracotta-300 text-terracotta-700 hover:bg-terracotta-50 rounded-full w-full'
              >
                <BookOpen className='mr-2 h-5 w-5' />
                {dict.notFound.blogButton}
              </Button>
            </Link>
          </div>

          <div className='mt-8 p-6 bg-linear-to-br from-sand-50 to-terracotta-50 rounded-lg border border-sand-200'>
            <p className='text-sm text-sand-700 text-center mb-3 font-medium'>
              {dict.notFound.searchQuestion}
            </p>
            <div className='flex gap-2 justify-center flex-wrap'>
              <Link href={`/${lang}/word/${encodeURIComponent('nhà')}`}>
                <Button
                  variant='secondary'
                  size='sm'
                  className='bg-white hover:bg-sand-50 text-terracotta-700 border border-sand-200 rounded-full'
                >
                  nhà
                </Button>
              </Link>
              <Link href={`/${lang}/word/${encodeURIComponent('mô')}`}>
                <Button
                  variant='secondary'
                  size='sm'
                  className='bg-white hover:bg-sand-50 text-terracotta-700 border border-sand-200 rounded-full'
                >
                  mô
                </Button>
              </Link>
              <Link href={`/${lang}/word/${encodeURIComponent('xài')}`}>
                <Button
                  variant='secondary'
                  size='sm'
                  className='bg-white hover:bg-sand-50 text-terracotta-700 border border-sand-200 rounded-full'
                >
                  xài
                </Button>
              </Link>
            </div>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}

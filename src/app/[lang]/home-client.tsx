'use client';

import { SearchCommand } from '@/components/search-command';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Locale } from '@/i18n/config';
import { Dictionary } from '@/i18n/dictionaries';
import { api } from '@/lib/client';
import { ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Dynamic import for Nivo map component (client-side only)
const VietnamRegionalMap = dynamic(
  () => import('@/components/maps/vietnam-regional-map'),
  {
    ssr: false,
    loading: () => (
      <div
        className='flex items-center justify-center bg-sand-50 rounded-lg border border-sand-200'
        style={{ height: 400, width: '100%' }}
      >
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-500 mx-auto mb-4' />
          <p className='text-sand-600'>Loading map...</p>
        </div>
      </div>
    ),
  }
);

interface HomeClientProps {
  dict: Dictionary;
  lang: Locale;
}

export default function HomeClient({ dict, lang }: HomeClientProps) {
  const [mapData, setMapData] = useState<Array<{ id: string; value: number }>>(
    []
  );
  const [wordOfTheDay, setWordOfTheDay] = useState<any>(null);
  const [wotdLoading, setWotdLoading] = useState(true);

  // Fetch Word of the Day
  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      try {
        const res = await fetch('/api/word-of-the-day');
        if (res.ok) {
          const data = await res.json();
          setWordOfTheDay(data);
        }
      } catch (error) {
        console.error('Failed to fetch Word of the Day', error);
      } finally {
        setWotdLoading(false);
      }
    };
    fetchWordOfTheDay();
  }, []);

  // Fetch regional word statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.stats.regions.$get();
        if (res.ok) {
          const { data } = await res.json();
          setMapData(data.mapData);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative py-20 px-6 text-center bg-sand-50'>
        <div className='max-w-3xl mx-auto space-y-8'>
          <h1 className='text-5xl md:text-6xl font-serif font-black text-terracotta-800 tracking-tight'>
            {dict.home.title}{' '}
            <span className='text-terracotta-500 italic'>
              {dict.home.titleHighlight}
            </span>
          </h1>
          <p className='text-lg text-sand-500 max-w-xl mx-auto'>
            {dict.home.subtitle}
          </p>

          <div className='max-w-xl mx-auto'>
            <SearchCommand lang={lang} />
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className='max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12'>
        {/* Word of the Day */}
        <div className='space-y-6'>
          <div className='flex items-center gap-3 mb-4'>
            <Separator className='flex-1 bg-terracotta-200' />
            <h2 className='font-serif text-2xl font-bold text-terracotta-800'>
              {dict.home.wordOfDay}
            </h2>
            <Separator className='flex-1 bg-terracotta-200' />
          </div>

          {wotdLoading ? (
            <Card className='shadow-md border-sand-200'>
              <CardContent className='py-8'>
                <div className='flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta-500' />
                </div>
              </CardContent>
            </Card>
          ) : wordOfTheDay?.word ? (
            <Link
              href={`/${lang}/word/${encodeURIComponent(
                wordOfTheDay.word.content
              )}`}
            >
              <Card className='shadow-md border-sand-200 group hover:shadow-lg transition-shadow relative overflow-hidden cursor-pointer'>
                <div className='absolute top-0 right-0 p-4 opacity-10 font-serif text-9xl text-terracotta-200 select-none group-hover:scale-110 transition-transform duration-700'>
                  "
                </div>
                <CardHeader className='relative z-10'>
                  <div className='flex items-start justify-between'>
                    <Badge className='w-fit mb-2 bg-terracotta-100 text-terracotta-700 hover:bg-terracotta-200'>
                      {wordOfTheDay.word.dialectType}
                    </Badge>
                    <ExternalLink className='h-5 w-5 text-terracotta-400 group-hover:text-terracotta-600 transition-colors' />
                  </div>
                  <CardTitle className='text-4xl font-serif text-gray-900'>
                    {wordOfTheDay.word.content}
                  </CardTitle>
                  {wordOfTheDay.word.pronunciation && (
                    <CardDescription className='text-lg italic text-sand-500'>
                      /{wordOfTheDay.word.pronunciation}/
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className='relative z-10 space-y-4'>
                  <p className='text-gray-700 leading-relaxed text-lg'>
                    {wordOfTheDay.word.definition}
                  </p>
                  {wordOfTheDay.word.usageExample && (
                    <Alert className='bg-sand-50 border-l-4 border-terracotta-400'>
                      <AlertDescription className='space-y-1'>
                        <p className='text-sand-600 font-medium italic'>
                          "{wordOfTheDay.word.usageExample}"
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}
                  {wordOfTheDay.stats && (
                    <p className='text-xs text-sand-400'>
                      {wordOfTheDay.stats.viewCount} views today
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card className='shadow-md border-sand-200'>
              <CardContent className='py-8 text-center'>
                <p className='text-sand-500'>No word of the day available</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map Section */}
        <div className='space-y-6 min-w-0'>
          <div className='flex items-center gap-3 mb-4'>
            <Separator className='flex-1 bg-sand-200' />
            <h2 className='font-serif text-2xl font-bold text-sand-600'>
              {dict.home.regionMap}
            </h2>
            <Separator className='flex-1 bg-sand-200' />
          </div>
          <Card className='border-sand-200'>
            <CardHeader>
              <CardTitle className='text-lg text-sand-700'>
                Word Usage by Region
              </CardTitle>
              <CardDescription>
                Explore how words are distributed across Vietnam's provinces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VietnamRegionalMap
                height={400}
                data={mapData}
                domain={[0, 100]}
                colors='oranges'
                showLegend={true}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

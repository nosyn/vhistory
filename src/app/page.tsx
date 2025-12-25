'use client';

import { useState, useEffect } from 'react';
import { MapPlaceholder } from '@/components/map-placeholder';
import { api } from '@/lib/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(false);
    try {
      const res = await api.search.$get({ query: { q: query } });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
        setHasSearched(true);
      }
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative py-20 px-6 text-center bg-sand-50'>
        <div className='max-w-3xl mx-auto space-y-8'>
          <h1 className='text-5xl md:text-6xl font-serif font-black text-terracotta-800 tracking-tight'>
            Trace the{' '}
            <span className='text-terracotta-500 italic'>Origins</span>
          </h1>
          <p className='text-lg text-sand-500 max-w-xl mx-auto'>
            A collaborative dictionary preserving the nuances of Vietnamese
            dialects across North, Central, and South regions.
          </p>

          <form onSubmit={handleSearch} className='relative max-w-xl mx-auto'>
            <div className='relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400' />
              <Input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a word (e.g. 'mô', 'tê', 'răng')..."
                className='pl-12 pr-28 h-14 rounded-full border-2 border-sand-200 focus:border-terracotta-400 focus:ring-4 focus:ring-terracotta-100 text-lg font-serif placeholder:text-sand-300 shadow-sm'
              />
              <Button
                type='submit'
                disabled={loading}
                className='absolute right-2 top-1/2 -translate-y-1/2 bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 rounded-full h-10'
              >
                {loading ? '...' : 'Search'}
              </Button>
            </div>
          </form>

          {/* Quick Results Demo */}
          {results.length > 0 ? (
            <div className='mt-8 max-w-xl mx-auto space-y-2'>
              {results.map((word: any) => (
                <Card
                  key={word.id}
                  className='text-left hover:shadow-md transition-shadow border-sand-200'
                >
                  <CardHeader className='pb-3'>
                    <div className='flex justify-between items-start'>
                      <CardTitle className='text-xl font-serif text-terracotta-700'>
                        {word.content}
                      </CardTitle>
                      <Badge
                        variant='secondary'
                        className='bg-sand-100 text-terracotta-700 hover:bg-sand-200'
                      >
                        {word.dialectType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <CardDescription className='text-sand-600'>
                      {word.definition}
                    </CardDescription>
                    {word.usageExample && (
                      <Alert className='bg-sand-50 border-sand-200'>
                        <AlertDescription className='text-sand-600 italic text-sm'>
                          "{word.usageExample}"
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : hasSearched && !loading ? (
            <Card className='mt-8 max-w-xl mx-auto border-dashed border-sand-300 bg-sand-50'>
              <CardContent className='py-8 text-center'>
                <p className='text-sand-500 font-serif italic'>
                  No words found for "{query}".
                </p>
                <p className='text-sm text-sand-400 mt-1'>
                  Try searching for "Huế", "mô", or "răng".
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>

      {/* Content Grid */}
      <section className='max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12'>
        {/* Word of the Day */}
        <div className='space-y-6'>
          <div className='flex items-center gap-3 mb-4'>
            <Separator className='flex-1 bg-terracotta-200' />
            <h2 className='font-serif text-2xl font-bold text-terracotta-800'>
              Word of the Day
            </h2>
            <Separator className='flex-1 bg-terracotta-200' />
          </div>

          <Card className='shadow-md border-sand-200 group hover:shadow-lg transition-shadow relative overflow-hidden'>
            <div className='absolute top-0 right-0 p-4 opacity-10 font-serif text-9xl text-terracotta-200 select-none group-hover:scale-110 transition-transform duration-700'>
              "
            </div>
            <CardHeader className='relative z-10'>
              <Badge className='w-fit mb-2 bg-terracotta-100 text-terracotta-700 hover:bg-terracotta-200'>
                Central Dialect
              </Badge>
              <CardTitle className='text-4xl font-serif text-gray-900'>
                Chí mô
              </CardTitle>
              <CardDescription className='text-lg italic text-sand-500'>
                /chiː mo/ • exclamation
              </CardDescription>
            </CardHeader>
            <CardContent className='relative z-10 space-y-4'>
              <p className='text-gray-700 leading-relaxed text-lg'>
                Used to express "nowhere" or "nothing at all" in a dismissive or
                emphasizing way. Similar to "đâu có" in standard Vietnamese but
                with stronger regional flair.
              </p>
              <Alert className='bg-sand-50 border-l-4 border-terracotta-400'>
                <AlertDescription className='space-y-1'>
                  <p className='text-sand-600 font-medium'>
                    "Mi đi mô rứa? Tau nỏ đi chí mô cả!"
                  </p>
                  <p className='text-sand-400 text-sm'>
                    (Where are you going? I'm not going anywhere!)
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <div className='space-y-6'>
          <div className='flex items-center gap-3 mb-4'>
            <Separator className='flex-1 bg-sand-200' />
            <h2 className='font-serif text-2xl font-bold text-sand-600'>
              Region Map
            </h2>
            <Separator className='flex-1 bg-sand-200' />
          </div>
          <MapPlaceholder />
          <div className='grid grid-cols-3 gap-4'>
            <Card className='text-center border-sand-200 hover:shadow-md transition-shadow'>
              <CardContent className='pt-6'>
                <div className='text-3xl font-serif font-bold text-terracotta-600 mb-1'>
                  1,240
                </div>
                <div className='text-xs text-sand-400 font-medium uppercase tracking-widest'>
                  North
                </div>
              </CardContent>
            </Card>
            <Card className='text-center border-sand-200 hover:shadow-md transition-shadow'>
              <CardContent className='pt-6'>
                <div className='text-3xl font-serif font-bold text-terracotta-600 mb-1'>
                  3,892
                </div>
                <div className='text-xs text-sand-400 font-medium uppercase tracking-widest'>
                  Central
                </div>
              </CardContent>
            </Card>
            <Card className='text-center border-sand-200 hover:shadow-md transition-shadow'>
              <CardContent className='pt-6'>
                <div className='text-3xl font-serif font-bold text-terracotta-600 mb-1'>
                  2,105
                </div>
                <div className='text-xs text-sand-400 font-medium uppercase tracking-widest'>
                  South
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

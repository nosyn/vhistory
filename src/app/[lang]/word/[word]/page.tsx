import { AudioPlayer } from '@/components/audio-player';
import { RegionalMapDisplay } from '@/components/maps/regional-map-display';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { db } from '@/lib/db';
import { getWordRegionMapData } from '@/lib/db/region-helpers';
import { regions, wordRegions, words } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ArrowLeft, BookOpen, MapPin, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface WordPageProps {
  params: Promise<{ word: string; lang: Locale }>;
}

export default async function WordPage({ params }: WordPageProps) {
  const { word: encodedWord, lang } = await params;
  // Decode the URL-encoded word
  const wordContent = decodeURIComponent(encodedWord);
  const dict = await getDictionary(lang);

  // Fetch word by content
  const wordResult = await db
    .select()
    .from(words)
    .where(eq(words.content, wordContent))
    .limit(1);

  if (!wordResult.length) {
    notFound();
  }

  const word = wordResult[0];

  // Fetch all regions where this word is used
  const wordRegionsList = await db
    .select({
      region: regions,
      usageStrength: wordRegions.usageStrength,
    })
    .from(wordRegions)
    .leftJoin(regions, eq(wordRegions.regionId, regions.id))
    .where(eq(wordRegions.wordId, word.id));

  const usedInRegions = wordRegionsList
    .map((wr) => wr.region)
    .filter(Boolean) as (typeof regions.$inferSelect)[];

  // Get map data with hierarchical expansion
  const mapData = await getWordRegionMapData(word.id);

  return (
    <div className='min-h-screen bg-sand-50'>
      {/* Header */}
      <section className='bg-white border-b border-sand-200'>
        <div className='max-w-4xl mx-auto px-6 py-8'>
          <Link href={`/${lang}`}>
            <Button
              variant='ghost'
              className='mb-4 text-sand-600 hover:text-terracotta-600 hover:bg-sand-100'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              {dict.word.backToSearch}
            </Button>
          </Link>

          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <h1 className='text-5xl font-serif font-bold text-terracotta-800 mb-2'>
                {word.content}
              </h1>
              {word.pronunciation && (
                <p className='text-lg text-sand-500 font-medium mb-4'>
                  /{word.pronunciation}/
                </p>
              )}
              <div className='flex gap-2 flex-wrap'>
                <Badge className='bg-terracotta-100 text-terracotta-700 hover:bg-terracotta-200'>
                  {word.dialectType === 'North'
                    ? dict.dialects.north
                    : word.dialectType === 'Central'
                    ? dict.dialects.central
                    : dict.dialects.south}{' '}
                  {dict.word.dialect}
                </Badge>
                {usedInRegions.map((region) => (
                  <Badge
                    key={region.id}
                    variant='outline'
                    className='border-sand-300 text-sand-600'
                  >
                    <MapPin className='mr-1 h-3 w-3' />
                    {region.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className='max-w-4xl mx-auto px-6 py-12 space-y-8'>
        {/* Audio Player */}
        <AudioPlayer
          word={word.content}
          accents={[
            { label: 'Northern', dialect: 'North' },
            { label: 'Central', dialect: 'Central' },
            { label: 'Southern', dialect: 'South' },
          ]}
        />

        {/* Definition */}
        <Card className='border-sand-200'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-terracotta-700'>
              <BookOpen className='h-5 w-5' />
              {dict.word.definition}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-lg text-sand-700 leading-relaxed'>
              {word.definition}
            </p>
          </CardContent>
        </Card>

        {/* Usage Example */}
        {word.usageExample && (
          <Card className='border-sand-200 bg-sand-50'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-terracotta-700'>
                <MessageSquare className='h-5 w-5' />
                {dict.word.usageExample}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className='bg-white border-sand-200'>
                <AlertDescription className='text-sand-700 italic text-lg'>
                  "{word.usageExample}"
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Etymology */}
        {word.etymology && (
          <Card className='border-sand-200'>
            <CardHeader>
              <CardTitle className='text-terracotta-700'>
                {dict.word.etymology}
              </CardTitle>
              <CardDescription>{dict.word.etymologyDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sand-700 leading-relaxed'>{word.etymology}</p>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {word.notes && (
          <Card className='border-sand-200'>
            <CardHeader>
              <CardTitle className='text-terracotta-700'>
                {dict.word.culturalNotes}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sand-700 leading-relaxed'>{word.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Regional Information */}
        {usedInRegions.length > 0 && (
          <Card className='border-sand-200'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-terracotta-700'>
                <MapPin className='h-5 w-5' />
                {dict.word.regionalDistribution}
              </CardTitle>
              <CardDescription>
                {dict.word.usedInRegions
                  .replace('{count}', usedInRegions.length.toString())
                  .replace(
                    '{plural}',
                    usedInRegions.length > 1 ? (lang === 'vi' ? '' : 's') : ''
                  )}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* List of regions */}
              <div>
                <h3 className='font-semibold text-sand-700 mb-3'>
                  {dict.word.usedInTheseRegions}
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {usedInRegions.map((region) => (
                    <div
                      key={region.id}
                      className='p-3 bg-sand-50 rounded-lg border border-sand-200'
                    >
                      <p className='font-medium text-sand-800'>{region.name}</p>
                      {region.code && (
                        <p className='text-sm text-sand-400'>
                          {dict.word.code}: {region.code}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Map */}
              <div>
                <h3 className='font-semibold text-sand-700 mb-3'>
                  {dict.word.mapVisualization}
                </h3>
                <RegionalMapDisplay mapData={mapData} />
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className='bg-sand-200' />

        {/* Metadata */}
        <div className='flex justify-between items-center text-sm text-sand-400'>
          <p>
            {dict.word.addedOn}{' '}
            {new Date(word.createdAt).toLocaleDateString(
              lang === 'vi' ? 'vi-VN' : 'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            )}
          </p>
          {word.updatedAt &&
            word.updatedAt.getTime() !== word.createdAt.getTime() && (
              <p>
                {dict.word.lastUpdated}{' '}
                {new Date(word.updatedAt).toLocaleDateString(
                  lang === 'vi' ? 'vi-VN' : 'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: WordPageProps) {
  const { word: encodedWord } = await params;
  const wordContent = decodeURIComponent(encodedWord);

  const result = await db
    .select()
    .from(words)
    .where(eq(words.content, wordContent))
    .limit(1);

  if (!result.length) {
    return {
      title: 'Word Not Found',
    };
  }

  const word = result[0];

  return {
    title: `${word.content} - vHistory`,
    description: word.definition.slice(0, 160),
  };
}

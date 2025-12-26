import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { words, regions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
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
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, BookOpen, MessageSquare } from 'lucide-react';

interface WordPageProps {
  params: Promise<{ id: string }>;
}

export default async function WordPage({ params }: WordPageProps) {
  const { id } = await params;

  // Fetch word with region information
  const result = await db
    .select({
      word: words,
      region: regions,
    })
    .from(words)
    .leftJoin(regions, eq(words.regionId, regions.id))
    .where(eq(words.id, id))
    .limit(1);

  if (!result.length) {
    notFound();
  }

  const { word, region } = result[0];

  return (
    <div className='min-h-screen bg-sand-50'>
      {/* Header */}
      <section className='bg-white border-b border-sand-200'>
        <div className='max-w-4xl mx-auto px-6 py-8'>
          <Link href='/'>
            <Button
              variant='ghost'
              className='mb-4 text-sand-600 hover:text-terracotta-600 hover:bg-sand-100'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Search
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
              <div className='flex gap-2'>
                <Badge className='bg-terracotta-100 text-terracotta-700 hover:bg-terracotta-200'>
                  {word.dialectType} Dialect
                </Badge>
                {region && (
                  <Badge
                    variant='outline'
                    className='border-sand-300 text-sand-600'
                  >
                    <MapPin className='mr-1 h-3 w-3' />
                    {region.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className='max-w-4xl mx-auto px-6 py-12 space-y-8'>
        {/* Definition */}
        <Card className='border-sand-200'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-terracotta-700'>
              <BookOpen className='h-5 w-5' />
              Definition
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
                Usage Example
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
              <CardTitle className='text-terracotta-700'>Etymology</CardTitle>
              <CardDescription>Origin and history of the word</CardDescription>
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
                Cultural Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sand-700 leading-relaxed'>{word.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Regional Information */}
        {region && (
          <Card className='border-sand-200'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-terracotta-700'>
                <MapPin className='h-5 w-5' />
                Regional Context
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='font-semibold text-sand-700 mb-1'>Region</h3>
                <p className='text-sand-600'>{region.name}</p>
                {region.code && (
                  <p className='text-sm text-sand-400'>Code: {region.code}</p>
                )}
              </div>
              {region.description && (
                <div>
                  <h3 className='font-semibold text-sand-700 mb-1'>
                    About this region
                  </h3>
                  <p className='text-sand-600'>{region.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Separator className='bg-sand-200' />

        {/* Metadata */}
        <div className='flex justify-between items-center text-sm text-sand-400'>
          <p>
            Added on{' '}
            {new Date(word.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {word.updatedAt &&
            word.updatedAt.getTime() !== word.createdAt.getTime() && (
              <p>
                Last updated{' '}
                {new Date(word.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: WordPageProps) {
  const { id } = await params;

  const result = await db.select().from(words).where(eq(words.id, id)).limit(1);

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

import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Users, BookOpen, Globe } from 'lucide-react';
import Link from 'next/link';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

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
              Back to Home
            </Button>
          </Link>
          <h1 className='text-5xl font-serif font-bold text-terracotta-800 mb-4'>
            About VHistory
          </h1>
          <p className='text-lg text-sand-600'>
            Preserving and celebrating Vietnamese linguistic diversity
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className='max-w-4xl mx-auto px-6 py-12 space-y-8'>
        {/* Mission */}
        <Card className='border-sand-200'>
          <CardHeader>
            <div className='flex items-center gap-3 mb-2'>
              <Heart className='h-6 w-6 text-terracotta-600' />
              <CardTitle className='text-2xl text-terracotta-800'>
                Our Mission
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='space-y-4 text-sand-700 leading-relaxed'>
            <p>
              VHistory is dedicated to preserving the rich tapestry of
              Vietnamese dialects and regional expressions. We believe that
              every word, phrase, and pronunciation carries the history and
              culture of its people.
            </p>
            <p>
              Our platform serves as a living dictionary where users can
              explore, learn, and contribute to the documentation of Vietnamese
              linguistic diversity across regions—from the Northern highlands to
              the Central plains and the Southern delta.
            </p>
          </CardContent>
        </Card>

        {/* What We Do */}
        <Card className='border-sand-200'>
          <CardHeader>
            <div className='flex items-center gap-3 mb-2'>
              <BookOpen className='h-6 w-6 text-terracotta-600' />
              <CardTitle className='text-2xl text-terracotta-800'>
                What We Do
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <h3 className='font-semibold text-lg text-terracotta-700'>
                  Document Regional Words
                </h3>
                <p className='text-sand-600'>
                  Catalog words, phrases, and expressions unique to different
                  regions of Vietnam, preserving their meanings and usage
                  contexts.
                </p>
              </div>
              <div className='space-y-2'>
                <h3 className='font-semibold text-lg text-terracotta-700'>
                  Cultural Context
                </h3>
                <p className='text-sand-600'>
                  Provide etymological information and cultural notes that help
                  understand the historical and social significance of each
                  word.
                </p>
              </div>
              <div className='space-y-2'>
                <h3 className='font-semibold text-lg text-terracotta-700'>
                  Visual Mapping
                </h3>
                <p className='text-sand-600'>
                  Display the geographical distribution of words across Vietnam,
                  showing how language varies across regions.
                </p>
              </div>
              <div className='space-y-2'>
                <h3 className='font-semibold text-lg text-terracotta-700'>
                  Community Contributions
                </h3>
                <p className='text-sand-600'>
                  Enable users to share their knowledge and help grow our
                  collection of regional Vietnamese vocabulary.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why It Matters */}
        <Card className='border-sand-200'>
          <CardHeader>
            <div className='flex items-center gap-3 mb-2'>
              <Globe className='h-6 w-6 text-terracotta-600' />
              <CardTitle className='text-2xl text-terracotta-800'>
                Why It Matters
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='space-y-4 text-sand-700 leading-relaxed'>
            <p>
              Languages are living entities that evolve and change. As Vietnam
              modernizes and urbanizes, many regional dialects and unique
              expressions risk being lost. VHistory aims to:
            </p>
            <ul className='list-disc list-inside space-y-2 ml-4'>
              <li>Preserve linguistic heritage for future generations</li>
              <li>Help Vietnamese learners understand regional variations</li>
              <li>Connect people with their cultural roots through language</li>
              <li>Facilitate better communication across regions</li>
              <li>Support linguistic research and education</li>
            </ul>
          </CardContent>
        </Card>

        {/* Community */}
        <Card className='border-sand-200 bg-terracotta-50'>
          <CardHeader>
            <div className='flex items-center gap-3 mb-2'>
              <Users className='h-6 w-6 text-terracotta-600' />
              <CardTitle className='text-2xl text-terracotta-800'>
                Join Our Community
              </CardTitle>
            </div>
            <CardDescription className='text-sand-600'>
              Help us build the most comprehensive Vietnamese dialect dictionary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex gap-4'>
              <Link href={`/${lang}/contribute`}>
                <Button className='bg-terracotta-600 hover:bg-terracotta-700 text-white'>
                  Start Contributing
                </Button>
              </Link>
              <Link href={`/${lang}`}>
                <Button
                  variant='outline'
                  className='border-terracotta-600 text-terracotta-600 hover:bg-terracotta-50'
                >
                  Explore Words
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

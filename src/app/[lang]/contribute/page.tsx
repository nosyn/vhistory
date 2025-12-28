import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  MessageSquare,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default async function ContributePage({
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
            Contribute to VHistory
          </h1>
          <p className='text-lg text-sand-600'>
            Help preserve Vietnamese linguistic heritage
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className='max-w-4xl mx-auto px-6 py-12 space-y-8'>
        {/* Introduction */}
        <Card className='border-sand-200 bg-terracotta-50'>
          <CardHeader>
            <CardTitle className='text-2xl text-terracotta-800'>
              Your Voice Matters
            </CardTitle>
            <CardDescription className='text-sand-700'>
              VHistory thrives on community contributions. Whether you're a
              native speaker, language enthusiast, or researcher, your knowledge
              helps preserve Vietnamese dialects for future generations.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Getting Started */}
        <Alert className='border-terracotta-200 bg-terracotta-50'>
          <AlertDescription className='text-sand-700'>
            <strong className='text-terracotta-800'>
              New to contributing?
            </strong>
            <span className='ml-2'>
              Start by creating an account, then explore existing entries to
              understand our format. Don't hesitate to reach out if you have
              questions!
            </span>
            <div className='flex gap-4 justify-center mt-2'>
              <Link href={`/${lang}/register`}>
                <Button className='bg-terracotta-600 hover:bg-terracotta-700 text-white'>
                  Create Account
                </Button>
              </Link>
              <Link href={`/${lang}/about`}>
                <Button
                  variant='outline'
                  className='border-terracotta-600 text-terracotta-600 hover:bg-terracotta-50'
                >
                  Learn More About VHistory
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>

        {/* Ways to Contribute */}
        <div className='space-y-6'>
          <h2 className='text-3xl font-serif font-bold text-terracotta-800'>
            Ways to Contribute
          </h2>

          <Card className='border-sand-200'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <BookOpen className='h-6 w-6 text-terracotta-600' />
                <CardTitle className='text-xl text-terracotta-800'>
                  Add New Words
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-sand-700'>
                Share words, phrases, or expressions unique to your region.
                Include:
              </p>
              <ul className='list-disc list-inside space-y-2 ml-4 text-sand-600'>
                <li>The word or phrase in Vietnamese</li>
                <li>Clear definition and meaning</li>
                <li>Usage examples in context</li>
                <li>
                  Pronunciation guide (if different from standard Vietnamese)
                </li>
                <li>Regional information (where it's commonly used)</li>
                <li>Cultural context or etymology (if known)</li>
              </ul>
              <Button className='bg-terracotta-600 hover:bg-terracotta-700 text-white'>
                Submit a Word
              </Button>
            </CardContent>
          </Card>

          <Card className='border-sand-200'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <MessageSquare className='h-6 w-6 text-terracotta-600' />
                <CardTitle className='text-xl text-terracotta-800'>
                  Write Blog Posts
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-sand-700'>
                Share your insights about Vietnamese words and their cultural
                significance. Write about:
              </p>
              <ul className='list-disc list-inside space-y-2 ml-4 text-sand-600'>
                <li>The story behind a word's origin</li>
                <li>How regional words reflect local culture</li>
                <li>Personal experiences with dialect differences</li>
                <li>Historical evolution of Vietnamese expressions</li>
                <li>Comparative analysis across regions</li>
              </ul>
              <Link href={`/${lang}/blog/create`}>
                <Button className='bg-terracotta-600 hover:bg-terracotta-700 text-white'>
                  Write a Blog Post
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className='border-sand-200'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <Lightbulb className='h-6 w-6 text-terracotta-600' />
                <CardTitle className='text-xl text-terracotta-800'>
                  Improve Existing Entries
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-sand-700'>Help enhance our dictionary by:</p>
              <ul className='list-disc list-inside space-y-2 ml-4 text-sand-600'>
                <li>Suggesting corrections or clarifications</li>
                <li>Adding alternative pronunciations</li>
                <li>Providing additional usage examples</li>
                <li>Contributing etymological information</li>
                <li>Verifying regional usage data</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <Card className='border-sand-200'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <Shield className='h-6 w-6 text-terracotta-600' />
              <CardTitle className='text-2xl text-terracotta-800'>
                Contribution Guidelines
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='space-y-4 text-sand-700'>
            <div className='space-y-3'>
              <h3 className='font-semibold text-lg text-terracotta-700'>
                Quality Standards
              </h3>
              <ul className='list-disc list-inside space-y-2 ml-4 text-sand-600'>
                <li>Provide accurate and verifiable information</li>
                <li>Use respectful and inclusive language</li>
                <li>Cite sources when possible</li>
                <li>Avoid offensive or discriminatory content</li>
              </ul>
            </div>

            <div className='space-y-3'>
              <h3 className='font-semibold text-lg text-terracotta-700'>
                Best Practices
              </h3>
              <ul className='list-disc list-inside space-y-2 ml-4 text-sand-600'>
                <li>Write clear, concise definitions</li>
                <li>Include real-world usage examples</li>
                <li>Be specific about regional variations</li>
                <li>Add cultural context when relevant</li>
                <li>Use standard Vietnamese spelling where possible</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

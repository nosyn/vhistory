import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { blogPosts, words } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';
import { Locale } from '@/i18n/config';
import { BlogComments } from '@/components/blog-comments';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

interface BlogPostPageProps {
  params: Promise<{ slug: string; lang: Locale }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, lang } = await params;

  // Get session for authenticated user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const post = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1)
    .then((res) => res[0]);

  if (!post || !post.published) {
    notFound();
  }

  // Get associated word if exists
  let associatedWord = null;
  if (post.wordId) {
    associatedWord = await db
      .select()
      .from(words)
      .where(eq(words.id, post.wordId))
      .limit(1)
      .then((res) => res[0]);
  }

  return (
    <div className='min-h-screen bg-sand-50'>
      {/* Header */}
      <section className='bg-white border-b border-sand-200'>
        <div className='max-w-4xl mx-auto px-6 py-8'>
          <Link href={`/${lang}/blog`}>
            <Button
              variant='ghost'
              className='mb-4 text-sand-600 hover:text-terracotta-600 hover:bg-sand-100'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Blog
            </Button>
          </Link>
          <h1 className='text-4xl md:text-5xl font-serif font-bold text-terracotta-800 mb-4'>
            {post.title}
          </h1>
          {post.excerpt && (
            <p className='text-lg text-sand-600 mb-4'>{post.excerpt}</p>
          )}
          <div className='flex items-center gap-4 text-sm text-sand-500'>
            <div className='flex items-center gap-1'>
              <Calendar className='h-4 w-4' />
              {new Date(post.published).toLocaleDateString(lang, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className='flex items-center gap-1'>
              <Eye className='h-4 w-4' />
              {post.viewCount} views
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className='max-w-4xl mx-auto px-6 py-12'>
        <div className='space-y-8'>
          {associatedWord && (
            <Card className='border-terracotta-200 bg-terracotta-50'>
              <CardHeader>
                <CardTitle className='text-lg text-terracotta-800'>
                  Related Word
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/${lang}/word/${associatedWord.id}`}>
                  <div className='flex items-center gap-2 hover:underline'>
                    <span className='text-2xl font-serif font-bold text-terracotta-700'>
                      {associatedWord.content}
                    </span>
                    <Badge className='bg-terracotta-100 text-terracotta-700'>
                      {associatedWord.dialectType}
                    </Badge>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card className='border-sand-200'>
            <CardContent className='pt-6'>
              <div
                className='prose prose-lg max-w-none prose-headings:text-terracotta-800 prose-a:text-terracotta-600'
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          {/* Comments Section */}
          <BlogComments slug={slug} session={session} />
        </div>
      </section>
    </div>
  );
}

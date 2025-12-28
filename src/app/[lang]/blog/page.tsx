import Link from 'next/link';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { desc, isNotNull, sql } from 'drizzle-orm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Eye, PenSquare } from 'lucide-react';
import { Locale } from '@/i18n/config';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function BlogListPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { lang } = await params;
  const { page = '1' } = await searchParams;

  // Get session for authenticated user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentPage = Math.max(1, parseInt(page));
  const postsPerPage = 9;
  const offset = (currentPage - 1) * postsPerPage;

  // Get total count for pagination
  const totalCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(blogPosts)
    .where(isNotNull(blogPosts.published))
    .then((res) => res[0]?.count || 0);

  const totalPages = Math.ceil(totalCount / postsPerPage);

  // Get paginated posts
  const posts = await db
    .select()
    .from(blogPosts)
    .where(isNotNull(blogPosts.published))
    .orderBy(desc(blogPosts.published))
    .limit(postsPerPage)
    .offset(offset);

  return (
    <div className='min-h-screen bg-sand-50'>
      {/* Header */}
      <section className='bg-white border-b border-sand-200'>
        <div className='max-w-4xl mx-auto px-6 py-8'>
          <div className='flex items-start justify-between mb-4'>
            <Link href={`/${lang}`}>
              <Button
                variant='ghost'
                className='text-sand-600 hover:text-terracotta-600 hover:bg-sand-100'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Home
              </Button>
            </Link>
            <Link href={`/${lang}/blog/create`}>
              <Button className='bg-terracotta-600 hover:bg-terracotta-700 text-white'>
                <PenSquare className='mr-2 h-4 w-4' />
                Write Blog Post
              </Button>
            </Link>
          </div>
          <h1 className='text-5xl font-serif font-bold text-terracotta-800 mb-4'>
            Blog
          </h1>
          <p className='text-lg text-sand-600'>
            Stories and insights about Vietnamese language and culture
          </p>
        </div>
      </section>

      {/* Content */}
      <section className='max-w-4xl mx-auto px-6 py-12'>
        {posts.length === 0 ? (
          <Card className='border-sand-200'>
            <CardContent className='py-12 text-center'>
              <p className='text-sand-500 font-serif italic'>
                No blog posts yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='flex flex-col gap-2'>
            {posts.map((post) => (
              <Link key={post.id} href={`/${lang}/blog/${post.slug}`}>
                <Card className='border-sand-200 hover:shadow-md transition-shadow cursor-pointer'>
                  <CardHeader>
                    <div className='flex items-start justify-between gap-4'>
                      <CardTitle className='text-2xl font-serif text-terracotta-800 hover:text-terracotta-600 transition-colors'>
                        {post.title}
                      </CardTitle>
                      {post.wordId && (
                        <Badge
                          variant='outline'
                          className='border-terracotta-200 text-terracotta-600 shrink-0'
                        >
                          Word-related
                        </Badge>
                      )}
                    </div>
                    {post.excerpt && (
                      <CardDescription className='text-base'>
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className='flex items-center gap-4 text-sm text-sand-500'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        {post.published &&
                          new Date(post.published).toLocaleDateString(lang, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Eye className='h-4 w-4' />
                        {post.viewCount} views
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center items-center gap-2 mt-8'>
                <Link
                  href={`/${lang}/blog?page=${currentPage - 1}`}
                  className={currentPage === 1 ? 'pointer-events-none' : ''}
                >
                  <Button
                    variant='outline'
                    disabled={currentPage === 1}
                    className='border-sand-300'
                  >
                    Previous
                  </Button>
                </Link>

                <div className='flex gap-2'>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Link
                        key={pageNum}
                        href={`/${lang}/blog?page=${pageNum}`}
                      >
                        <Button
                          variant={
                            currentPage === pageNum ? 'default' : 'outline'
                          }
                          className={
                            currentPage === pageNum
                              ? 'bg-terracotta-600 hover:bg-terracotta-700 text-white'
                              : 'border-sand-300'
                          }
                        >
                          {pageNum}
                        </Button>
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href={`/${lang}/blog?page=${currentPage + 1}`}
                  className={
                    currentPage === totalPages ? 'pointer-events-none' : ''
                  }
                >
                  <Button
                    variant='outline'
                    disabled={currentPage === totalPages}
                    className='border-sand-300'
                  >
                    Next
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

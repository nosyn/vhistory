'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TiptapEditor } from '@/components/tiptap-editor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface BlogCreateClientProps {
  lang: string;
}

export default function BlogCreateClient({ lang }: BlogCreateClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [wordId, setWordId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/blog/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          wordId: wordId || null,
          publish,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(publish ? 'Blog post published!' : 'Draft saved!');
        router.push(`/${lang}/blog/${data.slug}`);
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to create blog post');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className='text-4xl font-serif font-bold text-terracotta-800 mb-2'>
            Write a Blog Post
          </h1>
          <p className='text-sand-600'>
            Share your insights about Vietnamese words and culture
          </p>
        </div>
      </section>

      {/* Form */}
      <section className='max-w-4xl mx-auto px-6 py-12'>
        <form onSubmit={(e) => handleSubmit(e, true)} className='space-y-6'>
          <Card className='border-sand-200'>
            <CardHeader>
              <CardTitle className='text-terracotta-800'>
                Post Details
              </CardTitle>
              <CardDescription>
                Basic information about your blog post
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Title *</Label>
                <Input
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Enter a compelling title...'
                  className='border-sand-200'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='excerpt'>Excerpt</Label>
                <Input
                  id='excerpt'
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder='A brief summary of your post...'
                  className='border-sand-200'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='wordId'>Associated Word ID (optional)</Label>
                <Input
                  id='wordId'
                  value={wordId}
                  onChange={(e) => setWordId(e.target.value)}
                  placeholder='Link this post to a specific word...'
                  className='border-sand-200'
                />
              </div>
            </CardContent>
          </Card>

          <Card className='border-sand-200'>
            <CardHeader>
              <CardTitle className='text-terracotta-800'>Content *</CardTitle>
              <CardDescription>
                Write your blog post using the editor below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TiptapEditor
                content={content}
                onChange={setContent}
                placeholder='Start writing your blog post...'
              />
            </CardContent>
          </Card>

          <div className='flex gap-4'>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='bg-terracotta-600 hover:bg-terracotta-700 text-white'
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
            <Button
              type='button'
              variant='outline'
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e, false)}
              className='border-sand-300'
            >
              Save as Draft
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

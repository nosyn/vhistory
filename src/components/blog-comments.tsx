'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send } from 'lucide-react';
import { api } from '@/lib/client';
import { getInitials, formatDate } from '@/lib/helpers/format';
import { toast } from 'sonner';

interface Comment {
  id: string;
  blogPostId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogCommentsProps {
  slug: string;
  session: { user?: { id: string; name: string; email: string } } | null;
}

export function BlogComments({ slug, session }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [slug]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await api.blog[':slug'].comments.$get({
        param: { slug },
      });
      const data = await response.json();
      if ('comments' in data) {
        // Convert date strings to Date objects
        const commentsWithDates = data.comments.map((comment) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt),
        }));
        setComments(commentsWithDates);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
      toast.error('Failed to Load Comments', {
        description: 'Could not load comments. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !session?.user) return;

    setSubmitting(true);
    try {
      const response = await api.blog[':slug'].comments.$post({
        param: { slug },
        json: {
          content: content.trim(),
          authorId: session.user.id,
          authorName: session.user.name || session.user.email,
        },
      });

      if (response.ok) {
        setContent('');
        await loadComments();
        toast.success('Comment Posted', {
          description: 'Your comment has been added successfully.',
        });
      } else {
        toast.error('Failed to Post Comment', {
          description: 'Could not post your comment. Please try again.',
        });
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      toast.error('Failed to Post Comment', {
        description: 'An error occurred while posting your comment.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className='border-sand-200'>
      <CardHeader>
        <CardTitle className='text-2xl font-serif text-terracotta-800 flex items-center gap-2'>
          <MessageSquare className='h-6 w-6' />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Comment form */}
        {session?.user ? (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='flex gap-3'>
              <Avatar className='h-10 w-10 shrink-0'>
                <AvatarFallback className='bg-terracotta-100 text-terracotta-700 font-medium'>
                  {getInitials(session.user.name || session.user.email)}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder='Share your thoughts...'
                  className='min-h-25 border-sand-300 focus:border-terracotta-500 focus:ring-terracotta-500'
                  maxLength={1000}
                />
                <div className='flex justify-between items-center mt-2'>
                  <span className='text-xs text-sand-500'>
                    {content.length}/1000
                  </span>
                  <Button
                    type='submit'
                    disabled={!content.trim() || submitting}
                    className='bg-terracotta-600 hover:bg-terracotta-700 text-white'
                  >
                    <Send className='mr-2 h-4 w-4' />
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <Card className='border-sand-200 bg-sand-50'>
            <CardContent className='py-4 text-center'>
              <p className='text-sand-600'>Please sign in to leave a comment</p>
            </CardContent>
          </Card>
        )}

        {/* Comments list */}
        {loading ? (
          <div className='text-center py-8 text-sand-500'>
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className='text-center py-8 text-sand-500 font-serif italic'>
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className='space-y-4'>
            {comments.map((comment) => (
              <div key={comment.id} className='flex gap-3'>
                <Avatar className='h-10 w-10 shrink-0'>
                  <AvatarFallback className='bg-sand-200 text-sand-700 font-medium'>
                    {getInitials(comment.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <div className='flex items-baseline gap-2 mb-1'>
                    <span className='font-medium text-sand-900'>
                      {comment.authorName}
                    </span>
                    <span className='text-xs text-sand-500'>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className='text-sand-700 whitespace-pre-wrap'>
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

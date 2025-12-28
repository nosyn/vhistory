import { Hono } from 'hono';
import { db } from '@/lib/db';
import { blogPosts, blogComments } from '@/lib/db/schema';
import { sql, eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { validator } from '../lib/validator';
import { createError } from '../lib/errors';

const blogRoutes = new Hono()
  .post(
    '/create',
    validator(
      'json',
      z.object({
        title: z.string().min(1, 'Title is required'),
        excerpt: z.string().optional(),
        content: z.string().min(1, 'Content is required'),
        wordId: z.uuid('Invalid word ID format').optional().nullable(),
        publish: z.boolean().default(false),
      })
    ),
    async (c) => {
      const { title, excerpt, content, wordId, publish } = c.req.valid('json');

      // TODO: Get authorId from auth session
      const authorId = 'temp-author-id'; // Replace with actual auth

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const [post] = await db
        .insert(blogPosts)
        .values({
          title,
          slug: `${slug}-${Date.now()}`,
          content,
          excerpt: excerpt || null,
          authorId,
          wordId: wordId || null,
          published: publish ? new Date() : null,
        })
        .returning();

      return c.json({ success: true, data: post });
    }
  )
  .get('/:slug', async (c) => {
    const slug = c.req.param('slug');

    const post = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1)
      .then((res) => res[0]);

    if (!post) {
      throw createError('NOT_FOUND', 'Blog post not found');
    }

    // Increment view count
    await db
      .update(blogPosts)
      .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
      .where(eq(blogPosts.id, post.id));

    return c.json({ success: true, data: post });
  })
  .get('/', async (c) => {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(sql`${blogPosts.published} IS NOT NULL`)
      .orderBy(desc(blogPosts.published))
      .limit(20);

    return c.json({ success: true, data: { posts } });
  })
  .get('/:slug/comments', async (c) => {
    const slug = c.req.param('slug');

    // Get blog post first
    const post = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1)
      .then((res) => res[0]);

    if (!post) {
      throw createError('NOT_FOUND', 'Blog post not found');
    }

    // Get comments for this post
    const comments = await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.blogPostId, post.id))
      .orderBy(desc(blogComments.createdAt));

    return c.json({ success: true, data: { comments } });
  })
  .post(
    '/:slug/comments',
    validator(
      'json',
      z.object({
        content: z
          .string()
          .min(1, 'Comment is required')
          .max(1000, 'Comment is too long'),
        authorId: z.string().min(1, 'Author ID is required'),
        authorName: z.string().min(1, 'Author name is required'),
      })
    ),
    async (c) => {
      const slug = c.req.param('slug');
      const { content, authorId, authorName } = c.req.valid('json');

      // Get blog post first
      const post = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .limit(1)
        .then((res) => res[0]);

      if (!post) {
        throw createError('NOT_FOUND', 'Blog post not found');
      }

      const [comment] = await db
        .insert(blogComments)
        .values({
          blogPostId: post.id,
          content,
          authorId,
          authorName,
        })
        .returning();

      return c.json({ success: true, data: comment });
    }
  );

export default blogRoutes;

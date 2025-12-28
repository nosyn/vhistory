import { Hono } from 'hono';
import { db } from '@/lib/db';
import { blogPosts, blogComments } from '@/lib/db/schema';
import { sql, eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const blogRoutes = new Hono()
  .post(
    '/create',
    zValidator(
      'json',
      z.object({
        title: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        wordId: z.uuid().optional().nullable(),
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

      try {
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

        return c.json(post);
      } catch (error) {
        return c.json({ message: 'Failed to create blog post' }, 500);
      }
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
      return c.json({ message: 'Blog post not found' }, 404);
    }

    // Increment view count
    await db
      .update(blogPosts)
      .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
      .where(eq(blogPosts.id, post.id));

    return c.json(post);
  })
  .get('/', async (c) => {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(sql`${blogPosts.published} IS NOT NULL`)
      .orderBy(desc(blogPosts.published))
      .limit(20);

    return c.json({ posts });
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
      return c.json({ message: 'Blog post not found' }, 404);
    }

    // Get comments for this post
    const comments = await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.blogPostId, post.id))
      .orderBy(desc(blogComments.createdAt));

    return c.json({ comments });
  })
  .post(
    '/:slug/comments',
    zValidator(
      'json',
      z.object({
        content: z.string().min(1).max(1000),
        authorId: z.string().min(1),
        authorName: z.string().min(1),
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
        return c.json({ message: 'Blog post not found' }, 404);
      }

      try {
        const [comment] = await db
          .insert(blogComments)
          .values({
            blogPostId: post.id,
            content,
            authorId,
            authorName,
          })
          .returning();

        return c.json(comment);
      } catch (error) {
        return c.json({ message: 'Failed to create comment' }, 500);
      }
    }
  );

export default blogRoutes;

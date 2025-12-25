import { Hono } from 'hono'
import { db } from '@/lib/db';
import { words } from '@/lib/db/schema'; // direct import
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono().basePath('/api')

const searchRoute = app.get(
  '/search',
  zValidator(
    'query',
    z.object({
      q: z.string().min(1),
    })
  ),
  async (c) => {
    const { q } = c.req.valid('query')
    
    const results = await db.select().from(words).where(
        sql`unaccent(${words.content}) ILIKE unaccent(${'%' + q + '%'})`
    ).limit(10);

    return c.json({
      results,
    })
  }
)

export type AppType = typeof searchRoute;
export default app;

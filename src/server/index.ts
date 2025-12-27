import { Hono } from 'hono';
import { db } from '@/lib/db';
import { words, regions, wordRegions } from '@/lib/db/schema';
import { sql, eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getAllWordsRegionMapData } from '@/lib/db/region-helpers';

const app = new Hono().basePath('/api');

app.get(
  '/search',
  zValidator(
    'query',
    z.object({
      q: z.string().min(1),
    })
  ),
  async (c) => {
    const { q } = c.req.valid('query');

    const results = await db
      .select()
      .from(words)
      .where(sql`unaccent(${words.content}) ILIKE unaccent(${'%' + q + '%'})`)
      .limit(10);

    return c.json({
      results,
    });
  }
);

app.get('/stats/regions', async (c) => {
  // Get aggregated word usage map data with hierarchical expansion
  const mapData = await getAllWordsRegionMapData();

  // Also get summary stats
  const totalWords = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(words)
    .then((res) => res[0]?.count || 0);

  const totalRegionsWithWords = mapData.length;

  return c.json({
    mapData,
    stats: {
      totalWords,
      totalRegionsWithWords,
    },
  });
});

export type AppType = typeof app;
export default app;

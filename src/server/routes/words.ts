import { Hono } from 'hono';
import { db } from '@/lib/db';
import { words } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { validator } from '@/server/lib/validator';
import { getAllWordsRegionMapData } from '@/lib/db/region-helpers';

const wordsRoutes = new Hono<{ Bindings: any }>()
  .get(
    '/search',
    validator(
      'query',
      z.object({
        q: z.string().min(1, 'Search query is required'),
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
        success: true,
        data: { results },
      });
    }
  )
  .get('/stats/regions', async (c) => {
    // Get aggregated word usage map data with hierarchical expansion
    const mapData = await getAllWordsRegionMapData();

    // Also get summary stats
    const totalWords = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(words)
      .then((res) => res[0]?.count || 0);

    const totalRegionsWithWords = mapData.length;

    return c.json({
      success: true,
      data: {
        mapData,
        stats: {
          totalWords,
          totalRegionsWithWords,
        },
      },
    });
  });

export default wordsRoutes;

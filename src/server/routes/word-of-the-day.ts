import { Hono } from 'hono';
import { db } from '@/lib/db';
import { wordOfTheDay, words } from '@/lib/db/schema';
import { sql, eq } from 'drizzle-orm';

const wordOfTheDayRoutes = new Hono().get('/', async (c) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let wotd = await db
    .select()
    .from(wordOfTheDay)
    .where(eq(wordOfTheDay.date, today))
    .limit(1)
    .then((res) => res[0]);

  // If no word of the day exists, create one
  if (!wotd) {
    // Get a random word
    const randomWord = await db
      .select()
      .from(words)
      .orderBy(sql`RANDOM()`)
      .limit(1)
      .then((res) => res[0]);

    if (randomWord) {
      [wotd] = await db
        .insert(wordOfTheDay)
        .values({
          wordId: randomWord.id,
          date: today,
          viewCount: 0,
        })
        .returning();
    }
  }

  if (!wotd) {
    return c.json({ message: 'No word of the day available' }, 404);
  }

  // Get the full word details
  const word = await db
    .select()
    .from(words)
    .where(eq(words.id, wotd.wordId))
    .limit(1)
    .then((res) => res[0]);

  // Increment view count
  await db
    .update(wordOfTheDay)
    .set({ viewCount: sql`${wordOfTheDay.viewCount} + 1` })
    .where(eq(wordOfTheDay.id, wotd.id));

  return c.json({ word, stats: { viewCount: wotd.viewCount } });
});

export default wordOfTheDayRoutes;

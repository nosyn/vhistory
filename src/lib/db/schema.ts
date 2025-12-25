import { pgTable, text, uuid, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const dialectEnum = pgEnum('dialect_type', ['North', 'Central', 'South']);

export const words = pgTable('words', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  definition: text('definition').notNull(),
  dialectType: dialectEnum('dialect_type').notNull(),
  regionId: text('region_id'), 
  usageExample: text('usage_example'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    unaccentIdx: index('words_content_unaccent_idx').using('gin', sql`public.immutable_unaccent(${table.content}) gin_trgm_ops`),
  };
});

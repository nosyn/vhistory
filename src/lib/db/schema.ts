import {
  pgTable,
  text,
  uuid,
  timestamp,
  pgEnum,
  index,
  integer,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// Enums
export const dialectEnum = pgEnum('dialect_type', [
  'North',
  'Central',
  'South',
]);

export const regionLevelEnum = pgEnum('region_level', [
  'broad', // E.g., Miền Bắc, Miền Trung, Miền Nam
  'subregion', // E.g., Đồng bằng sông Hồng, Tây Nguyên
  'province', // E.g., Hà Nội, TP.HCM
]);

// Countries table - for future expansion
export const countries = pgTable('countries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(), // ISO 3166-1 alpha-2 (e.g., 'VN')
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Regions table - hierarchical structure
export const regions = pgTable(
  'regions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    countryId: uuid('country_id')
      .references(() => countries.id, { onDelete: 'cascade' })
      .notNull(),
    name: text('name').notNull(), // E.g., "Miền Bắc", "Đồng bằng sông Hồng", "Hà Nội"
    code: text('code').notNull(), // E.g., "VN-01" for provinces, custom for regions
    level: regionLevelEnum('level').notNull(),
    parentRegionId: uuid('parent_region_id').references((): any => regions.id, {
      onDelete: 'set null',
    }),
    description: text('description'),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return [
      {
        countryIdx: index('regions_country_idx').on(table.countryId),
        parentIdx: index('regions_parent_idx').on(table.parentRegionId),
        codeIdx: index('regions_code_idx').on(table.code),
      },
    ];
  }
);

// Words table - updated with proper foreign keys
export const words = pgTable(
  'words',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    content: text('content').notNull(),
    definition: text('definition').notNull(),
    dialectType: dialectEnum('dialect_type').notNull(),
    regionId: uuid('region_id').references(() => regions.id, {
      onDelete: 'set null',
    }),
    pronunciation: text('pronunciation'), // IPA or Vietnamese phonetic notation
    etymology: text('etymology'), // Word origin/history
    usageExample: text('usage_example'),
    notes: text('notes'), // Additional context or cultural notes
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return [
      {
        unaccentIdx: index('words_content_unaccent_idx').using(
          'gin',
          sql`public.immutable_unaccent(${table.content}) gin_trgm_ops`
        ),
        regionIdx: index('words_region_idx').on(table.regionId),
        dialectIdx: index('words_dialect_idx').on(table.dialectType),
      },
    ];
  }
);

// Word-Regions junction table - many-to-many relationship
// Supports linking at any region level (broad, subregion, or province)
export const wordRegions = pgTable(
  'word_regions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    wordId: uuid('word_id')
      .references(() => words.id, { onDelete: 'cascade' })
      .notNull(),
    regionId: uuid('region_id')
      .references(() => regions.id, { onDelete: 'cascade' })
      .notNull(),
    usageStrength: integer('usage_strength').default(50).notNull(), // 0-100: strength of usage in this region
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return [
      {
        wordIdx: index('word_regions_word_idx').on(table.wordId),
        regionIdx: index('word_regions_region_idx').on(table.regionId),
        uniqueWordRegion: index('word_regions_unique_idx').on(
          table.wordId,
          table.regionId
        ),
      },
    ];
  }
);

// Relations
export const countriesRelations = relations(countries, ({ many }) => ({
  regions: many(regions),
}));

export const regionsRelations = relations(regions, ({ one, many }) => ({
  country: one(countries, {
    fields: [regions.countryId],
    references: [countries.id],
  }),
  parentRegion: one(regions, {
    fields: [regions.parentRegionId],
    references: [regions.id],
    relationName: 'regionHierarchy',
  }),
  childRegions: many(regions, {
    relationName: 'regionHierarchy',
  }),
  words: many(words),
  wordRegions: many(wordRegions),
}));

export const wordsRelations = relations(words, ({ one, many }) => ({
  region: one(regions, {
    fields: [words.regionId],
    references: [regions.id],
  }),
  wordRegions: many(wordRegions),
}));

export const wordRegionsRelations = relations(wordRegions, ({ one }) => ({
  word: one(words, {
    fields: [wordRegions.wordId],
    references: [words.id],
  }),
  region: one(regions, {
    fields: [wordRegions.regionId],
    references: [regions.id],
  }),
}));

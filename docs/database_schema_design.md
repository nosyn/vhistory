# Database Schema Design - Regional Flexibility

## Overview

The database schema has been redesigned to support a flexible, hierarchical region system that can accommodate multiple countries and various levels of geographic/administrative divisions.

## Schema Structure

### 1. Countries Table

```typescript
countries {
  id: uuid (primary key)
  name: text
  code: text (unique, ISO 3166-1 alpha-2, e.g., 'VN')
  createdAt: timestamp
}
```

**Purpose**: Enable future expansion to other countries beyond Vietnam.

### 2. Regions Table (Hierarchical)

```typescript
regions {
  id: uuid (primary key)
  countryId: uuid (foreign key → countries)
  name: text
  code: text (indexed)
  level: enum('broad', 'subregion', 'province')
  parentRegionId: uuid (self-referencing foreign key)
  description: text
  sortOrder: integer
  createdAt: timestamp
}
```

**Features**:

- **Hierarchical structure**: Self-referencing `parentRegionId` allows unlimited nesting
- **Three-level system for Vietnam**:
  - **Broad** (Miền): Miền Bắc, Miền Trung, Miền Nam
  - **Subregion** (Vùng): 7 economic-cultural regions (e.g., Đồng bằng sông Hồng, Tây Nguyên)
  - **Province** (Tỉnh/Thành phố): 63 provinces/cities
- **Flexible**: Can adapt to other countries with different administrative structures

### 3. Updated Words Table

```typescript
words {
  id: uuid (primary key)
  content: text (indexed with unaccent + trigram)
  definition: text
  dialectType: enum('North', 'Central', 'South') // Linguistic classification
  regionId: uuid (foreign key → regions, nullable)
  pronunciation: text // IPA or phonetic notation
  etymology: text // Word origin/history
  usageExample: text
  notes: text // Cultural context
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Key Design Decisions**:

1. **Dialect vs Region**: Kept as separate concepts
   - `dialectType`: Linguistic classification (how it's pronounced/used)
   - `regionId`: Geographic origin (where it's commonly used)
2. **Enhanced fields**: Added pronunciation, etymology, notes, updatedAt
3. **Foreign key relationship**: Links to regions table for structured data

## Vietnam Region Hierarchy

```
Vietnam (country)
├─ Miền Bắc (broad region)
│  ├─ Trung du và miền núi phía Bắc (subregion)
│  │  ├─ Hà Giang (province)
│  │  ├─ Cao Bằng (province)
│  │  └─ ... (14 provinces total)
│  └─ Đồng bằng sông Hồng (subregion)
│     ├─ Hà Nội (province)
│     ├─ Hải Phòng (province)
│     └─ ... (11 provinces total)
│
├─ Miền Trung (broad region)
│  ├─ Bắc Trung Bộ (subregion - 6 provinces)
│  ├─ Duyên hải Nam Trung Bộ (subregion - 8 provinces)
│  └─ Tây Nguyên (subregion - 5 provinces)
│
└─ Miền Nam (broad region)
   ├─ Đông Nam Bộ (subregion - 6 provinces)
   └─ Đồng bằng sông Cửu Long (subregion - 13 provinces)
```

## Benefits of This Design

### 1. **Future-Proof**

- Easy to add new countries (Thailand, Laos, Cambodia, etc.)
- Each country can have its own regional structure
- No need to change schema when expanding

### 2. **Flexible Hierarchy**

- Vietnam: 3 levels (broad → subregion → province)
- Other countries: Can use different levels (e.g., state → county → city)
- Can add more levels without schema changes

### 3. **Query Efficiency**

- Indexed foreign keys for fast joins
- Self-referencing structure allows recursive queries
- Can query words by any level (broad region, subregion, or province)

### 4. **Data Integrity**

- Foreign key constraints maintain referential integrity
- Cascade delete on countries removes all associated regions
- Set null on region delete keeps words but removes association

## Example Queries

### Get all words from Miền Bắc (including all subregions/provinces)

```typescript
// 1. Get Miền Bắc region
const mienBac = await db
  .select()
  .from(regions)
  .where(eq(regions.name, 'Miền Bắc'));

// 2. Get all descendant regions
const descendants = await db
  .select()
  .from(regions)
  .where(
    or(eq(regions.parentRegionId, mienBac.id), eq(regions.id, mienBac.id))
  );

// 3. Get all words from these regions
const words = await db
  .select()
  .from(words)
  .where(
    inArray(
      words.regionId,
      descendants.map((r) => r.id)
    )
  );
```

### Get regional word count for map visualization

```typescript
const wordCounts = await db
  .select({
    regionId: words.regionId,
    regionCode: regions.code,
    count: sql<number>`count(*)::int`,
  })
  .from(words)
  .innerJoin(regions, eq(words.regionId, regions.id))
  .where(eq(regions.level, 'province'))
  .groupBy(words.regionId, regions.code);

// Transform to choropleth format: [{ id: 'VN-01', value: 150 }, ...]
const mapData = wordCounts.map((r) => ({ id: r.regionCode, value: r.count }));
```

## Migration Notes

1. **Old data**: Existing `region_id` text values were set to NULL during migration
2. **Type conversion**: Added safe casting from text to UUID
3. **Indexes**: All important foreign keys are indexed for performance
4. **Seeded data**: 62 regions created (3 broad + 7 subregions + 52 provinces)

## Next Steps

1. **Update word creation forms** to use region selector (dropdown with hierarchy)
2. **Add region statistics** to dashboard
3. **Implement map interactivity** - click province to filter words
4. **Add region-based search filters**
5. **Consider adding** user-contributed etymologies and regional variations

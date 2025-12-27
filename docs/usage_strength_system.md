# Usage Strength System

## Overview

The VHistory application uses a **usage strength** value (0-100 scale) to represent how commonly a word is used in different regions. This creates rich, nuanced visualizations on the map instead of simple binary "used/not used" indicators.

## Database Schema

### `word_regions` Junction Table

```sql
CREATE TABLE word_regions (
  id uuid PRIMARY KEY,
  word_id uuid REFERENCES words(id) ON DELETE CASCADE,
  region_id uuid REFERENCES regions(id) ON DELETE CASCADE,
  usage_strength integer DEFAULT 50 NOT NULL, -- 0-100 scale
  created_at timestamp DEFAULT now()
);
```

### Usage Strength Scale

- **0-30**: Rare or historical usage
- **31-50**: Occasional usage
- **51-70**: Moderate usage
- **71-85**: Strong usage
- **86-95**: Very strong usage
- **96-100**: Exclusive or defining characteristic

## Hierarchical Region Support

### Problem Solved

Instead of creating 64 entries for a nationally-used word, you can link it at higher levels:

- **Province level**: Specific to one province (e.g., "Huế" → Thừa Thiên Huế)
- **Subregion level**: Used across a subregion (e.g., "Central Highlands dialect")
- **Broad region level**: Used across entire region (e.g., "Northern dialect word")

### How It Works

The `region-helpers.ts` module provides functions that:

1. **Expand hierarchical regions**: If a word is linked to "Miền Bắc" (broad), it automatically highlights all provinces under that region
2. **Maintain performance**: Database queries remain efficient with proper indexing
3. **Aggregate intelligently**: When multiple words map to same province, uses MAX usage strength for visualization

### Example

```typescript
// Link "nhà" to broad "Miền Bắc" region with strength 60
await db.insert(wordRegions).values({
  wordId: nhaWordId,
  regionId: mienBacRegionId, // broad region
  usageStrength: 60,
});

// The map will automatically show ALL Northern provinces highlighted
```

## Map Visualization

### Color Scheme

The map uses a **7-shade terracotta gradient** based on usage strength:

- **Lightest** (#fbb3a8): Lower usage strength (0-20)
- **Light** (#f08f7b): Low-moderate (20-40)
- **Medium** (#e06b4f): Moderate (40-60)
- **Terracotta-600** (#c14d36): Strong (60-75) — Main brand color
- **Darker** (#a03d2a): Very strong (75-85)
- **Terracotta-800** (#853528): Near-exclusive (85-95)
- **Darkest** (#6e2a21): Exclusive (95-100)

### Unknown Provinces

Provinces with no word data appear in very light sand (#faf8f6) with sand-colored borders.

## API Response Format

### `/api/stats/regions`

Returns map data with usage strengths:

```json
{
  "mapData": [
    { "id": "VN-26", "value": 95 },  // Thừa Thiên Huế: 95% strength
    { "id": "VN-22", "value": 85 },  // Nghệ An: 85% strength
    ...
  ],
  "stats": {
    "totalWords": 5,
    "totalRegionsWithWords": 8
  }
}
```

## Current Seed Data Examples

### "tê" - Strong Central usage

- Thừa Thiên Huế: **95%** (very strong)
- Nghệ An: **85%** (strong)
- Hà Tĩnh: **85%** (strong)
- Quảng Bình: **80%** (strong)
- Quảng Trị: **80%** (strong)

### "mô" - Moderate Central usage

- Thừa Thiên Huế: **90%** (very strong)
- Quảng Bình: **75%** (moderate-strong)
- Quảng Trị: **75%** (moderate-strong)

### "nhà" - Moderate Northern usage

- Hà Nội: **60%** (moderate, common word)
- Hải Phòng: **60%** (moderate)

### "xài" - Strong Southern usage

- TP. Hồ Chí Minh: **95%** (very strong)

### "Huế" - Exclusive place name

- Thừa Thiên Huế: **100%** (exclusive)

## User Voting System (Future)

The `usage_strength` field can be updated over time based on user votes:

```typescript
// Future implementation example
async function updateUsageStrength(wordId: string, regionId: string) {
  // Aggregate user votes
  const votes = await getVotesForWordRegion(wordId, regionId);
  const newStrength = calculateStrength(votes);

  await db
    .update(wordRegions)
    .set({ usageStrength: newStrength })
    .where(
      and(eq(wordRegions.wordId, wordId), eq(wordRegions.regionId, regionId))
    );
}
```

## Map Components

### Homepage Map

- Shows aggregate usage across all words
- Domain: 0-100 (usage strength percentage)
- Legend: **Enabled** (shows strength scale)
- Tooltip: "Usage Strength: X%"

### Word Detail Page Map

- Shows specific word's regional usage
- Domain: 0-100 (usage strength percentage)
- Legend: **Enabled** (shows strength scale)
- Tooltip: "Usage Strength: X%"

Both maps now have **consistent** legends and color scales.

## Benefits

1. **Nuanced visualization**: See gradients of usage instead of binary on/off
2. **Performance**: Link at appropriate hierarchy level (broad/subregion/province)
3. **Scalability**: Easy to expand to more countries
4. **User engagement**: Future voting system can gradually refine strengths
5. **Data richness**: Preserves linguistic nuance (strong vs. occasional usage)

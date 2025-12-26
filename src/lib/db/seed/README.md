# Database Seeding

This folder contains all database seeding scripts for the vHistory project.

## Structure

```
seed/
├── index.ts           # Main entry point - runs all seeds in order
├── seed-regions.ts    # Seeds Vietnam regions hierarchy
└── seed.ts            # Seeds sample words data
```

## Usage

### Seed everything (recommended)

```bash
bun db:seed
```

This will:

1. Seed countries and regions (Vietnam with 62 regions)
2. Seed sample words

### Individual seed functions

You can also import and use individual seed functions in your code:

```typescript
import { seedVietnamRegions } from './seed/seed-regions';
import { seedWords } from './seed/seed';

// Seed only regions
await seedVietnamRegions();

// Seed only words
await seedWords();
```

## What gets seeded

### Regions (seed-regions.ts)

- 1 country: Vietnam (VN)
- 3 broad regions: Miền Bắc, Miền Trung, Miền Nam
- 7 subregions: Economic-cultural regions
- 52 provinces: All Vietnamese provinces/cities

### Words (seed.ts)

- 3 sample words with Central dialect
- Includes: Huế, mô, tê

## Clearing data before seeding

If you need to reseed from scratch:

```bash
# Clear all data (careful!)
docker exec -i vhistory-db-1 psql -U postgres -d vhistory -c "TRUNCATE countries, regions, words CASCADE;"

# Then reseed
bun db:seed
```

## Adding new seed data

To add new seed data:

1. Create a new function in an existing seed file or create a new seed file
2. Export the function
3. Import and call it in `index.ts` in the desired order
4. Document it in this README

Example:

```typescript
// seed/seed-categories.ts
export async function seedCategories() {
  console.log('🌱 Seeding categories...');
  // Your seeding logic here
  console.log('✅ Seeded categories');
}

// seed/index.ts
import { seedCategories } from './seed-categories';

async function main() {
  await seedVietnamRegions();
  await seedWords();
  await seedCategories(); // Add your new seed
}
```

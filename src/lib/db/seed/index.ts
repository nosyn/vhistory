import { seedVietnamRegions } from './seed-regions';
import { seedWords } from './seed';

async function main() {
  console.log('🚀 Starting database seeding...\n');

  try {
    // 1. Seed regions first (countries, regions hierarchy)
    await seedVietnamRegions();
    console.log('');

    // 2. Seed sample words with region mappings
    await seedWords();
    console.log('');

    console.log('🎉 All seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export default main;

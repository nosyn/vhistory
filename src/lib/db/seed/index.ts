import { db } from '../index';
import { words } from '../schema';
import { seedVietnamRegions } from './seed-regions';

export async function seedWords() {
  console.log('🌱 Seeding sample words...');

  await db.insert(words).values([
    {
      content: 'Huế',
      definition: 'A city in Central Vietnam, famous for its citadel.',
      dialectType: 'Central',
      usageExample: 'Đi mô rứa? Về Huế thăm mạ.',
    },
    {
      content: 'mô',
      definition: 'Where (Central dialect)',
      dialectType: 'Central',
      usageExample: 'Em đi mô đó?',
    },
    {
      content: 'tê',
      definition: 'That/There (Central dialect)',
      dialectType: 'Central',
      usageExample: 'Đứng bên tê đường.',
    },
  ]);

  console.log('✅ Seeded sample words');
}

async function main() {
  console.log('🚀 Starting database seeding...\n');

  try {
    // 1. Seed regions first (countries, regions hierarchy)
    await seedVietnamRegions();
    console.log('');

    // 2. Seed sample words
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

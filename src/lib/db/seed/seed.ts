import { db } from '../index';
import { words } from '../schema';

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

import { db } from '../index';
import { words, wordRegions, regions } from '../schema';
import { eq } from 'drizzle-orm';

export async function seedWords() {
  console.log('🌱 Seeding sample words...');

  // Insert words first
  const insertedWords = await db
    .insert(words)
    .values([
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
        pronunciation: 'te',
        notes:
          'Commonly used in Central Vietnam, especially in Huế, Nghệ An, Hà Tĩnh',
      },
      {
        content: 'nhà',
        definition: 'House/Home',
        dialectType: 'North',
        usageExample: 'Tôi về nhà.',
      },
      {
        content: 'xài',
        definition: 'To use (Southern dialect)',
        dialectType: 'South',
        usageExample: 'Tôi xài cái này.',
      },
    ])
    .returning();

  console.log(`✅ Seeded ${insertedWords.length} words`);

  // Now link words to regions
  console.log('🔗 Linking words to regions...');

  // Get region IDs
  const regionMap = new Map<string, string>();

  const regionsList = await db
    .select()
    .from(regions)
    .where(eq(regions.level, 'province'));

  for (const region of regionsList) {
    regionMap.set(region.code, region.id);
  }

  // Find word IDs
  const wordMap = new Map<string, string>();
  for (const word of insertedWords) {
    wordMap.set(word.content, word.id);
  }

  // Link "tê" to multiple Central provinces with varying usage strengths
  const teWordId = wordMap.get('tê');
  if (teWordId) {
    const teRegions = [
      { code: 'VN-26', strength: 95 }, // Thừa Thiên Huế - very strong usage
      { code: 'VN-22', strength: 85 }, // Nghệ An - strong usage
      { code: 'VN-23', strength: 85 }, // Hà Tĩnh - strong usage
      { code: 'VN-24', strength: 80 }, // Quảng Bình - strong usage
      { code: 'VN-25', strength: 80 }, // Quảng Trị - strong usage
    ];

    const teLinks = teRegions
      .map(({ code, strength }) => {
        const regionId = regionMap.get(code);
        return regionId
          ? { wordId: teWordId, regionId, usageStrength: strength }
          : null;
      })
      .filter(Boolean);

    if (teLinks.length > 0) {
      await db.insert(wordRegions).values(teLinks as any);
      console.log(
        `✅ Linked "tê" to ${teLinks.length} regions with usage strengths`
      );
    }
  }

  // Link "mô" to Central provinces
  const moWordId = wordMap.get('mô');
  if (moWordId) {
    const moRegions = [
      { code: 'VN-26', strength: 90 }, // Thừa Thiên Huế - very strong
      { code: 'VN-24', strength: 75 }, // Quảng Bình - moderate-strong
      { code: 'VN-25', strength: 75 }, // Quảng Trị - moderate-strong
    ];

    const moLinks = moRegions
      .map(({ code, strength }) => {
        const regionId = regionMap.get(code);
        return regionId
          ? { wordId: moWordId, regionId, usageStrength: strength }
          : null;
      })
      .filter(Boolean);

    if (moLinks.length > 0) {
      await db.insert(wordRegions).values(moLinks as any);
      console.log(
        `✅ Linked "mô" to ${moLinks.length} regions with usage strengths`
      );
    }
  }

  // Link "Huế" to Thừa Thiên Huế
  const hueWordId = wordMap.get('Huế');
  const hueRegionId = regionMap.get('VN-26');
  if (hueWordId && hueRegionId) {
    await db
      .insert(wordRegions)
      .values([
        { wordId: hueWordId, regionId: hueRegionId, usageStrength: 100 },
      ]);
    console.log(`✅ Linked "Huế" to Thừa Thiên Huế`);
  }

  // Link "nhà" to Northern provinces
  const nhaWordId = wordMap.get('nhà');
  if (nhaWordId) {
    const nhaRegions = [
      { code: 'VN-HN', strength: 60 }, // Hà Nội - moderate (common word)
      { code: 'VN-HP', strength: 60 }, // Hải Phòng - moderate
      { code: 'VN-01', strength: 55 }, // Hà Giang - moderate
    ];

    const nhaLinks = nhaRegions
      .map(({ code, strength }) => {
        const regionId = regionMap.get(code);
        return regionId
          ? { wordId: nhaWordId, regionId, usageStrength: strength }
          : null;
      })
      .filter(Boolean);

    if (nhaLinks.length > 0) {
      await db.insert(wordRegions).values(nhaLinks as any);
      console.log(
        `✅ Linked "nhà" to ${nhaLinks.length} regions with usage strengths`
      );
    }
  }

  // Link "xài" to Southern provinces
  const xaiWordId = wordMap.get('xài');
  if (xaiWordId) {
    const xaiRegions = [
      { code: 'VN-SG', strength: 95 }, // TP. Hồ Chí Minh - very strong
      { code: 'VN-BD', strength: 85 }, // Bình Dương - strong
      { code: 'VN-DNA', strength: 70 }, // Đà Nẵng - moderate
    ];

    const xaiLinks = xaiRegions
      .map(({ code, strength }) => {
        const regionId = regionMap.get(code);
        return regionId
          ? { wordId: xaiWordId, regionId, usageStrength: strength }
          : null;
      })
      .filter(Boolean);

    if (xaiLinks.length > 0) {
      await db.insert(wordRegions).values(xaiLinks as any);
      console.log(
        `✅ Linked "xài" to ${xaiLinks.length} regions with usage strengths`
      );
    }
  }

  console.log('✅ Finished linking words to regions');
}

import { db } from './index';
import { regions, wordRegions } from './schema';
import { eq, inArray, sql } from 'drizzle-orm';

/**
 * Expands a region to all its child provinces recursively.
 * If the region is already a province, returns just that region.
 * If it's a broad region or subregion, returns all descendant provinces.
 */
export async function expandRegionToProvinces(
  regionId: string
): Promise<string[]> {
  // Get the region
  const region = await db
    .select()
    .from(regions)
    .where(eq(regions.id, regionId))
    .limit(1)
    .then((res) => res[0]);

  if (!region) return [];

  // If it's already a province, return it
  if (region.level === 'province') {
    return [region.code];
  }

  // Otherwise, get all descendant provinces
  const provinces = await db
    .select({ code: regions.code })
    .from(regions)
    .where(
      sql`${regions.level} = 'province' AND (
        ${regions.parentRegionId} = ${regionId} OR 
        ${regions.parentRegionId} IN (
          SELECT id FROM ${regions} WHERE ${regions.parentRegionId} = ${regionId}
        )
      )`
    );

  return provinces.map((p) => p.code);
}

/**
 * Gets map data for a specific word, expanding hierarchical regions to provinces.
 * Returns array of { id: provinceCode, value: usageStrength }
 */
export async function getWordRegionMapData(
  wordId: string
): Promise<Array<{ id: string; value: number }>> {
  // Get all regions linked to this word
  const wordRegionLinks = await db
    .select({
      regionId: wordRegions.regionId,
      usageStrength: wordRegions.usageStrength,
      regionLevel: regions.level,
      regionCode: regions.code,
    })
    .from(wordRegions)
    .leftJoin(regions, eq(wordRegions.regionId, regions.id))
    .where(eq(wordRegions.wordId, wordId));

  const mapData: Array<{ id: string; value: number }> = [];

  for (const link of wordRegionLinks) {
    if (!link.regionId || !link.regionLevel || !link.regionCode) continue;

    const strength = link.usageStrength || 50;

    if (link.regionLevel === 'province') {
      // Direct province mapping
      mapData.push({ id: link.regionCode, value: strength });
    } else {
      // Expand to child provinces
      const provinceCodes = await expandRegionToProvinces(link.regionId);
      for (const code of provinceCodes) {
        mapData.push({ id: code, value: strength });
      }
    }
  }

  return mapData;
}

/**
 * Gets aggregated map data for all words, showing usage strength per province.
 * For provinces with multiple words, uses the maximum usage strength.
 */
export async function getAllWordsRegionMapData(): Promise<
  Array<{ id: string; value: number }>
> {
  // Get all word-region links
  const allLinks = await db
    .select({
      regionId: wordRegions.regionId,
      usageStrength: wordRegions.usageStrength,
      regionLevel: regions.level,
      regionCode: regions.code,
    })
    .from(wordRegions)
    .leftJoin(regions, eq(wordRegions.regionId, regions.id));

  const provinceStrengths = new Map<string, number>();

  for (const link of allLinks) {
    if (!link.regionId || !link.regionLevel || !link.regionCode) continue;

    const strength = link.usageStrength || 50;

    if (link.regionLevel === 'province') {
      // Update with max strength
      const current = provinceStrengths.get(link.regionCode) || 0;
      provinceStrengths.set(link.regionCode, Math.max(current, strength));
    } else {
      // Expand to child provinces
      const provinceCodes = await expandRegionToProvinces(link.regionId);
      for (const code of provinceCodes) {
        const current = provinceStrengths.get(code) || 0;
        provinceStrengths.set(code, Math.max(current, strength));
      }
    }
  }

  return Array.from(provinceStrengths.entries()).map(([id, value]) => ({
    id,
    value,
  }));
}

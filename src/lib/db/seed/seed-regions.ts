import { db } from '../index';
import { countries, regions } from '../schema';
import { eq } from 'drizzle-orm';

export async function seedVietnamRegions() {
  console.log('🌱 Seeding Vietnam regions...');

  // 1. Get or create Vietnam country
  let vietnam = await db
    .select()
    .from(countries)
    .where(eq(countries.code, 'VN'))
    .limit(1)
    .then((res) => res[0]);

  if (!vietnam) {
    [vietnam] = await db
      .insert(countries)
      .values({
        name: 'Vietnam',
        code: 'VN',
      })
      .returning();
    console.log('✅ Created country:', vietnam.name);
  } else {
    console.log('✅ Country already exists:', vietnam.name);
  }

  // 2. Create broad regions (Miền)
  const [mienBac] = await db
    .insert(regions)
    .values({
      countryId: vietnam.id,
      name: 'Miền Bắc',
      code: 'VN-NORTH',
      level: 'broad',
      sortOrder: 1,
      description:
        'Northern Vietnam - includes Red River Delta and Northern Mountains',
    })
    .returning();

  const [mienTrung] = await db
    .insert(regions)
    .values({
      countryId: vietnam.id,
      name: 'Miền Trung',
      code: 'VN-CENTRAL',
      level: 'broad',
      sortOrder: 2,
      description:
        'Central Vietnam - includes North Central Coast, South Central Coast, and Central Highlands',
    })
    .returning();

  const [mienNam] = await db
    .insert(regions)
    .values({
      countryId: vietnam.id,
      name: 'Miền Nam',
      code: 'VN-SOUTH',
      level: 'broad',
      sortOrder: 3,
      description: 'Southern Vietnam - includes Southeast and Mekong Delta',
    })
    .returning();

  console.log('✅ Created 3 broad regions');

  // 3. Create subregions with parent references
  const subregionsData = [
    // Miền Bắc subregions
    {
      countryId: vietnam.id,
      parentRegionId: mienBac.id,
      name: 'Trung du và miền núi phía Bắc',
      code: 'VN-REG-1',
      level: 'subregion' as const,
      sortOrder: 1,
      description:
        '14 provinces - mountainous, ethnic minorities, cool climate',
    },
    {
      countryId: vietnam.id,
      parentRegionId: mienBac.id,
      name: 'Đồng bằng sông Hồng',
      code: 'VN-REG-2',
      level: 'subregion' as const,
      sortOrder: 2,
      description: '11 provinces - political, economic, and cultural center',
    },

    // Miền Trung subregions
    {
      countryId: vietnam.id,
      parentRegionId: mienTrung.id,
      name: 'Bắc Trung Bộ',
      code: 'VN-REG-3',
      level: 'subregion' as const,
      sortOrder: 3,
      description: '6 provinces - narrow terrain, prone to natural disasters',
    },
    {
      countryId: vietnam.id,
      parentRegionId: mienTrung.id,
      name: 'Duyên hải Nam Trung Bộ',
      code: 'VN-REG-4',
      level: 'subregion' as const,
      sortOrder: 4,
      description: '8 provinces - strong in maritime, tourism, seaports',
    },
    {
      countryId: vietnam.id,
      parentRegionId: mienTrung.id,
      name: 'Tây Nguyên',
      code: 'VN-REG-5',
      level: 'subregion' as const,
      sortOrder: 5,
      description: '5 provinces - highlands, coffee, rubber, gong culture',
    },

    // Miền Nam subregions
    {
      countryId: vietnam.id,
      parentRegionId: mienNam.id,
      name: 'Đông Nam Bộ',
      code: 'VN-REG-6',
      level: 'subregion' as const,
      sortOrder: 6,
      description: '6 provinces - most developed economic region',
    },
    {
      countryId: vietnam.id,
      parentRegionId: mienNam.id,
      name: 'Đồng bằng sông Cửu Long',
      code: 'VN-REG-7',
      level: 'subregion' as const,
      sortOrder: 7,
      description: '13 provinces - largest rice and aquaculture production',
    },
  ];

  const subregions = await db
    .insert(regions)
    .values(subregionsData)
    .returning();
  console.log('✅ Created 7 subregions');

  // 4. Create province-level regions (sample - you can add all 63 provinces)
  const provincesData = [
    // Trung du và miền núi phía Bắc
    { name: 'Hà Giang', code: 'VN-03', parentId: subregions[0].id },
    { name: 'Cao Bằng', code: 'VN-04', parentId: subregions[0].id },
    { name: 'Lào Cai', code: 'VN-02', parentId: subregions[0].id },
    { name: 'Điện Biên', code: 'VN-71', parentId: subregions[0].id },
    { name: 'Sơn La', code: 'VN-05', parentId: subregions[0].id },
    { name: 'Hòa Bình', code: 'VN-14', parentId: subregions[0].id },

    // Đồng bằng sông Hồng
    { name: 'Hà Nội', code: 'VN-HN', parentId: subregions[1].id },
    { name: 'Hải Phòng', code: 'VN-HP', parentId: subregions[1].id },
    { name: 'Vĩnh Phúc', code: 'VN-70', parentId: subregions[1].id },
    { name: 'Bắc Ninh', code: 'VN-56', parentId: subregions[1].id },
    { name: 'Hải Dương', code: 'VN-61', parentId: subregions[1].id },
    { name: 'Thái Bình', code: 'VN-20', parentId: subregions[1].id },
    { name: 'Nam Định', code: 'VN-67', parentId: subregions[1].id },
    { name: 'Ninh Bình', code: 'VN-18', parentId: subregions[1].id },

    // Bắc Trung Bộ
    { name: 'Thanh Hóa', code: 'VN-21', parentId: subregions[2].id },
    { name: 'Nghệ An', code: 'VN-22', parentId: subregions[2].id },
    { name: 'Hà Tĩnh', code: 'VN-23', parentId: subregions[2].id },
    { name: 'Quảng Bình', code: 'VN-24', parentId: subregions[2].id },
    { name: 'Quảng Trị', code: 'VN-25', parentId: subregions[2].id },
    { name: 'Thừa Thiên Huế', code: 'VN-26', parentId: subregions[2].id },

    // Duyên hải Nam Trung Bộ
    { name: 'Đà Nẵng', code: 'VN-DN', parentId: subregions[3].id },
    { name: 'Quảng Nam', code: 'VN-27', parentId: subregions[3].id },
    { name: 'Quảng Ngãi', code: 'VN-29', parentId: subregions[3].id },
    { name: 'Bình Định', code: 'VN-31', parentId: subregions[3].id },
    { name: 'Phú Yên', code: 'VN-32', parentId: subregions[3].id },
    { name: 'Khánh Hòa', code: 'VN-34', parentId: subregions[3].id },
    { name: 'Ninh Thuận', code: 'VN-36', parentId: subregions[3].id },
    { name: 'Bình Thuận', code: 'VN-40', parentId: subregions[3].id },

    // Tây Nguyên
    { name: 'Kon Tum', code: 'VN-28', parentId: subregions[4].id },
    { name: 'Gia Lai', code: 'VN-30', parentId: subregions[4].id },
    { name: 'Đắk Lắk', code: 'VN-33', parentId: subregions[4].id },
    { name: 'Đắk Nông', code: 'VN-72', parentId: subregions[4].id },
    { name: 'Lâm Đồng', code: 'VN-35', parentId: subregions[4].id },

    // Đông Nam Bộ
    { name: 'TP. Hồ Chí Minh', code: 'VN-SG', parentId: subregions[5].id },
    { name: 'Bình Dương', code: 'VN-57', parentId: subregions[5].id },
    { name: 'Bình Phước', code: 'VN-58', parentId: subregions[5].id },
    { name: 'Đồng Nai', code: 'VN-39', parentId: subregions[5].id },
    { name: 'Tây Ninh', code: 'VN-37', parentId: subregions[5].id },
    { name: 'Bà Rịa - Vũng Tàu', code: 'VN-43', parentId: subregions[5].id },

    // Đồng bằng sông Cửu Long
    { name: 'Cần Thơ', code: 'VN-CT', parentId: subregions[6].id },
    { name: 'Long An', code: 'VN-41', parentId: subregions[6].id },
    { name: 'Tiền Giang', code: 'VN-46', parentId: subregions[6].id },
    { name: 'Bến Tre', code: 'VN-50', parentId: subregions[6].id },
    { name: 'Trà Vinh', code: 'VN-51', parentId: subregions[6].id },
    { name: 'Vĩnh Long', code: 'VN-49', parentId: subregions[6].id },
    { name: 'Đồng Tháp', code: 'VN-45', parentId: subregions[6].id },
    { name: 'An Giang', code: 'VN-44', parentId: subregions[6].id },
    { name: 'Kiên Giang', code: 'VN-47', parentId: subregions[6].id },
    { name: 'Hậu Giang', code: 'VN-73', parentId: subregions[6].id },
    { name: 'Sóc Trăng', code: 'VN-52', parentId: subregions[6].id },
    { name: 'Bạc Liêu', code: 'VN-55', parentId: subregions[6].id },
    { name: 'Cà Mau', code: 'VN-59', parentId: subregions[6].id },
  ];

  const provinces = await db
    .insert(regions)
    .values(
      provincesData.map((p) => ({
        countryId: vietnam.id,
        parentRegionId: p.parentId,
        name: p.name,
        code: p.code,
        level: 'province' as const,
        sortOrder: 0,
      }))
    )
    .returning();

  console.log(`✅ Created ${provinces.length} provinces`);
  console.log('🎉 Vietnam regions seeding completed!');

  return {
    vietnam,
    broadRegions: { mienBac, mienTrung, mienNam },
    subregions,
    provinces,
  };
}

// Run if executed directly
if (require.main === module) {
  seedVietnamRegions()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

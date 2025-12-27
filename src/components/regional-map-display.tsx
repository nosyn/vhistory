'use client';

import dynamic from 'next/dynamic';

// Dynamic import for map (client-side only)
const VietnamRegionalMap = dynamic(
  () => import('@/components/maps/vietnam-regional-map'),
  { ssr: false }
);

interface RegionalMapDisplayProps {
  mapData: Array<{ id: string; value: number }>;
}

export function RegionalMapDisplay({ mapData }: RegionalMapDisplayProps) {
  return (
    <VietnamRegionalMap
      height={500}
      data={mapData}
      domain={[0, 100]}
      colors='oranges'
      showLegend={true}
    />
  );
}

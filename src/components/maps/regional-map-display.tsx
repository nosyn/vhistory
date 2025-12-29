'use client';

import dynamic from 'next/dynamic';

// Dynamic import for regional map (client-side only)
const RegionalMap = dynamic(() => import('@/components/maps/regional-map'), {
  ssr: false,
  loading: () => (
    <div
      className='flex items-center justify-center bg-sand-50 rounded-lg border border-sand-200'
      style={{ height: 500, width: '100%' }}
    >
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-500 mx-auto mb-4' />
        <p className='text-sand-600'>Loading Vietnam map...</p>
      </div>
    </div>
  ),
});

interface Province {
  type: 'Feature';
  id: number;
  properties: {
    id: string;
    name: string;
    source: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

interface RegionalMapDisplayProps {
  /**
   * Map data with region IDs and values
   */
  mapData: Array<{ id: string; value: number }>;
  /**
   * Optional callback when a province is clicked
   */
  onProvinceClick?: (province: Province) => void;
  /**
   * Custom height (responsive width)
   */
  height?: number;
  /**
   * Domain for color scale [min, max]
   */
  domain?: [number, number];
  /**
   * Color scheme for the choropleth
   */
  colors?: string;
  /**
   * Show legend
   */
  showLegend?: boolean;
}

export function RegionalMapDisplay({
  mapData,
  onProvinceClick,
  height = 500,
  domain = [0, 100],
  colors = 'oranges',
  showLegend = true,
}: RegionalMapDisplayProps) {
  return (
    <RegionalMap
      geoJsonPath='/vn.json'
      data={mapData}
      onFeatureClick={onProvinceClick}
      height={height}
      domain={domain}
      colors={colors}
      showLegend={showLegend}
      projection={{
        type: 'mercator',
        scale: 1400,
        translation: [0.5, 0.5],
        rotation: [-106, -16, 0],
      }}
      featureLabelPath='properties.name'
      tooltipContent={(feature, dataPoint) => {
        const featureName = (feature as any).properties?.name;
        return (
          <div className='bg-white px-4 py-3 rounded-lg shadow-lg border border-sand-200 w-48'>
            <div className='font-serif font-bold text-terracotta-800 mb-1'>
              {featureName}
            </div>
            {dataPoint ? (
              <div className='text-sm text-sand-600'>
                Usage Strength:{' '}
                <span className='font-medium text-terracotta-600'>
                  {dataPoint.value}%
                </span>
              </div>
            ) : (
              <div className='text-xs text-sand-400 italic'>
                No words recorded yet
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

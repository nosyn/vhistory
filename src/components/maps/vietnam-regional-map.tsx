'use client';

import { useEffect, useState } from 'react';
import { ResponsiveChoropleth } from '@nivo/geo';

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

interface VietnamGeoJSON {
  type: 'FeatureCollection';
  features: Province[];
}

interface VietnamRegionalMapProps {
  /**
   * Optional callback when a province is clicked
   */
  onProvinceClick?: (province: Province) => void;
  /**
   * Optional array of province data with values for choropleth coloring
   * Format: [{ id: 'VN-01', value: 50 }, ...]
   * Value represents usage strength (0-100)
   */
  data?: Array<{ id: string; value: number }>;
  /**
   * Domain for color scale [min, max]
   * Default: [0, 100] for usage strength
   */
  domain?: [number, number];
  /**
   * Color scheme for the choropleth
   * Options: 'nivo', 'blues', 'greens', 'reds', 'oranges', 'BuPu', etc.
   */
  colors?: string;
  /**
   * Show legend
   */
  showLegend?: boolean;
  /**
   * Custom height (will be responsive width)
   */
  height?: number;
}

export default function VietnamRegionalMap({
  onProvinceClick,
  data = [],
  domain = [0, 100],
  colors = 'BuPu',
  showLegend = true,
  height = 600,
}: VietnamRegionalMapProps) {
  const [geoData, setGeoData] = useState<VietnamGeoJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load GeoJSON data
  useEffect(() => {
    fetch('/vn.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load Vietnam map data');
        }
        return response.json();
      })
      .then((data: VietnamGeoJSON) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        className='flex items-center justify-center bg-sand-50 rounded-lg border border-sand-200'
        style={{ height, width: '100%' }}
      >
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-500 mx-auto mb-4' />
          <p className='text-sand-600'>Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className='flex items-center justify-center bg-red-50 rounded-lg border border-red-200'
        style={{ height, width: '100%' }}
      >
        <div className='text-center text-red-600'>
          <p className='font-semibold mb-2'>Failed to load map</p>
          <p className='text-sm'>{error}</p>
        </div>
      </div>
    );
  }

  if (!geoData) return null;

  // Custom terracotta color scheme for better theme integration
  const terracottaColors =
    colors === 'oranges'
      ? [
          '#fbb3a8', // lightest highlight
          '#f08f7b', // light
          '#e06b4f', // medium
          '#c14d36', // terracotta-600 (main brand color)
          '#a03d2a', // darker
          '#853528', // terracotta-800
          '#6e2a21', // darkest
        ]
      : colors;
  return (
    <div
      style={{ height, width: '100%' }}
      className='bg-white rounded-lg border border-sand-200'
    >
      <ResponsiveChoropleth
        data={data}
        features={geoData.features}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        colors={terracottaColors}
        domain={domain}
        unknownColor='#faf8f6'
        label='properties.name'
        valueFormat='.2s'
        projectionType='mercator'
        projectionScale={1400}
        projectionTranslation={[0.5, 0.5]}
        projectionRotation={[-106, -16, 0]}
        enableGraticule={false}
        graticuleLineColor='#ded7d0'
        borderWidth={1.5}
        borderColor='#e5dfd8'
        onClick={(feature) => {
          if (onProvinceClick && feature.data) {
            onProvinceClick(feature.data as Province);
          }
        }}
        legends={
          showLegend
            ? [
                {
                  anchor: 'bottom-left',
                  direction: 'column',
                  justify: true,
                  translateX: 20,
                  translateY: -40,
                  itemsSpacing: 2,
                  itemWidth: 94,
                  itemHeight: 18,
                  itemDirection: 'left-to-right',
                  itemTextColor: '#853528',
                  itemOpacity: 0.95,
                  symbolSize: 18,
                },
              ]
            : []
        }
        theme={{
          text: {
            fill: '#853528',
            fontFamily: 'var(--font-serif)',
          },
          tooltip: {
            container: {
              background: '#ffffff',
              color: '#853528',
              fontSize: '14px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              border: '1px solid #ded7d0',
              padding: '12px 16px',
            },
          },
          legends: {
            text: {
              fill: '#853528',
              fontFamily: 'var(--font-serif)',
              fontSize: 12,
            },
          },
        }}
        tooltip={({ feature }) => {
          const featureId = (feature as any).properties?.id; // Use properties.id (e.g., "VN22")
          const featureName = (feature as any).properties?.name;
          const dataPoint = data.find((d) => d.id === featureId);
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
    </div>
  );
}

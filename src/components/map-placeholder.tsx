'use client';

// Placeholder for Nivo Map
// Real implementation would require GeoJSON data for Vietnam provinces
export function MapPlaceholder() {
  return (
    <div className="w-full aspect-[4/3] bg-sand-200 rounded-lg flex items-center justify-center border-2 border-dashed border-sand-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Vietnam_location_map.svg/864px-Vietnam_location_map.svg.png')] bg-contain bg-center bg-no-repeat opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
      <div className="z-10 text-center p-6 bg-sand-50/80 backdrop-blur-sm rounded-xl shadow-sm border border-sand-200">
        <h3 className="font-serif text-xl text-terracotta-700 mb-2">Dialect Map</h3>
        <p className="text-sand-500 text-sm">Interactive visualization coming soon.</p>
      </div>
    </div>
  );
}

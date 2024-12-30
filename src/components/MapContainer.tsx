import React, { memo } from 'react';
import { Location } from '../types/location';
import { useMap } from '../hooks/use-map';
import { cn } from '../lib/utils';
import { getTileLayerConfig } from '../services/maps';

interface MapContainerProps {
  locations?: Location[];
  className?: string;
}

const MapContainer = ({ locations = [], className }: MapContainerProps) => {
  // Ensure locations is always an array and contains valid coordinates
  const safeLocations = Array.isArray(locations) 
    ? locations.filter(loc => loc && typeof loc.lat === 'number' && typeof loc.lng === 'number')
    : [];

  const { mapRef } = useMap(safeLocations, getTileLayerConfig());

  return (
    <div className={cn("relative", className)}>
      <div 
        ref={mapRef}
        className="w-full h-full bg-gray-100 rounded-lg"
      />
    </div>
  );
};

export default memo(MapContainer);
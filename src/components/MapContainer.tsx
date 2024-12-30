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
  const { mapRef } = useMap(locations, getTileLayerConfig());

  return (
    <div className={cn("relative", className)}>
      <div 
        ref={mapRef}
        className="w-full h-full bg-gray-100 rounded-lg"
      />
    </div>
  );
};

export default memo(MapContainer, (prevProps, nextProps) => {
  // Ensure we have valid arrays to compare
  const prevLocations = prevProps.locations || [];
  const nextLocations = nextProps.locations || [];
  
  // If arrays are different lengths, they're definitely different
  if (prevLocations.length !== nextLocations.length) {
    return false;
  }
  
  // Compare each location's properties
  return prevLocations.every((loc, index) => {
    const nextLoc = nextLocations[index];
    // If either location is null/undefined, consider them different
    if (!loc || !nextLoc) {
      return false;
    }
    // Compare location properties
    return (
      loc.id === nextLoc.id && 
      loc.lat === nextLoc.lat && 
      loc.lng === nextLoc.lng
    );
  });
});
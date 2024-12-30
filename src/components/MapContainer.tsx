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
  const prevLocations = prevProps.locations || [];
  const nextLocations = nextProps.locations || [];
  
  if (prevLocations.length !== nextLocations.length) return false;
  
  return prevLocations.every((loc, index) => {
    const nextLoc = nextLocations[index];
    if (!loc || !nextLoc) return false;
    return (
      loc.id === nextLoc.id && 
      loc.lat === nextLoc.lat && 
      loc.lng === nextLoc.lng
    );
  });
});
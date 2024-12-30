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
  if (prevProps.locations?.length !== nextProps.locations?.length) return false;
  return prevProps.locations?.every((loc, index) => 
    loc.id === nextProps.locations?.[index]?.id &&
    loc.lat === nextProps.locations?.[index]?.lat &&
    loc.lng === nextProps.locations?.[index]?.lng
  ) ?? true;
});

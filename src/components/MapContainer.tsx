import React from 'react';
import { useMap } from '@/hooks/use-map';
import { Location } from '@/types/location';
import { cn } from '@/lib/utils';

interface MapContainerProps {
  locations: Location[];
  className?: string;
}

export const MapContainer = ({ locations, className }: MapContainerProps) => {
  const { mapRef } = useMap(locations);

  return (
    <div 
      ref={mapRef} 
      className={cn(
        "w-full h-full min-h-[400px] rounded-xl overflow-hidden",
        "transition-all duration-300",
        "shadow-inner border border-sage-100",
        className
      )}
      role="region"
      aria-label="Trip route map"
    />
  );
};

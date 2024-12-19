import React from 'react';
import { LoadScript } from '@react-google-maps/api';
import { useMap } from '@/hooks/use-map';
import { Location } from '@/types/location';
import { cn } from '@/lib/utils';

interface MapContainerProps {
  locations: Location[];
  className?: string;
}

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

export const MapContainer = ({ locations, className }: MapContainerProps) => {
  const [apiKey] = React.useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const { mapRef } = useMap(locations);

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-[300px] md:h-[500px] bg-muted rounded-xl">
        <p className="text-muted-foreground">Please set your Google Maps API key first</p>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
    >
      <div 
        ref={mapRef} 
        className={cn(
          "w-full rounded-xl overflow-hidden touch-pan-y",
          "transition-all duration-300",
          "shadow-lg border border-purple-100",
          "min-h-[300px]", // Ensure minimum height on mobile
          className
        )}
        role="region"
        aria-label="Trip route map"
      />
    </LoadScript>
  );
};
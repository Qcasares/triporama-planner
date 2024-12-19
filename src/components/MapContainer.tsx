import React from 'react';
import { LoadScript } from '@react-google-maps/api';
import { useMap } from '@/hooks/use-map';
import { Location } from '@/types/location';
import { cn } from '@/lib/utils';

interface MapContainerProps {
  locations: Location[];
  className?: string;
}

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

export const MapContainer = ({ locations, className }: MapContainerProps) => {
  const [apiKey] = React.useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const { mapRef } = useMap(locations);

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-xl">
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
          "w-full h-full min-h-[400px] rounded-xl overflow-hidden",
          "transition-all duration-300",
          "shadow-inner border border-sage-100",
          className
        )}
        role="region"
        aria-label="Trip route map"
      />
    </LoadScript>
  );
};
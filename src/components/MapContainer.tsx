import React from 'react';
import { LoadScript } from '@react-google-maps/api';
import { useMap } from '@/hooks/use-map';
import { Location } from '@/types/location';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { useApiKey } from '@/hooks/use-api-key';

interface MapContainerProps {
  locations: Location[];
  className?: string;
}

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

export const MapContainer = ({ locations = [], className }: MapContainerProps) => {
  const { apiKey } = useApiKey();
  const { mapRef } = useMap(locations);

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-[#F1F0FB] rounded-xl p-8 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">Google Maps API Key Required</h3>
        <p className="text-muted-foreground max-w-md">
          Please set your Google Maps API key in the settings menu to enable map functionality
        </p>
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
          "w-full rounded-xl overflow-hidden",
          "transition-all duration-300",
          "shadow-lg border border-purple-100/50",
          "h-[500px]",
          "md:h-[600px]",
          className
        )}
        role="region"
        aria-label="Trip route map"
      />
    </LoadScript>
  );
};
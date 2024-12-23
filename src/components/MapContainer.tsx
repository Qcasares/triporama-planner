import React from 'react';
import { Location } from '@/types/location';
import { useMap } from '@/hooks/use-map';

interface MapContainerProps {
  locations?: Location[];
  className?: string;
}

export const MapContainer = ({ 
  locations = [], // Provide default empty array
  className = '' 
}: MapContainerProps) => {
  const { mapRef } = useMap(locations);

  return (
    <div 
      ref={mapRef} 
      className={`${className} relative`}
      style={{ minHeight: '400px' }}
    >
      {locations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-muted-foreground">Add locations to see them on the map</p>
        </div>
      )}
    </div>
  );
};
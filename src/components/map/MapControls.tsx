import React from 'react';
import { Location } from '@/types/location';

export interface MapControlsProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  locations?: Location[];
}

export const MapControls: React.FC<MapControlsProps> = ({ mapRef, locations = [] }) => {
  const fitBounds = () => {
    if (!mapRef.current || !locations?.length) return;

    const bounds = new google.maps.LatLngBounds();
    locations.forEach(location => {
      bounds.extend({ lat: location.lat, lng: location.lng });
    });

    mapRef.current.fitBounds(bounds, {
      padding: { top: 50, right: 50, bottom: 50, left: 50 }
    });
  };

  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={fitBounds}
        className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50"
        title="Fit to markers"
      >
        <span className="sr-only">Fit to markers</span>
        🔍
      </button>
    </div>
  );
};
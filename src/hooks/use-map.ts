import { useCallback, useRef } from 'react';
import { Location } from '@/types/location';

export const useMap = (locations: Location[]) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    if (locations.length === 0) return;

    // Create bounds object
    const bounds = new google.maps.LatLngBounds();

    // Extend bounds with all locations
    locations.forEach(location => {
      if (typeof location.lat === 'number' && typeof location.lng === 'number') {
        bounds.extend({ lat: location.lat, lng: location.lng });
      }
    });

    // Fit bounds with padding
    map.fitBounds(bounds, {
      padding: { top: 50, right: 50, bottom: 50, left: 50 }
    });

    // If there's only one location, set an appropriate zoom level
    if (locations.length === 1) {
      map.setZoom(13);
    }
  }, [locations]);

  return {
    mapRef,
    onMapLoad,
    map: mapRef.current
  };
};
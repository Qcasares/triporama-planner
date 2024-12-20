import { useCallback, useRef } from 'react';
import { Location } from '@/types/location';

export const useMap = (locations: Location[]) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    if (locations.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    locations.forEach(location => {
      bounds.extend({ lat: location.lat, lng: location.lng });
    });

    map.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    });

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
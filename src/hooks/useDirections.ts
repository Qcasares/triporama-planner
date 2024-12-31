import { useCallback } from 'react';
import { Location } from '../types/location';
import { MapsService } from '../services/maps';

export function useDirections() {
  const mapsService = new MapsService();

  const getRoute = useCallback(async (locations: Location[]) => {
    if (locations.length < 2) return null;

    try {
      const origin = locations[0];
      const destination = locations[locations.length - 1];
      const waypoints = locations.slice(1, -1);

      const response = await mapsService.getDirections(
        { lat: origin.lat, lng: origin.lng },
        { lat: destination.lat, lng: destination.lng },
        waypoints.map(wp => ({ lat: wp.lat, lng: wp.lng }))
      );

      return response;
    } catch (error) {
      console.error('Error getting route:', error);
      return null;
    }
  }, []);

  return { getRoute };
}

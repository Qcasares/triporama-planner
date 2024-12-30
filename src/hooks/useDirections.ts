import { useCallback } from 'react';
import { Location } from '../types/location';
<<<<<<< HEAD

interface RouteLeg {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  start_address: string;
  end_address: string;
}

interface RouteResult {
  totalDistance: number;
  totalDuration: number;
  legs: RouteLeg[];
}

declare global {
  interface Window {
    google: {
      maps: {
        DirectionsService: new () => {
          route: (request: {
            origin: { lat: number; lng: number };
            destination: { lat: number; lng: number };
            waypoints: Array<{ location: { lat: number; lng: number }; stopover: boolean }>;
            travelMode: google.maps.TravelMode;
            optimizeWaypoints: boolean;
          }) => Promise<google.maps.DirectionsResult>;
        };
        TravelMode: { DRIVING: google.maps.TravelMode };
      };
    };
  }
}

export const useDirections = () => {
  const getRoute = useCallback(async (locations: Location[]): Promise<RouteResult> => {
    if (!window.google || !window.google.maps) {
      throw new Error('Google Maps API not loaded');
    }

    const directionsService = new window.google.maps.DirectionsService();

    const waypoints = locations.slice(1, -1).map(location => ({
      location: { lat: location.lat, lng: location.lng },
      stopover: true
    }));

    const result = await directionsService.route({
      origin: { lat: locations[0].lat, lng: locations[0].lng },
      destination: {
        lat: locations[locations.length - 1].lat,
        lng: locations[locations.length - 1].lng
      },
      waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
    });

    if (!result.routes || result.routes.length === 0 || !result.routes[0].legs) {
      throw new Error('Invalid route data received');
    }

    const legs = result.routes[0].legs;
    const totalDistance = legs.reduce((acc, leg) => acc + leg.distance.value, 0);
    const totalDuration = legs.reduce((acc, leg) => acc + leg.duration.value, 0);

    return {
      totalDistance,
      totalDuration,
      legs: legs.map(leg => ({
        distance: leg.distance,
        duration: leg.duration,
        start_address: leg.start_address,
        end_address: leg.end_address,
      })),
    };
  }, []);

  return { getRoute };
};
=======
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
>>>>>>> 54d26a7fbcfd1dc051a190048cdf74c5ea0cb4ac

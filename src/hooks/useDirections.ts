import { useCallback } from 'react';
import { Location } from '../types/location';

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

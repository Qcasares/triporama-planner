import { useEffect, useRef, useState, useCallback } from 'react';
import { Location } from '../types/location';
import { MapsService } from '../services/maps';
import { useToast } from './use-toast';

interface MapState {
  map: google.maps.Map | null;
  markers: google.maps.Marker[];
  directionsRenderer: google.maps.DirectionsRenderer | null;
  mapsService: MapsService | null;
}

interface RouteOptions {
  optimizeWaypoints?: boolean;
  travelMode?: google.maps.TravelMode;
  provideRouteAlternatives?: boolean;
}

const defaultMapOptions: google.maps.MapOptions = {
  zoom: 12,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
  gestureHandling: "cooperative",
};

const defaultRouteOptions: RouteOptions = {
  optimizeWaypoints: true,
  travelMode: google.maps.TravelMode.DRIVING,
  provideRouteAlternatives: true,
};

export const useMap = (locations: Location[], routeOptions: RouteOptions = defaultRouteOptions) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [mapState, setMapState] = useState<MapState>({
    map: null,
    markers: [],
    directionsRenderer: null,
    mapsService: null,
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    try {
      const map = new google.maps.Map(mapRef.current, {
        ...defaultMapOptions,
        center: locations[0] 
          ? { lat: locations[0].lat, lng: locations[0].lng } 
          : { lat: 0, lng: 0 },
      });

      const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#8b5cf6',
          strokeOpacity: 0.8,
          strokeWeight: 4,
          icons: [{
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
            },
            offset: '100%',
            repeat: '20px'
          }]
        }
      });

      directionsRenderer.setMap(map);
      const mapsService = new MapsService();

      setMapState({
        map,
        markers: [],
        directionsRenderer,
        mapsService,
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize map. Please check your API key.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const createMarker = useCallback((
    location: Location,
    index: number,
    total: number,
    map: google.maps.Map
  ) => {
    if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      console.error(`Invalid coordinates for location ${location.id}:`, location);
      return null;
    }

    const isFirst = index === 0;
    const isLast = index === total - 1;

    return new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map,
      title: location.name,
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: isFirst ? '#22c55e' : isLast ? '#ef4444' : '#8b5cf6',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff',
      },
      label: {
        text: (index + 1).toString(),
        color: '#ffffff',
        fontWeight: 'bold',
      },
    });
  }, []);

  // Update markers and calculate routes
  useEffect(() => {
    if (!mapState.map || !mapState.mapsService || !window.google) return;

    const updateMap = async () => {
      try {
        // Clear existing markers
        mapState.markers.forEach(marker => marker.setMap(null));

        // Create new markers
        const newMarkers = locations
          .map((location, index) => 
            createMarker(location, index, locations.length, mapState.map!)
          )
          .filter((marker): marker is google.maps.Marker => marker !== null);

        if (locations.length >= 2) {
          const origin = locations[0];
          const destination = locations[locations.length - 1];
          const waypoints = locations.slice(1, -1).map(location => ({
            location: { lat: location.lat, lng: location.lng },
            stopover: true
          }));

          const result = await mapState.mapsService.getDirections(
            { lat: origin.lat, lng: origin.lng },
            { lat: destination.lat, lng: destination.lng },
            waypoints,
            routeOptions.travelMode
          );

          mapState.directionsRenderer?.setDirections({
            routes: result.routes,
            request: {
              origin: { lat: origin.lat, lng: origin.lng },
              destination: { lat: destination.lat, lng: destination.lng },
              waypoints,
              travelMode: routeOptions.travelMode,
              optimizeWaypoints: routeOptions.optimizeWaypoints,
              provideRouteAlternatives: routeOptions.provideRouteAlternatives,
            }
          });

          // Fit bounds with padding
          mapState.map.fitBounds(result.bounds, 50);
        }

        setMapState(prev => ({
          ...prev,
          markers: newMarkers
        }));
      } catch (error) {
        console.error('Error updating map:', error);
        toast({
          title: 'Error',
          description: 'Failed to update map with new locations.',
          variant: 'destructive',
        });
      }
    };

    updateMap();
  }, [locations, mapState.map, mapState.mapsService, mapState.directionsRenderer, routeOptions, createMarker, toast]);

  const getDistanceMatrix = useCallback(async (
    origins: Location[],
    destinations: Location[],
    travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
  ) => {
    if (!mapState.mapsService) {
      throw new Error('Maps service not initialized');
    }

    try {
      return await mapState.mapsService.getDistance(
        origins.map(origin => ({ lat: origin.lat, lng: origin.lng })),
        destinations.map(dest => ({ lat: dest.lat, lng: dest.lng })),
        travelMode
      );
    } catch (error) {
      console.error('Error calculating distances:', error);
      toast({
        title: 'Error',
        description: 'Failed to calculate distances between locations.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [mapState.mapsService, toast]);

  return {
    mapRef,
    map: mapState.map,
    markers: mapState.markers,
    getDistanceMatrix,
  };
};

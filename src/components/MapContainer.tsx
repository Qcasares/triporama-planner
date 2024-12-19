import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { Location } from './TripPlanner';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { ApiKeyInput } from './ApiKeyInput';
import { libraries, mapContainerStyle, defaultCenter, mapOptions } from './map/MapConfig';
import { DirectionsLayer } from './map/DirectionsLayer';
import { LocationMarkers } from './map/LocationMarkers';

interface MapContainerProps {
  locations: Location[];
}

export const MapContainer = ({ locations }: MapContainerProps) => {
  const [apiKey] = useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const center = useMemo(() => {
    if (locations.length === 0) return defaultCenter;
    
    const bounds = new google.maps.LatLngBounds();
    locations.forEach(location => {
      bounds.extend({ lat: location.lat, lng: location.lng });
    });
    
    return bounds.getCenter().toJSON();
  }, [locations]);

  useEffect(() => {
    if (!isLoaded || locations.length < 2) {
      setDirections(null);
      return;
    }

    const fetchDirections = async () => {
      const directionsService = new google.maps.DirectionsService();
      
      try {
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
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false,
        });
        
        setDirections(result);
      } catch (error) {
        console.error('Error fetching directions:', error);
        setDirections(null);
      }
    };

    fetchDirections();
  }, [locations, isLoaded]);

  const onLoad = useCallback((map: google.maps.Map) => {
    if (locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
    }
  }, [locations]);

  if (!apiKey) {
    return <ApiKeyInput />;
  }

  if (loadError) {
    return (
      <div className="map-container flex items-center justify-center bg-destructive/10">
        <p className="text-destructive">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-container">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className={cn("map-container relative")}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={locations.length === 0 ? 12 : undefined}
        center={center}
        onLoad={onLoad}
        options={mapOptions}
      >
        {!directions && <LocationMarkers locations={locations} />}
        {directions && <DirectionsLayer directions={directions} />}
      </GoogleMap>
    </div>
  );
};
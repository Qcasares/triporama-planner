import React from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { Location } from '@/types/location';
import { LocationMarkers } from './map/LocationMarkers';
import { DirectionsLayer } from './map/DirectionsLayer';
import { mapContainerStyle, defaultCenter, mapOptions } from './map/MapConfig';
import { useToast } from '@/hooks/use-toast';

interface MapContainerProps {
  locations?: Location[];
  className?: string;
}

export const MapContainer = ({ 
  locations = [], 
  className = '' 
}: MapContainerProps) => {
  const [directions, setDirections] = React.useState<google.maps.DirectionsResult | null>(null);
  const [apiKey] = React.useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const { toast } = useToast();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });

  // Calculate route when locations change
  React.useEffect(() => {
    if (!isLoaded || locations.length < 2) {
      setDirections(null);
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const origin = locations[0];
    const destination = locations[locations.length - 1];
    const waypoints = locations.slice(1, -1).map(location => ({
      location: { lat: location.lat, lng: location.lng },
      stopover: true
    }));

    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        } else {
          toast({
            title: "Route calculation failed",
            description: "Could not calculate the route between locations.",
            variant: "destructive",
          });
          setDirections(null);
        }
      }
    );
  }, [isLoaded, locations, toast]);

  if (loadError) {
    return (
      <div className={`${className} relative rounded-lg bg-gray-50`} style={{ minHeight: '400px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Failed to load the map</p>
            <p className="text-sm text-muted-foreground">Please check your API key and try again</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${className} relative rounded-lg bg-gray-50`} style={{ minHeight: '400px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className={`${className} relative rounded-lg bg-gray-50`} style={{ minHeight: '400px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">Add locations to see them on the map</p>
        </div>
      </div>
    );
  }

  const center = locations[0] ? { lat: locations[0].lat, lng: locations[0].lng } : defaultCenter;

  return (
    <div className={`${className} relative`} style={{ minHeight: '400px' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={8}
        options={mapOptions}
      >
        {!directions && <LocationMarkers locations={locations} />}
        {directions && <DirectionsLayer directions={directions} />}
      </GoogleMap>
    </div>
  );
};
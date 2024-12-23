import React from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { Location } from '@/types/location';
import { LocationMarkers } from './map/LocationMarkers';
import { DirectionsLayer } from './map/DirectionsLayer';
import { mapContainerStyle, defaultCenter, mapOptions } from './map/MapConfig';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, MapPin } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface MapContainerProps {
  locations?: Location[];
  className?: string;
}

interface MapError {
  type: 'API_KEY' | 'LOAD' | 'ROUTE' | 'GENERAL';
  message: string;
}

export const MapContainer = ({ 
  locations = [], 
  className = '' 
}: MapContainerProps) => {
  const [directions, setDirections] = React.useState<google.maps.DirectionsResult | null>(null);
  const [error, setError] = React.useState<MapError | null>(null);
  const [apiKey] = React.useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const { toast } = useToast();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });

  React.useEffect(() => {
    if (!apiKey) {
      setError({
        type: 'API_KEY',
        message: 'Google Maps API key is missing'
      });
      return;
    }

    if (loadError) {
      setError({
        type: 'LOAD',
        message: 'Failed to load Google Maps'
      });
      return;
    }

    setError(null);
  }, [apiKey, loadError]);

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
          setError(null);
        } else {
          const errorMessage = 'Could not calculate the route between locations';
          setError({
            type: 'ROUTE',
            message: errorMessage
          });
          toast({
            title: "Route calculation failed",
            description: errorMessage,
            variant: "destructive",
          });
          setDirections(null);
        }
      }
    );
  }, [isLoaded, locations, toast]);

  if (error) {
    return (
      <div className={`${className} relative rounded-lg bg-gray-50`} style={{ minHeight: '400px' }}>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>
              {error.type === 'API_KEY' ? 'API Key Missing' : 
               error.type === 'LOAD' ? 'Map Load Error' : 
               'Route Error'}
            </AlertTitle>
            <AlertDescription className="mt-2">
              {error.message}
              {error.type === 'API_KEY' && (
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => {
                    document.dispatchEvent(new KeyboardEvent('keydown', {
                      key: 'k',
                      ctrlKey: true
                    }));
                  }}
                >
                  Set API Key
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${className} relative rounded-lg bg-gray-50`} style={{ minHeight: '400px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  // Default center when no locations are available
  const center = locations.length > 0 
    ? { lat: locations[0].lat, lng: locations[0].lng }
    : defaultCenter;

  return (
    <div className={`${className} relative`} style={{ minHeight: '400px' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={8}
        options={mapOptions}
      >
        {locations.length > 0 && !directions && <LocationMarkers locations={locations} />}
        {directions && <DirectionsLayer directions={directions} />}
      </GoogleMap>
    </div>
  );
};
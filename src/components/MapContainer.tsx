import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { useMap } from '@/hooks/use-map';
import { Location } from '@/types/location';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { LocationMarkers } from './map/LocationMarkers';

interface MapContainerProps {
  locations: Location[];
  className?: string;
}

const GOOGLE_MAPS_LIBRARIES: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: true,
  fullscreenControl: true,
};

export const MapContainer = ({ locations, className }: MapContainerProps) => {
  const [apiKey] = React.useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const { mapRef, onMapLoad } = useMap(locations);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (locations.length < 2) {
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
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        } else {
          console.error('Error fetching directions:', status);
        }
      }
    );
  }, [locations]);

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-[#F1F0FB] rounded-xl p-8 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">Google Maps API Key Required</h3>
        <p className="text-muted-foreground max-w-md">
          Please set your Google Maps API key in the settings menu to enable map functionality
        </p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={GOOGLE_MAPS_LIBRARIES}>
      <GoogleMap
        mapContainerClassName={cn(
          "w-full rounded-xl overflow-hidden",
          "transition-all duration-300",
          "shadow-lg border border-purple-100/50",
          "h-[500px]",
          "md:h-[600px]",
          className
        )}
        center={locations[0] || defaultCenter}
        zoom={12}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {directions ? (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: '#4A90E2',
                strokeWeight: 4,
              },
            }}
          />
        ) : (
          <LocationMarkers locations={locations} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};
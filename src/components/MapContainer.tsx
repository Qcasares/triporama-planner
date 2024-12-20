import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { useMap } from '@/hooks/use-map';
import { Location } from '@/types/location';
import { cn } from '@/lib/utils';
import { LocationMarkers } from './map/LocationMarkers';
import { DirectionsLayer } from './map/DirectionsLayer';
import { useToast } from '@/hooks/use-toast';
import { NoApiKeyWarning } from './map/NoApiKeyWarning';
import { MapClickInfoWindow } from './map/MapClickInfoWindow';
import { MapControls } from './map/MapControls';
import { 
  defaultMapOptions, 
  defaultCenter, 
  GOOGLE_MAPS_LIBRARIES,
  MAP_CONSTANTS 
} from '@/config/map-config';

interface MapContainerProps {
  locations: Location[];
  className?: string;
  onAddLocation?: (location: Location) => void;
}

export const MapContainer = ({ locations, className, onAddLocation }: MapContainerProps) => {
  const [apiKey] = React.useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const { mapRef, onMapLoad } = useMap(locations);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [clickedLocation, setClickedLocation] = useState<{lat: number; lng: number; name: string} | null>(null);
  const { toast } = useToast();

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

    const request = {
      origin: { lat: origin.lat, lng: origin.lng },
      destination: { lat: destination.lat, lng: destination.lng },
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        setDirections(result);
      } else {
        console.error('Error fetching directions:', status);
        toast({
          title: "Error",
          description: "Could not calculate directions between locations",
          variant: "destructive",
        });
      }
    });
  }, [locations, toast]);

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng || !onAddLocation) return;
    
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    
    try {
      const response = await geocoder.geocode({ location: latlng });
      if (response.results[0]) {
        setClickedLocation({
          lat: latlng.lat,
          lng: latlng.lng,
          name: response.results[0].formatted_address
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: "Error",
        description: "Could not get location information",
        variant: "destructive",
      });
    }
  };

  const handleAddLocation = () => {
    if (clickedLocation && onAddLocation) {
      onAddLocation({
        id: String(Date.now()),
        name: clickedLocation.name,
        lat: clickedLocation.lat,
        lng: clickedLocation.lng,
      });
      setClickedLocation(null);
      toast({
        title: "Location added",
        description: `${clickedLocation.name} has been added to your itinerary`,
      });
    }
  };

  if (!apiKey) {
    return <NoApiKeyWarning />;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={GOOGLE_MAPS_LIBRARIES}>
      <div className="relative">
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
          zoom={MAP_CONSTANTS.DEFAULT_ZOOM}
          options={defaultMapOptions}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          <MapControls mapRef={mapRef} />

          {directions ? (
            <DirectionsLayer directions={directions} />
          ) : (
            <LocationMarkers locations={locations} />
          )}

          {clickedLocation && (
            <MapClickInfoWindow
              position={{ lat: clickedLocation.lat, lng: clickedLocation.lng }}
              name={clickedLocation.name}
              onClose={() => setClickedLocation(null)}
              onAdd={handleAddLocation}
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};
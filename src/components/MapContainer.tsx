import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import { useMap } from '@/hooks/use-map';
import { Location } from '@/types/location';
import { cn } from '@/lib/utils';
import { MapPin, Plus } from 'lucide-react';
import { LocationMarkers } from './map/LocationMarkers';
import { DirectionsLayer } from './map/DirectionsLayer';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  mapContainerStyle, 
  defaultCenter, 
  mapOptions, 
  GOOGLE_MAPS_LIBRARIES 
} from './map/MapConfig';

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

    console.log('Requesting directions with:', request);

    directionsService.route(request, (result, status) => {
      console.log('Directions response:', { result, status });
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
        onClick={handleMapClick}
      >
        {directions ? (
          <DirectionsLayer directions={directions} />
        ) : (
          <LocationMarkers locations={locations} />
        )}

        {clickedLocation && (
          <InfoWindow
            position={{ lat: clickedLocation.lat, lng: clickedLocation.lng }}
            onCloseClick={() => setClickedLocation(null)}
          >
            <div className="p-2">
              <p className="text-sm mb-2">{clickedLocation.name}</p>
              <Button 
                size="sm" 
                onClick={handleAddLocation}
                className="w-full flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add to Itinerary
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};
import { useState } from 'react';
import { Location } from '@/types/location';
import { type ToastProps } from '@/components/ui/toast';

interface ClickedLocation {
  lat: number;
  lng: number;
  name: string;
}

export const useMapClick = (
  onAddLocation?: (location: Location) => void,
  toast?: (props: ToastProps) => void
) => {
  const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);

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
      toast?.({
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
      toast?.({
        title: "Location added",
        description: `${clickedLocation.name} has been added to your itinerary`,
      });
    }
  };

  return {
    clickedLocation,
    setClickedLocation,
    handleMapClick,
    handleAddLocation
  };
};
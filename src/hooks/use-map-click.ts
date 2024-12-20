import { useState } from 'react';
import { Location } from '@/types/location';
import { useToast } from '@/hooks/use-toast';

export const useMapClick = (onAddLocation?: (location: Location) => void) => {
  const [clickedLocation, setClickedLocation] = useState<Location | null>(null);
  const { toast } = useToast();

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // Get address from coordinates using Geocoder
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          setClickedLocation({
            id: String(Date.now()),
            name: results[0].formatted_address,
            lat,
            lng,
          });
        } else {
          toast({
            title: "Error",
            description: "Could not get location details",
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleAddLocation = () => {
    if (!clickedLocation) return;

    onAddLocation?.(clickedLocation);
    
    toast({
      title: "Success",
      description: "Location added to your trip",
    });

    setClickedLocation(null);
  };

  return {
    clickedLocation,
    handleMapClick,
    handleAddLocation,
    setClickedLocation,
  };
};
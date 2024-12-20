import { useState } from 'react';
import { Location } from '@/types/location';
import { useToast } from '@/hooks/use-toast';

export const useMapClick = (onAddLocation: (location: Location) => void) => {
  const [clickedLocation, setClickedLocation] = useState<Location | null>(null);
  const { toast } = useToast();

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // Get address from coordinates using Geocoder
    const geocoder = new google.maps.Geocoder();
    
    try {
      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results) {
              resolve(results);
            } else {
              reject(new Error('Geocoding failed'));
            }
          }
        );
      });

      if (results[0]) {
        const newLocation: Location = {
          id: String(Date.now()),
          name: results[0].formatted_address,
          lat,
          lng,
        };
        setClickedLocation(newLocation);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not get location details",
        variant: "destructive",
      });
    }
  };

  const handleAddLocation = () => {
    if (!clickedLocation) return;
    onAddLocation(clickedLocation);
    setClickedLocation(null);
  };

  return {
    clickedLocation,
    handleMapClick,
    handleAddLocation,
    setClickedLocation,
  };
};
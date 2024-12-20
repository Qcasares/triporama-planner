import { useState, useEffect } from 'react';
import { Location } from '@/types/location';
import { useToast } from '@/hooks/use-toast';

export const useMapDirections = (locations: Location[]) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
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

  return { directions };
};
import { useState, useEffect } from 'react';
import { Location } from '@/types/location';
import { getLocationDetails } from '@/services/maps';
import { useToast } from '@/hooks/use-toast';

interface GeolocationState {
  currentLocation: Location | null;
  error: string | null;
  isLoading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    currentLocation: null,
    error: null,
    isLoading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported',
        isLoading: false,
      }));
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const details = await getLocationDetails(latitude, longitude);
          
          const location: Location = {
            id: 'current-location',
            name: details.formatted_address,
            lat: details.lat,
            lng: details.lng,
          };

          setState({
            currentLocation: location,
            error: null,
            isLoading: false,
          });

          toast({
            title: "Location detected",
            description: "Your current location has been added as the starting point.",
          });
        } catch (error) {
          setState(prev => ({
            ...prev,
            error: 'Failed to get location details',
            isLoading: false,
          }));
          toast({
            title: "Location error",
            description: "Could not determine your current location.",
            variant: "destructive",
          });
        }
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false,
        }));
        toast({
          title: "Location access denied",
          description: "Please enable location access to use your current position.",
          variant: "destructive",
        });
      }
    );
  }, [toast]);

  return state;
};

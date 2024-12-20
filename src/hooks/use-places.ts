import { useState, useEffect } from 'react';
import { Place } from '@/types/place';
import { Location } from '@/types/location';
import { PlacesService } from '@/services/places';

export const usePlaces = (selectedLocation: Location, filters: { category: string }) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!selectedLocation) return;
      
      setIsLoading(true);
      try {
        const placesService = new PlacesService();
        const results = await placesService.searchNearby(
          { lat: selectedLocation.lat, lng: selectedLocation.lng },
          filters.category || 'tourist_attraction'
        );
        setPlaces(results);
      } catch (error) {
        console.error('Error fetching places:', error);
        setPlaces([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [selectedLocation, filters.category]);

  return { places, isLoading };
};
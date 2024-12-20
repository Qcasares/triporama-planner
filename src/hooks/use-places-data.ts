import { useState } from 'react';
import { Place } from '@/types/place';
import { useQuery } from '@tanstack/react-query';
import { Location } from '@/types/location';
import { placesService } from '@/services/places/places.service';

export const usePlacesData = (location: Location) => {
  const [customPlace, setCustomPlace] = useState({ name: '', type: '', notes: '' });
  const [isCustomPlaceDialogOpen, setIsCustomPlaceDialogOpen] = useState(false);

  const placeTypes = {
    hotels: 'lodging',
    restaurants: 'restaurant',
    attractions: 'tourist_attraction',
    shopping: 'shopping_mall',
    entertainment: 'movie_theater'
  } as const;

  const { data: places = {}, isLoading } = useQuery({
    queryKey: ['places', location.id],
    queryFn: async () => {
      const results = await Promise.all(
        Object.entries(placeTypes).map(async ([key, type]) => {
          const places = await placesService.searchNearby(location, type);
          return [key, places];
        })
      );
      return Object.fromEntries(results) as Record<string, Place[]>;
    },
    enabled: !!location,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleAddCustomPlace = (customPlace: { name: string; type: string; notes: string }) => {
    const newPlace: Place = {
      id: `custom-${Date.now()}`,
      name: customPlace.name,
      rating: 0,
      priceLevel: 0,
      vicinity: 'Custom Place',
      types: [customPlace.type],
      notes: customPlace.notes,
      lat: location.lat,
      lng: location.lng,
    };

    // Update the places state with the new custom place
    const updatedPlaces = {
      ...places,
      [customPlace.type]: [...(places[customPlace.type] || []), newPlace]
    };

    return updatedPlaces;
  };

  return {
    places,
    isLoading,
    customPlace,
    setCustomPlace,
    isCustomPlaceDialogOpen,
    setIsCustomPlaceDialogOpen,
    handleAddCustomPlace
  };
};
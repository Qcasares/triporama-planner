import { useState, useEffect } from 'react';
import { Place } from '@/types/place';
import { PlacesService } from '@/services/places';
import { useToast } from '@/hooks/use-toast';

interface PlacesState {
  places: Record<string, Place[]>;
  loading: boolean;
  error: string | null;
}

export const placeTypes = {
  hotels: 'lodging',
  restaurants: 'restaurant',
  attractions: 'tourist_attraction',
  shopping: 'shopping_mall',
  entertainment: 'movie_theater'
} as const;

export const usePlaces = (location: { lat: number; lng: number }) => {
  const [state, setState] = useState<PlacesState>({
    places: {
      hotels: [],
      restaurants: [],
      attractions: [],
      shopping: [],
      entertainment: []
    },
    loading: true,
    error: null
  });

  const [favorites, setFavorites] = useState<Set<string>>(() => 
    new Set(JSON.parse(localStorage.getItem('favorites') || '[]'))
  );

  const { toast } = useToast();
  const placesService = new PlacesService();

  useEffect(() => {
    const loadPlaces = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const results = await Promise.all(
          Object.entries(placeTypes).map(async ([key, type]) => {
            const places = await placesService.searchNearby(location, type);
            return [key, places];
          })
        );
        
        setState(prev => ({
          ...prev,
          places: Object.fromEntries(results),
          loading: false
        }));
      } catch (error) {
        console.error(`Error fetching places:`, error);
        setState(prev => ({
          ...prev,
          error: 'Failed to load places',
          loading: false
        }));
        toast({
          title: "Error loading places",
          description: "There was a problem fetching nearby places.",
          variant: "destructive",
        });
      }
    };

    loadPlaces();
  }, [location, toast]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (placeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(placeId)) {
        newFavorites.delete(placeId);
      } else {
        newFavorites.add(placeId);
      }
      return newFavorites;
    });
  };

  const addCustomPlace = (customPlace: { name: string; type: string; notes: string }) => {
    const newPlace: Place = {
      id: `custom-${Date.now()}`,
      name: customPlace.name,
      rating: 0,
      priceLevel: 0,
      vicinity: 'Custom Place',
      types: [customPlace.type],
      notes: customPlace.notes
    };

    setState(prev => ({
      ...prev,
      places: {
        ...prev.places,
        [customPlace.type]: [...(prev.places[customPlace.type] || []), newPlace]
      }
    }));
  };

  return {
    ...state,
    favorites,
    toggleFavorite,
    addCustomPlace,
    placeTypes
  };
};

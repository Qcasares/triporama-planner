import { useState, useEffect, useCallback, useMemo } from 'react';
import { Place } from '../types/place';
import { PlacesService } from '../services/places';
import { useToast } from './use-toast';

interface PlacesState {
  places: Record<string, Place[]>;
  loading: boolean;
  error: string | null;
  predictions: google.maps.places.AutocompletePrediction[];
}

interface SearchOptions {
  minRating?: number;
  maxPrice?: number;
  openNow?: boolean;
  radius?: number;
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
    error: null,
    predictions: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({});
  const [favorites, setFavorites] = useState<Set<string>>(() => 
    new Set(JSON.parse(localStorage.getItem('favorites') || '[]'))
  );

  const { toast } = useToast();
  const placesService = useMemo(() => new PlacesService(), []);

  const loadPlaces = useCallback(async (options: SearchOptions = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const results = await Promise.all(
        Object.entries(placeTypes).map(async ([key, type]) => {
          const places = await placesService.searchNearby(location, type, {
            minRating: options.minRating,
            maxPrice: options.maxPrice,
            openNow: options.openNow,
            radius: options.radius
          });
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
  }, [location, placesService, toast]);

  const searchPlaces = useCallback(async (query: string) => {
    if (!query.trim()) {
      await loadPlaces(searchOptions);
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const results = await placesService.searchText(
        query,
        location,
        searchOptions.radius
      );

      // Group results by type
      const groupedResults = Object.keys(placeTypes).reduce((acc, key) => {
        acc[key] = results.filter(place => 
          place.types.includes(placeTypes[key as keyof typeof placeTypes])
        );
        return acc;
      }, {} as Record<string, Place[]>);

      setState(prev => ({
        ...prev,
        places: groupedResults,
        loading: false
      }));
    } catch (error) {
      console.error(`Error searching places:`, error);
      setState(prev => ({
        ...prev,
        error: 'Failed to search places',
        loading: false
      }));
      toast({
        title: "Error searching places",
        description: "There was a problem with your search.",
        variant: "destructive",
      });
    }
  }, [location, placesService, searchOptions, loadPlaces, toast]);

  const getPlacePredictions = useCallback(async (input: string) => {
    if (!input.trim()) {
      setState(prev => ({ ...prev, predictions: [] }));
      return;
    }

    try {
      const predictions = await placesService.getPlacePredictions(
        input,
        location,
        searchOptions.radius
      );
      setState(prev => ({ ...prev, predictions }));
    } catch (error) {
      console.error('Error getting place predictions:', error);
      toast({
        title: "Error",
        description: "Failed to get place suggestions.",
        variant: "destructive",
      });
    }
  }, [location, placesService, searchOptions.radius, toast]);

  useEffect(() => {
    loadPlaces(searchOptions);
  }, [location, searchOptions, loadPlaces]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = useCallback((placeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(placeId)) {
        newFavorites.delete(placeId);
      } else {
        newFavorites.add(placeId);
      }
      return newFavorites;
    });
  }, []);

  const addCustomPlace = useCallback((customPlace: { 
    name: string; 
    type: string; 
    notes: string;
    lat?: number;
    lng?: number;
  }) => {
    const newPlace: Place = {
      id: `custom-${Date.now()}`,
      name: customPlace.name,
      rating: 0,
      priceLevel: 0,
      vicinity: 'Custom Place',
      types: [customPlace.type],
      notes: customPlace.notes,
      geometry: customPlace.lat && customPlace.lng ? {
        location: new google.maps.LatLng(customPlace.lat, customPlace.lng)
      } : undefined
    };

    setState(prev => ({
      ...prev,
      places: {
        ...prev.places,
        [customPlace.type]: [...(prev.places[customPlace.type] || []), newPlace]
      }
    }));
  }, []);

  return {
    ...state,
    favorites,
    searchQuery,
    searchOptions,
    setSearchQuery,
    setSearchOptions,
    toggleFavorite,
    addCustomPlace,
    searchPlaces,
    getPlacePredictions,
    placeTypes
  };
};

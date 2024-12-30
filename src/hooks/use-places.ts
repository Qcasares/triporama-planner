import { useState, useEffect, useCallback, useMemo } from 'react';
import { Place } from '../types/place';
import { PlacesService } from '../services/places';
import { useToast } from './use-toast';

interface PlacesState {
  places: Record<string, {
    items: Place[];
    hasMore: boolean;
    page: number;
    loading: boolean;
  }>;
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

interface UsePlacesReturn {
  places: Record<string, {
    items: Place[];
    hasMore: boolean;
    page: number;
    loading: boolean;
  }>;
  error: string | null;
  predictions: google.maps.places.AutocompletePrediction[];
  favorites: Set<string>;
  searchQuery: string;
  searchOptions: SearchOptions;
  setSearchQuery: (query: string) => void;
  setSearchOptions: (options: SearchOptions) => void;
  toggleFavorite: (placeId: string) => void;
  addCustomPlace: (customPlace: { 
    name: string; 
    type: string; 
    notes: string;
    lat?: number;
    lng?: number;
  }) => void;
  searchPlaces: (query: string) => Promise<void>;
  getPlacePredictions: (input: string) => Promise<void>;
  placeTypes: typeof placeTypes;
  loading: boolean;
}

export const usePlaces = (location: { lat: number; lng: number }): UsePlacesReturn => {
  const [state, setState] = useState<PlacesState>({
    places: Object.keys(placeTypes).reduce((acc, key) => ({
      ...acc,
      [key]: {
        items: [],
        hasMore: true,
        page: 0,
        loading: false
      }
    }), {}),
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

  const loadPlaces = useCallback(async (options: SearchOptions = {}, category?: string) => {
    if (category) {
      // Load single category
      setState(prev => ({
        ...prev,
        places: {
          ...prev.places,
          [category]: {
            ...prev.places[category],
            loading: true
          }
        }
      }));

      try {
        const { places, hasMore } = await placesService.searchNearby(
          location,
          placeTypes[category as keyof typeof placeTypes],
          {
            minRating: options.minRating,
            maxPrice: options.maxPrice,
            openNow: options.openNow,
            radius: options.radius
          },
          0
        );

        setState(prev => ({
          ...prev,
          places: {
            ...prev.places,
            [category]: {
              items: places,
              hasMore,
              page: 0,
              loading: false
            }
          }
        }));
      } catch (error) {
        console.error(`Error fetching places for ${category}:`, error);
        setState(prev => ({
          ...prev,
          error: `Failed to load ${category}`,
          places: {
            ...prev.places,
            [category]: {
              ...prev.places[category],
              loading: false
            }
          }
        }));
        toast({
          title: `Error loading ${category}`,
          description: "There was a problem fetching places.",
          variant: "destructive",
        });
      }
    } else {
      // Load all categories
      setState(prev => ({
        ...prev,
        places: Object.keys(prev.places).reduce((acc, key) => ({
          ...acc,
          [key]: {
            ...prev.places[key],
            loading: true
          }
        }), {})
      }));

      try {
        const results = await Promise.all(
          Object.entries(placeTypes).map(async ([key, type]): Promise<[string, { places: Place[]; hasMore: boolean }]> => {
            const result = await placesService.searchNearby(location, type, {
              minRating: options.minRating,
              maxPrice: options.maxPrice,
              openNow: options.openNow,
              radius: options.radius
            }, 0);
            return [key, result];
          })
        );

        setState(prev => ({
          ...prev,
          places: Object.fromEntries(
            results.map(([key, result]) => [
              key,
              {
                items: result.places,
                hasMore: result.hasMore,
                page: 0,
                loading: false
              }
            ])
          )
        }));
      } catch (error) {
        console.error('Error fetching places:', error);
        setState(prev => ({
          ...prev,
          error: 'Failed to load places',
          places: Object.keys(prev.places).reduce((acc, key) => ({
            ...acc,
            [key]: {
              ...prev.places[key],
              loading: false
            }
          }), {})
        }));
        toast({
          title: "Error loading places",
          description: "There was a problem fetching places.",
          variant: "destructive",
        });
      }
    }
  }, [location, placesService, toast, placeTypes]);

  const loadMore = useCallback(async (category: string) => {
    const categoryState = state.places[category];
    if (!categoryState.hasMore || categoryState.loading) return;

    setState(prev => ({
      ...prev,
      places: {
        ...prev.places,
        [category]: {
          ...prev.places[category],
          loading: true
        }
      }
    }));

    try {
      const { places, hasMore } = await placesService.searchNearby(
        location,
        placeTypes[category as keyof typeof placeTypes],
        searchOptions,
        categoryState.page + 1
      );

      setState(prev => ({
        ...prev,
        places: {
          ...prev.places,
          [category]: {
            items: [...prev.places[category].items, ...places],
            hasMore,
            page: prev.places[category].page + 1,
            loading: false
          }
        }
      }));
    } catch (error) {
      console.error(`Error loading more ${category}:`, error);
      setState(prev => ({
        ...prev,
        places: {
          ...prev.places,
          [category]: {
            ...prev.places[category],
            loading: false
          }
        }
      }));
      toast({
        title: `Error loading more ${category}`,
        description: "There was a problem fetching more places.",
        variant: "destructive",
      });
    }
  }, [location, placesService, searchOptions, state.places, toast, placeTypes]);

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
        places: Object.fromEntries(
          Object.entries(groupedResults).map(([key, places]) => [
            key,
            {
              items: places,
              hasMore: false,
              page: 0,
              loading: false
            }
          ])
        ),
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
        [customPlace.type]: {
          ...prev.places[customPlace.type],
          items: [...prev.places[customPlace.type].items, newPlace]
        }
      }
    }));
  }, []);

  const loading = Object.values(state.places).some(place => place.loading);
  
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
    placeTypes,
    loading
  };
};

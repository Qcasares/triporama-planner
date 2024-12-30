import { useCallback, useEffect, useMemo } from 'react';
import { PlacesService } from '../services/places';
import { useToast } from './use-toast';
import { usePlacesState } from './places/use-places-state';
import { loadPlaces, loadMore, searchPlaces, placeTypes } from './places/places-actions';
import { Place } from '../types/place';

export { placeTypes };

export const usePlaces = (location: { lat: number; lng: number }) => {
  const {
    state,
    setState,
    searchQuery,
    setSearchQuery,
    searchOptions,
    setSearchOptions,
    favorites,
    setFavorites
  } = usePlacesState();

  const { toast } = useToast();
  const placesService = useMemo(() => new PlacesService(), []);

  const handleLoadPlaces = useCallback(async (options = {}, category?: string) => {
    try {
      const result = await loadPlaces(placesService, location, options, category);
      setState(prev => ({ ...prev, ...result }));
    } catch (error) {
      console.error('Error loading places:', error);
      toast({
        title: "Error loading places",
        description: "There was a problem fetching places.",
        variant: "destructive",
      });
    }
  }, [location, placesService, setState, toast]);

  const handleLoadMore = useCallback(async (category: string) => {
    const categoryState = state.places[category];
    if (!categoryState.hasMore || categoryState.loading) return;

    try {
      const result = await loadMore(
        placesService,
        location,
        category,
        state,
        searchOptions
      );
      setState(prev => ({ ...prev, ...result }));
    } catch (error) {
      console.error(`Error loading more ${category}:`, error);
      toast({
        title: `Error loading more ${category}`,
        description: "There was a problem fetching more places.",
        variant: "destructive",
      });
    }
  }, [location, placesService, searchOptions, state, setState, toast]);

  const handleSearchPlaces = useCallback(async (query: string) => {
    if (!query.trim()) {
      await handleLoadPlaces(searchOptions);
      return;
    }

    try {
      const groupedResults = await searchPlaces(
        placesService,
        query,
        location,
        searchOptions.radius
      );

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
        )
      }));
    } catch (error) {
      console.error('Error searching places:', error);
      toast({
        title: "Error searching places",
        description: "There was a problem with your search.",
        variant: "destructive",
      });
    }
  }, [handleLoadPlaces, location, placesService, searchOptions, setState, toast]);

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
  }, [location, placesService, searchOptions.radius, setState, toast]);

  useEffect(() => {
    handleLoadPlaces(searchOptions);
  }, [location, searchOptions, handleLoadPlaces]);

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
  }, [setFavorites]);

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
  }, [setState]);

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
    searchPlaces: handleSearchPlaces,
    getPlacePredictions,
    placeTypes,
    loading
  };
};
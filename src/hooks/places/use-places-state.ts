import { useState } from 'react';
import { Place } from '../../types/place';

export interface PlacesState {
  places: Record<string, {
    items: Place[];
    hasMore: boolean;
    page: number;
    loading: boolean;
  }>;
  error: string | null;
  predictions: google.maps.places.AutocompletePrediction[];
}

export interface SearchOptions {
  minRating?: number;
  maxPrice?: number;
  openNow?: boolean;
  radius?: number;
}

export const usePlacesState = () => {
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

  return {
    state,
    setState,
    searchQuery,
    setSearchQuery,
    searchOptions,
    setSearchOptions,
    favorites,
    setFavorites
  };
};
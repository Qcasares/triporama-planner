import { useState, useCallback } from 'react';
import { Place } from '@/types/place';

interface FilterOptions {
  minRating: number;
  sortBy: 'rating' | 'distance';
}

const initialFilterOptions: FilterOptions = {
  minRating: 0,
  sortBy: 'rating'
};

export const usePlaceFilters = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(initialFilterOptions);

  const updateMinRating = useCallback((rating: number) => {
    setFilterOptions(prev => ({
      ...prev,
      minRating: rating
    }));
  }, []);

  const updateSortBy = useCallback((sortBy: FilterOptions['sortBy']) => {
    setFilterOptions(prev => ({
      ...prev,
      sortBy
    }));
  }, []);

  const filterAndSortPlaces = useCallback((places: Place[]) => {
    return places
      .filter(place => 
        (!filterOptions.minRating || (place.rating || 0) >= filterOptions.minRating)
      )
      .sort((a, b) => {
        switch (filterOptions.sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'distance':
            return (a.distance || 0) - (b.distance || 0);
          default:
            return 0;
        }
      });
  }, [filterOptions]);

  return {
    filterOptions,
    updateMinRating,
    updateSortBy,
    filterAndSortPlaces
  };
};
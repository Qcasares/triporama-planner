import { useState, useCallback } from 'react';
import { Place } from '@/types/place';

interface FilterOptions {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: 'rating' | 'distance' | 'price';
}

const initialFilterOptions: FilterOptions = {
  minPrice: 1,
  maxPrice: 4,
  minRating: 0,
  sortBy: 'rating'
};

export const usePlaceFilters = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(initialFilterOptions);

  const updatePriceRange = useCallback((min: number, max: number) => {
    setFilterOptions(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
  }, []);

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
        place.priceLevel >= filterOptions.minPrice &&
        place.priceLevel <= filterOptions.maxPrice &&
        place.rating >= filterOptions.minRating
      )
      .sort((a, b) => {
        switch (filterOptions.sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price':
            return a.priceLevel - b.priceLevel;
          default:
            return 0;
        }
      });
  }, [filterOptions]);

  return {
    filterOptions,
    updatePriceRange,
    updateMinRating,
    updateSortBy,
    filterAndSortPlaces
  };
};

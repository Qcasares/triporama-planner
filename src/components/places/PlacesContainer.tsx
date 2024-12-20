import React from 'react';
import { Location } from '@/types/location';
import { PlacesList } from './PlacesList';
import { PlacesFilters } from './PlacesFilters';
import { usePlaces } from '@/hooks/use-places';
import { usePlaceFilters } from '@/hooks/use-place-filters';

interface PlacesContainerProps {
  selectedLocation: Location;
  onAddLocation?: (location: Location) => void;
}

export const PlacesContainer = ({ 
  selectedLocation,
  onAddLocation 
}: PlacesContainerProps) => {
  const { filterOptions, updateMinRating, updateSortBy } = usePlaceFilters();
  const { places, isLoading } = usePlaces(selectedLocation, {
    category: filterOptions.sortBy
  });

  const handleFilterChange = (newFilters: any) => {
    updateMinRating(newFilters.rating);
    updateSortBy(newFilters.sortBy);
  };

  return (
    <div className="space-y-6">
      <PlacesFilters
        filters={filterOptions}
        onFiltersChange={handleFilterChange}
      />
      <PlacesList 
        places={places} 
        isLoading={isLoading}
        onAddToItinerary={onAddLocation}
      />
    </div>
  );
};
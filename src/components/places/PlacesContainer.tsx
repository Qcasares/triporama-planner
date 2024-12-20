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
  const { filters, updateFilter } = usePlaceFilters();
  const { places, isLoading } = usePlaces(selectedLocation, filters);

  return (
    <div className="space-y-6">
      <PlacesFilters
        filters={filters}
        onFilterChange={updateFilter}
      />
      <PlacesList 
        places={places} 
        isLoading={isLoading}
        onAddToItinerary={onAddLocation}
      />
    </div>
  );
};
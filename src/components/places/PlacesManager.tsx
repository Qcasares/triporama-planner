import React, { useState } from 'react';
import { Place } from '@/types/place';
import { FilterOptions } from '@/types/filters';
import { useApiKey } from '@/hooks/use-api-key';
import { usePlaces } from '@/hooks/use-places';
import { PlacesContainer } from './PlacesContainer';
import { Location } from '@/types/location';

interface PlacesManagerProps {
  location: Location;
}

export const PlacesManager = ({ location }: PlacesManagerProps) => {
  const { apiKey } = useApiKey();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minPrice: 1,
    maxPrice: 4,
    minRating: 0,
    sortBy: 'rating'
  });
  
  const {
    places,
    loading,
    favorites,
    toggleFavorite,
    addCustomPlace
  } = usePlaces(location);

  const [isCustomPlaceDialogOpen, setIsCustomPlaceDialogOpen] = useState(false);
  const [customPlace, setCustomPlace] = useState({ name: '', type: '', notes: '' });

  const handleCustomPlaceChange = (field: string, value: string) => {
    setCustomPlace(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCustomPlace = () => {
    addCustomPlace(customPlace);
    setCustomPlace({ name: '', type: '', notes: '' });
    setIsCustomPlaceDialogOpen(false);
  };

  if (!apiKey) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Please set your Google Maps API key to view recommendations</p>
      </div>
    );
  }

  return (
    <PlacesContainer
      location={location}
      places={places}
      loading={loading}
      favorites={favorites}
      filterOptions={filterOptions}
      isCustomPlaceDialogOpen={isCustomPlaceDialogOpen}
      customPlace={customPlace}
      onToggleFavorite={toggleFavorite}
      onFilterChange={(newOptions) => setFilterOptions(prev => ({ ...prev, ...newOptions }))}
      onCustomPlaceDialogOpenChange={setIsCustomPlaceDialogOpen}
      onCustomPlaceChange={handleCustomPlaceChange}
      onAddCustomPlace={handleAddCustomPlace}
    />
  );
};
import React, { useState } from 'react';
import { Place } from '@/types/place';
import { FilterOptions } from '@/types/filters';
import { useApiKey } from '@/hooks/use-api-key';
import { usePlaces } from '@/hooks/use-places';
import PlacesContainer from './PlacesContainer';
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
    places: placesData,
    loading: isLoading,
    favorites,
    toggleFavorite,
    addCustomPlace,
    placeTypes
  } = usePlaces(location);

  const [isCustomPlaceDialogOpen, setIsCustomPlaceDialogOpen] = useState(false);
  const [customPlace, setCustomPlace] = useState({ name: '', type: '', notes: '' });

  // Convert placesData to the expected format
  const places: Record<string, Place[]> = Object.entries(placesData).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value.items
  }), {});

  const handleCustomPlaceChange = (field: string, value: string) => {
    setCustomPlace(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCustomPlace = () => {
    addCustomPlace(customPlace);
    setCustomPlace({ name: '', type: '', notes: '' });
    setIsCustomPlaceDialogOpen(false);
  };

  const handleDragEnd = (result: any) => {
    // Implement drag and drop functionality if needed
    console.log('Drag ended:', result);
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
      loading={isLoading}
      favorites={favorites}
      filterOptions={filterOptions}
      isCustomPlaceDialogOpen={isCustomPlaceDialogOpen}
      customPlace={customPlace}
      placeTypes={placeTypes}
      onToggleFavorite={toggleFavorite}
      onFilterChange={(newOptions) => setFilterOptions(prev => ({ ...prev, ...newOptions }))}
      onCustomPlaceDialogOpenChange={setIsCustomPlaceDialogOpen}
      onCustomPlaceChange={handleCustomPlaceChange}
      onAddCustomPlace={handleAddCustomPlace}
      onDragEnd={handleDragEnd}
    />
  );
};
import React from 'react';
import { Location } from '@/types/location';
import { PlacesContainer } from './places/PlacesContainer';
import { usePlacesData } from '@/hooks/use-places-data';

interface TravelRecommendationsProps {
  location: Location;
}

export const TravelRecommendations = ({ location }: TravelRecommendationsProps) => {
  const {
    places,
    isLoading,
    customPlace,
    setCustomPlace,
    isCustomPlaceDialogOpen,
    setIsCustomPlaceDialogOpen,
    handleAddCustomPlace
  } = usePlacesData(location);

  return (
    <PlacesContainer
      location={location}
      places={places}
      loading={isLoading}
      customPlace={customPlace}
      isCustomPlaceDialogOpen={isCustomPlaceDialogOpen}
      onCustomPlaceDialogOpenChange={setIsCustomPlaceDialogOpen}
      onCustomPlaceChange={(field, value) => setCustomPlace(prev => ({ ...prev, [field]: value }))}
      onAddCustomPlace={() => {
        handleAddCustomPlace(customPlace);
        setCustomPlace({ name: '', type: '', notes: '' });
        setIsCustomPlaceDialogOpen(false);
      }}
    />
  );
};
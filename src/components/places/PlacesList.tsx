import React from 'react';
import { Place } from '@/types/place';
import { Location } from '@/types/location';
import { PlaceCard } from '../ui/place-card';
import { PlaceCardSkeleton } from '../ui/place-card-skeleton';

interface PlacesListProps {
  places: Place[];
  isLoading?: boolean;
  onAddToItinerary?: (location: Location) => void;
}

export const PlacesList = ({ 
  places, 
  isLoading,
  onAddToItinerary
}: PlacesListProps) => {
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  const toggleFavorite = (placeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(placeId)) {
        newFavorites.delete(placeId);
      } else {
        newFavorites.add(placeId);
      }
      return newFavorites;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <PlaceCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          isFavorite={favorites.has(place.id)}
          onToggleFavorite={toggleFavorite}
          onAddToItinerary={onAddToItinerary}
        />
      ))}
    </div>
  );
};
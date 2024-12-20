import React from 'react';
import { Place } from '@/types/place';
import { Location } from '@/types/location';
import { PlaceCard } from '../ui/place-card';
import { PlaceCardSkeleton } from '../ui/place-card-skeleton';

interface PlacesListProps {
  places: Place[];
  isLoading?: boolean;
  isFetchingNext?: boolean;
  onAddToItinerary?: (location: Location) => void;
}

export const PlacesList = ({ 
  places, 
  isLoading,
  isFetchingNext,
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
      <div className="space-y-4 animate-fade-in">
        {Array.from({ length: 3 }).map((_, index) => (
          <PlaceCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {places.map((place, index) => (
        <div
          key={place.id}
          className="animate-fade-in"
          style={{ 
            animationDelay: `${index * 50}ms`,
            opacity: 0,
            animation: 'fade-in 0.5s ease forwards'
          }}
        >
          <PlaceCard
            place={place}
            isFavorite={favorites.has(place.id)}
            onToggleFavorite={toggleFavorite}
            onAddToItinerary={onAddToItinerary}
          />
        </div>
      ))}
      {isFetchingNext && (
        <div className="space-y-4 animate-fade-in">
          {Array.from({ length: 2 }).map((_, index) => (
            <PlaceCardSkeleton key={`loading-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { Place } from '@/types/place';
import { Location } from '@/types/location';
import { PlaceCard } from '../ui/place-card';
import { PlaceCardSkeleton } from './PlaceCardSkeleton';
import { AlertCircle, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PlacesListProps {
  places: Place[];
  isLoading?: boolean;
  isFetchingNext?: boolean;
  error?: Error | null;
  onAddToItinerary?: (location: Location) => void;
}

export const PlacesList = React.memo(({ 
  places, 
  isLoading,
  isFetchingNext,
  error,
  onAddToItinerary
}: PlacesListProps) => {
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  const toggleFavorite = React.useCallback((placeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(placeId)) {
        newFavorites.delete(placeId);
      } else {
        newFavorites.add(placeId);
      }
      return newFavorites;
    });
  }, []);

  if (error) {
    return (
      <Alert variant="destructive" className="animate-in fade-in-50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message || 'Failed to load places. Please try again later.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-in fade-in-50">
        {Array.from({ length: 3 }).map((_, index) => (
          <PlaceCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!places.length) {
    return (
      <div className="text-center py-12 animate-in fade-in-50">
        <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No places found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filters to find more places.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {places.map((place, index) => (
        <div
          key={place.id}
          className="animate-in fade-in-50 slide-in-from-bottom-3"
          style={{ 
            animationDelay: `${index * 50}ms`,
            opacity: 0,
            animation: 'fade-in 0.5s ease forwards'
          }}
        >
          <PlaceCard
            place={place}
            isFavorite={favorites.has(place.id)}
            onToggleFavorite={() => toggleFavorite(place.id)}
            onAddToItinerary={onAddToItinerary}
          />
        </div>
      ))}
      {isFetchingNext && (
        <div className="space-y-4 animate-in fade-in-50">
          {Array.from({ length: 2 }).map((_, index) => (
            <PlaceCardSkeleton key={`loading-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.error === nextProps.error &&
    prevProps.isFetchingNext === nextProps.isFetchingNext &&
    prevProps.places.length === nextProps.places.length &&
    prevProps.places.every((place, index) => place.id === nextProps.places[index].id)
  );
});

PlacesList.displayName = 'PlacesList';

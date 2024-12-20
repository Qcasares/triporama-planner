import React, { useMemo } from 'react';
import { Place } from '@/types/place';
import { PlaceCard } from '@/components/ui/place-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface PlacesListProps {
  places: Place[];
  onLoadMore: () => void;
  filters: {
    category: string;
    rating: number;
    distance: number;
  };
}

export const PlacesList = ({ places, onLoadMore, filters }: PlacesListProps) => {
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      // Filter by rating
      if (place.rating && filters.rating > 0 && place.rating < filters.rating) {
        return false;
      }

      // Filter by distance (convert meters to miles for comparison)
      if (place.distance && (place.distance > filters.distance)) {
        return false;
      }

      // Filter by category if specified
      if (filters.category && place.placeType && 
          !place.placeType.includes(filters.category)) {
        return false;
      }

      return true;
    });
  }, [places, filters]);

  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-4">
        {filteredPlaces.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            isFavorite={false}
            onToggleFavorite={() => {}}
          />
        ))}
        {filteredPlaces.length > 0 && (
          <div className="pt-4 text-center">
            <Button
              variant="outline"
              onClick={onLoadMore}
              className="w-full md:w-auto"
            >
              Load More Places
            </Button>
          </div>
        )}
        {filteredPlaces.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No places found matching your criteria
          </p>
        )}
      </div>
    </ScrollArea>
  );
};
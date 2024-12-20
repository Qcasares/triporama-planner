import React from 'react';
import { Place } from '@/types/place';
import { PlaceCard } from '@/components/ui/place-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface PlacesListProps {
  places: Place[];
  onLoadMore: () => void;
}

export const PlacesList = ({ places, onLoadMore }: PlacesListProps) => {
  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-4">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            isFavorite={false}
            onToggleFavorite={() => {}}
          />
        ))}
        {places.length > 0 && (
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
        {places.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No places found matching your criteria
          </p>
        )}
      </div>
    </ScrollArea>
  );
};
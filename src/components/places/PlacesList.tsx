import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Place } from '@/types/place';
import { PlaceCard } from './PlaceCard';
import { PlaceFilters } from './PlaceFilters';

interface PlacesListProps {
  places: Place[];
  categoryId: string;
  favorites: Set<string>;
  onToggleFavorite: (placeId: string) => void;
  filterOptions: {
    minPrice: number;
    maxPrice: number;
    minRating: number;
    sortBy: 'rating' | 'distance' | 'price';
  };
  onFilterChange: (newOptions: Partial<typeof filterOptions>) => void;
}

export const PlacesList = ({
  places,
  categoryId,
  favorites,
  onToggleFavorite,
  filterOptions,
  onFilterChange,
}: PlacesListProps) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const filteredPlaces = React.useMemo(() => {
    return places
      .filter(place => 
        place.priceLevel >= filterOptions.minPrice &&
        place.priceLevel <= filterOptions.maxPrice &&
        place.rating >= filterOptions.minRating
      )
      .sort((a, b) => {
        switch (filterOptions.sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price':
            return a.priceLevel - b.priceLevel;
          default:
            return 0;
        }
      });
  }, [places, filterOptions]);

  const rowVirtualizer = useVirtualizer({
    count: filteredPlaces.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated height of each place card
    overscan: 5,
  });

  return (
    <div className="space-y-4">
      <PlaceFilters
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
      />
      
      <ScrollArea className="h-[calc(100vh-22rem)]" ref={parentRef}>
        <Droppable droppableId={categoryId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="p-1"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const place = filteredPlaces[virtualRow.index];
                return (
                  <Draggable key={place.id} draggableId={place.id} index={virtualRow.index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <PlaceCard
                          place={place}
                          isFavorite={favorites.has(place.id)}
                          onToggleFavorite={onToggleFavorite}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </ScrollArea>
    </div>
  );
};
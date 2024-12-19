import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Place } from '@/types/place';
import { FilterOptions } from '@/types/filters';
import { PlaceCard } from './PlaceCard';
import { PlaceFilters } from './PlaceFilters';

interface PlacesListProps {
  places: Place[];
  categoryId: string;
  favorites: Set<string>;
  onToggleFavorite: (placeId: string) => void;
  filterOptions: FilterOptions;
  onFilterChange: (newOptions: Partial<FilterOptions>) => void;
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

  console.log('PlacesList - Initial places:', places);
  console.log('PlacesList - Filter options:', filterOptions);

  const filteredPlaces = React.useMemo(() => {
    const filtered = places
      .filter(place => {
        const meetsPrice = place.priceLevel >= filterOptions.minPrice &&
                          place.priceLevel <= filterOptions.maxPrice;
        const meetsRating = place.rating >= filterOptions.minRating;
        
        console.log('Filtering place:', {
          name: place.name,
          priceLevel: place.priceLevel,
          rating: place.rating,
          meetsPrice,
          meetsRating
        });
        
        return meetsPrice && meetsRating;
      })
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

    console.log('PlacesList - Filtered places:', filtered);
    return filtered;
  }, [places, filterOptions]);

  const rowVirtualizer = useVirtualizer({
    count: filteredPlaces.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  if (places.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No places found in this area
      </div>
    );
  }

  if (filteredPlaces.length === 0) {
    return (
      <div className="space-y-4">
        <PlaceFilters
          filterOptions={filterOptions}
          onFilterChange={onFilterChange}
        />
        <div className="text-center py-8 text-muted-foreground">
          No places match the current filters
        </div>
      </div>
    );
  }

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
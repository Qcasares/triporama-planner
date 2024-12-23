import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ScrollArea } from '../ui/scroll-area';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Place } from '../../types/place';
import { FilterOptions } from '../../types/filters';
import { PlaceCard } from './PlaceCard';
import { PlaceFilters } from './PlaceFilters';
import { cn } from '../../lib/utils';

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
  const [isFiltering, setIsFiltering] = React.useState(false);

  const filteredPlaces = React.useMemo(() => {
    setIsFiltering(true);
    const filtered = places
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
    setTimeout(() => setIsFiltering(false), 300);
    return filtered;
  }, [places, filterOptions]);

  const rowVirtualizer = useVirtualizer({
    count: filteredPlaces.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  return (
    <div className={cn(
      "space-y-4 transition-all duration-300",
      "motion-safe:animate-fade-in"
    )}>
      <div className="motion-safe:animate-slide-up" style={{ animationDelay: '100ms' }}>
        <PlaceFilters
          filterOptions={filterOptions}
          onFilterChange={onFilterChange}
        />
      </div>
      
      <ScrollArea 
        className={cn(
          "h-[calc(100vh-22rem)]",
          "rounded-lg border border-border/50",
          "shadow-sm hover:shadow-md",
          "transition-all duration-300"
        )} 
        ref={parentRef}
      >
        <Droppable droppableId={categoryId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "p-1 transition-colors duration-300",
                snapshot.isDraggingOver && "bg-muted/50"
              )}
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                const place = filteredPlaces[virtualRow.index];
                return (
                  <Draggable key={place.id} draggableId={place.id} index={virtualRow.index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          "transition-all duration-300",
                          snapshot.isDragging && "z-50"
                        )}
                        style={{
                          ...provided.draggableProps.style,
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transform: `translateY(${virtualRow.start}px)`,
                          opacity: isFiltering ? 0 : 1,
                          transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out',
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <div className={cn(
                          "p-1 transition-transform duration-300",
                          "motion-safe:animate-slide-up",
                          snapshot.isDragging && "scale-105 rotate-1"
                        )}>
                          <PlaceCard
                            place={place}
                            isFavorite={favorites.has(place.id)}
                            onToggleFavorite={onToggleFavorite}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
              {filteredPlaces.length === 0 && !isFiltering && (
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  "text-muted-foreground text-center p-8",
                  "motion-safe:animate-fade-in"
                )}>
                  <p>No places match your filters</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </ScrollArea>
    </div>
  );
};

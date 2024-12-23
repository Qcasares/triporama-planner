import React from 'react';
import { Location } from '../types/location';
import { LocationCard } from './locations/LocationCard';
import { LocationCardSkeleton } from './locations/LocationCardSkeleton';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Plus, MapPin } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '../lib/utils';

interface SidebarProps {
  locations: Location[];
  selectedLocation?: Location;
  loading?: boolean;
  onAddLocation?: () => void;
  onRemoveLocation?: (id: string) => void;
  onSelectLocation?: (location: Location) => void;
  onReorderLocations?: (startIndex: number, endIndex: number) => void;
  onUpdateDates?: (locationId: string, startDate?: Date, endDate?: Date) => void;
  isSummaryOpen?: boolean;
  toggleSummary?: () => void;
}

export const Sidebar = ({
  locations,
  selectedLocation,
  loading = false,
  onAddLocation,
  onRemoveLocation,
  onSelectLocation,
  onReorderLocations,
  onUpdateDates,
  isSummaryOpen,
  toggleSummary,
}: SidebarProps) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorderLocations) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    onReorderLocations(sourceIndex, destinationIndex);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white transition-smooth">
      <div className="flex items-center justify-between p-4 md:p-6 border-b">
        <div className="motion-safe:animate-slide-up">
          <h2 className="text-lg font-semibold text-foreground">Your Trip</h2>
          <p className="text-sm text-muted-foreground mt-1 transition-all">
            {locations.length} {locations.length === 1 ? 'destination' : 'destinations'}
          </p>
        </div>
        {onAddLocation && (
          <Button
            onClick={onAddLocation}
            className={cn(
              "transition-smooth motion-safe:animate-slide-up",
              "bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95",
              "shadow-sm hover:shadow-md"
            )}
          >
            <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            Add Stop
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="space-y-4 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-in fade-in-50 slide-in-from-left-5" style={{ animationDelay: `${i * 100}ms` }}>
                <LocationCardSkeleton />
              </div>
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center motion-safe:animate-fade-in">
            <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4 floating-animation" />
            <h3 className="font-medium mb-2 motion-safe:animate-slide-up" style={{ animationDelay: '100ms' }}>
              No destinations yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4 motion-safe:animate-slide-up" style={{ animationDelay: '200ms' }}>
              Start planning your trip by adding your first destination
            </p>
            {onAddLocation && (
              <Button
                onClick={onAddLocation}
                variant="outline"
                className={cn(
                  "transition-smooth motion-safe:animate-slide-up",
                  "hover:bg-primary hover:text-primary-foreground",
                  "hover:scale-105 active:scale-95",
                  "shadow-sm hover:shadow-md"
                )}
                style={{ animationDelay: '300ms' }}
              >
                <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                Add First Stop
              </Button>
            )}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="locations">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 p-4"
                >
                  {locations.map((location, index) => (
                    <Draggable
                      key={location.id}
                      draggableId={location.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "transition-all duration-300",
                            "hover:z-10",
                            snapshot.isDragging && "scale-105 shadow-lg rotate-1"
                          )}
                          style={{
                            ...provided.draggableProps.style,
                            animationDelay: `${index * 50}ms`,
                          }}
                        >
                          <LocationCard
                            location={location}
                            isSelected={selectedLocation?.id === location.id}
                            isStart={index === 0}
                            isEnd={index === locations.length - 1}
                            onSelect={() => onSelectLocation?.(location)}
                            onRemove={() => onRemoveLocation?.(location.id)}
                            onUpdateDates={onUpdateDates}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </ScrollArea>
    </div>
  );
};

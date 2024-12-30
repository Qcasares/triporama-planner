import React from 'react';
import { Location } from '../../types/location';
import { LocationCard } from '../locations/LocationCard';
import { LocationGroup } from '../locations/LocationGroup';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '../../lib/utils';
import { startOfDay } from 'date-fns';

interface LocationListProps {
  locations: Location[];
  selectedLocation?: Location;
  groupByDay: boolean;
  onSelectLocation?: (location: Location) => void;
  onRemoveLocation?: (id: string) => void;
  onReorderLocations?: (startIndex: number, endIndex: number) => void;
  onUpdateDates?: (locationId: string, startDate?: Date, endDate?: Date) => void;
}

export const LocationList: React.FC<LocationListProps> = ({
  locations,
  selectedLocation,
  groupByDay,
  onSelectLocation,
  onRemoveLocation,
  onReorderLocations,
  onUpdateDates,
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorderLocations) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;
    onReorderLocations(sourceIndex, destinationIndex);
  };

  const groupedLocations = React.useMemo(() => {
    if (!groupByDay) return null;

    const groups = new Map<string, Location[]>();
    locations.forEach(location => {
      if (!location?.startDate) return;
      const day = startOfDay(new Date(location.startDate)).toISOString();
      const group = groups.get(day) || [];
      groups.set(day, [...group, location]);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, locs]) => ({
        date: new Date(day),
        locations: locs
      }));
  }, [locations, groupByDay]);

  const ungroupedLocations = React.useMemo(() => {
    if (!groupByDay) return [];
    return locations.filter(location => !location?.startDate);
  }, [locations, groupByDay]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="locations">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-1.5 min-h-[50px]"
          >
            {groupByDay ? (
              <>
                {groupedLocations?.map((group) => (
                  <LocationGroup
                    key={group.date.toISOString()}
                    date={group.date}
                    locations={group.locations}
                    selectedLocation={selectedLocation}
                    onSelectLocation={onSelectLocation}
                    onRemoveLocation={onRemoveLocation}
                    onUpdateDates={onUpdateDates}
                  />
                ))}
                {ungroupedLocations.length > 0 && (
                  <div className="mt-4">
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                      Unscheduled
                    </div>
                    <div className="mt-1 space-y-1">
                      {ungroupedLocations.map((location) => (
                        <LocationCard
                          key={location.id}
                          location={location}
                          isSelected={selectedLocation?.id === location.id}
                          onSelect={() => onSelectLocation?.(location)}
                          onRemove={() => onRemoveLocation?.(location.id)}
                          onUpdateDates={onUpdateDates}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              locations.map((location, index) => (
                <Draggable key={location.id} draggableId={location.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(
                        'transition-all duration-300',
                        'hover:z-10',
                        snapshot.isDragging && 'scale-105 shadow-lg rotate-1'
                      )}
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
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
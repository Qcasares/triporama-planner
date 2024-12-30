import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Location } from '../../../types/location';
import { LocationCard } from '../../locations/LocationCard';
import { cn } from '../../../lib/utils';

interface DraggableLocationsProps {
  locations: Location[];
  selectedLocation?: Location;
  onSelectLocation?: (location: Location) => void;
  onRemoveLocation?: (id: string) => void;
  onUpdateDates?: (locationId: string, startDate?: Date, endDate?: Date) => void;
}

export const DraggableLocations = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onRemoveLocation,
  onUpdateDates
}: DraggableLocationsProps) => (
  <>
    {locations.map((location, index) => (
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
    ))}
  </>
);
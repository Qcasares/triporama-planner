import React from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { ScrollArea } from '../ui/scroll-area';
import { Location } from '@/types/location';
import { LocationItem } from './LocationItem';

interface LocationListProps {
  locations: Location[];
  onRemoveLocation: (locationId: string) => void;
  onReorderLocations: (startIndex: number, endIndex: number) => void;
  onUpdateDates: (locationId: string, startDate?: Date, endDate?: Date) => void;
}

export const LocationList = ({
  locations,
  onRemoveLocation,
  onReorderLocations,
  onUpdateDates,
}: LocationListProps) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    onReorderLocations(sourceIndex, destinationIndex);
  };

  return (
    <ScrollArea className="flex-1 px-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="locations">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="space-y-3"
            >
              {locations.map((location, index) => (
                <LocationItem
                  key={location.id}
                  location={location}
                  index={index}
                  onRemoveLocation={onRemoveLocation}
                  onUpdateDates={onUpdateDates}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </ScrollArea>
  );
};
import React from 'react';
import { Location } from '../../types/location';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { GroupedLocations } from './LocationList/GroupedLocations';
import { DraggableLocations } from './LocationList/DraggableLocations';

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
              <GroupedLocations
                locations={locations}
                selectedLocation={selectedLocation}
                onSelectLocation={onSelectLocation}
                onRemoveLocation={onRemoveLocation}
                onUpdateDates={onUpdateDates}
              />
            ) : (
              <DraggableLocations
                locations={locations}
                selectedLocation={selectedLocation}
                onSelectLocation={onSelectLocation}
                onRemoveLocation={onRemoveLocation}
                onUpdateDates={onUpdateDates}
              />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
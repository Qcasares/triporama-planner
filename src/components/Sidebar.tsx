import React from 'react';
import { ChevronLeft, GripVertical, Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { LocationSearch } from './LocationSearch';
import { Location } from './TripPlanner';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  locations: Location[];
  onAddLocation: (location: Location) => void;
  onRemoveLocation: (locationId: string) => void;
  onReorderLocations: (startIndex: number, endIndex: number) => void;
}

export const Sidebar = ({
  isOpen,
  onToggle,
  locations,
  onAddLocation,
  onRemoveLocation,
  onReorderLocations,
}: SidebarProps) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onReorderLocations(result.source.index, result.destination.index);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 h-screen w-96 transform bg-background transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-full flex-col border-r">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Trip Itinerary</h2>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <LocationSearch onLocationSelect={onAddLocation} />
        </div>

        <ScrollArea className="flex-1 px-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="locations">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
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
                          className={cn(
                            'group mb-3 rounded-lg border bg-card p-4 shadow-sm transition-all',
                            snapshot.isDragging && 'rotate-2 scale-105'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab text-muted-foreground hover:text-foreground"
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{location.name}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onRemoveLocation(location.id)}
                              className="opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ScrollArea>
      </div>
    </aside>
  );
};
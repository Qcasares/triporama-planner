import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const handleAddLocation = () => {
    // In a real app, this would use the Google Places Autocomplete
    const newLocation: Location = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Location",
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
    };
    onAddLocation(newLocation);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onReorderLocations(result.source.index, result.destination.index);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out",
        isOpen ? "w-96" : "w-0"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-10 top-4 bg-white shadow-md"
        onClick={onToggle}
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>

      <div className={cn("h-full overflow-hidden", !isOpen && "hidden")}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Trip Planner</h2>
            <Button onClick={handleAddLocation} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="locations">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {locations.map((location, index) => (
                    <Draggable
                      key={location.id}
                      draggableId={location.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="location-card group"
                        >
                          <div className="flex items-center justify-between">
                            <Input
                              value={location.name}
                              onChange={() => {}}
                              className="border-0 p-0 text-lg font-medium focus-visible:ring-0"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => onRemoveLocation(location.id)}
                            >
                              <X className="h-4 w-4" />
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
        </div>
      </div>
    </aside>
  );
};
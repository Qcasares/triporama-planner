import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronLeft, ChevronRight, Plus, X, GripVertical, MapPin } from 'lucide-react';
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
        variant="outline"
        size="icon"
        className="absolute -right-12 top-4 bg-white shadow-md rounded-full"
        onClick={onToggle}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      <div className={cn("h-full overflow-hidden", !isOpen && "hidden")}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sage-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-semibold text-sage-900">Trip Planner</h2>
                <p className="text-sm text-sage-500">Plan your perfect journey</p>
              </div>
              <Button onClick={handleAddLocation} size="icon" className="rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="locations">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {locations.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="w-12 h-12 text-sage-300 mx-auto mb-4" />
                        <p className="text-sage-500">Add your first destination</p>
                      </div>
                    ) : (
                      locations.map((location, index) => (
                        <Draggable
                          key={location.id}
                          draggableId={location.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="location-card group"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-sage-400 hover:text-sage-600 cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical className="h-5 w-5" />
                                </div>
                                <Input
                                  value={location.name}
                                  onChange={() => {}}
                                  className="border-0 p-0 text-lg font-medium focus-visible:ring-0 flex-1"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                  onClick={() => onRemoveLocation(location.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
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
          </div>
        </div>
      </div>
    </aside>
  );
};
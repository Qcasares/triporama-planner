import React from 'react';
import { ChevronLeft, GripVertical, Trash2, Calendar } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { LocationSearch } from './LocationSearch';
import { Location } from './TripPlanner';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  locations: Location[];
  onAddLocation: (location: Location) => void;
  onRemoveLocation: (locationId: string) => void;
  onReorderLocations: (startIndex: number, endIndex: number) => void;
  onUpdateDates: (locationId: string, startDate?: Date, endDate?: Date) => void;
}

export const Sidebar = ({
  isOpen,
  onToggle,
  locations,
  onAddLocation,
  onRemoveLocation,
  onReorderLocations,
  onUpdateDates,
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
                              <div className="text-sm text-muted-foreground mt-1">
                                {location.startDate && (
                                  <span>
                                    {format(location.startDate, 'MMM d, yyyy')}
                                    {location.endDate && ' - '}
                                  </span>
                                )}
                                {location.endDate && (
                                  <span>
                                    {format(location.endDate, 'MMM d, yyyy')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100"
                                >
                                  <Calendar className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="end">
                                <div className="grid gap-2">
                                  <div className="p-2">
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Start Date</h4>
                                      <CalendarComponent
                                        mode="single"
                                        selected={location.startDate}
                                        onSelect={(date) =>
                                          onUpdateDates(location.id, date, location.endDate)
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2 mt-4">
                                      <h4 className="font-medium">End Date</h4>
                                      <CalendarComponent
                                        mode="single"
                                        selected={location.endDate}
                                        onSelect={(date) =>
                                          onUpdateDates(location.id, location.startDate, date)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
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
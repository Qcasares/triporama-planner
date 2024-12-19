import React from 'react';
import { ChevronLeft, GripVertical, Trash2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { LocationSearch } from './LocationSearch';
import { Location } from '@/types/location';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { Sidebar as ShadcnSidebar } from './ui/sidebar';
import { TripSummary } from './TripSummary';

interface SidebarProps {
  locations: Location[];
  onAddLocation: (location: Location) => void;
  onRemoveLocation: (locationId: string) => void;
  onReorderLocations: (startIndex: number, endIndex: number) => void;
  onUpdateDates: (locationId: string, startDate?: Date, endDate?: Date) => void;
  isSummaryOpen: boolean;
  toggleSummary: () => void;
}

export const Sidebar = ({
  locations,
  onAddLocation,
  onRemoveLocation,
  onReorderLocations,
  onUpdateDates,
  isSummaryOpen,
  toggleSummary,
}: SidebarProps) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onReorderLocations(result.source.index, result.destination.index);
  };

  return (
    <ShadcnSidebar>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Trip Itinerary</h2>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronLeft />
            <span className="sr-only">Toggle Sidebar</span>
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

        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={toggleSummary}
          >
            {isSummaryOpen ? (
              <>Hide Trip Summary <ChevronUp className="ml-2 h-4 w-4" /></>
            ) : (
              <>Show Trip Summary <ChevronDown className="ml-2 h-4 w-4" /></>
            )}
          </Button>
          {isSummaryOpen && (
            <div className="mt-4">
              <TripSummary locations={locations} />
            </div>
          )}
        </div>
      </div>
    </ShadcnSidebar>
  );
};
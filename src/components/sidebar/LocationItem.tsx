import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Button } from '../ui/button';
import { Calendar, Trash2, GripVertical } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Location } from '@/types/location';

interface LocationItemProps {
  location: Location;
  index: number;
  onRemoveLocation: (locationId: string) => void;
  onUpdateDates: (locationId: string, startDate?: Date, endDate?: Date) => void;
}

export const LocationItem = ({ location, index, onRemoveLocation, onUpdateDates }: LocationItemProps) => {
  return (
    <Draggable key={location.id} draggableId={location.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            'group rounded-lg border bg-card p-4 shadow-sm transition-all',
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
  );
};
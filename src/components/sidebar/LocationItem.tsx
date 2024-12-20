import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Button } from '../ui/button';
import { Calendar, Trash2, GripVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
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
            'group rounded-lg border bg-card shadow-sm transition-all',
            snapshot.isDragging && 'rotate-2 scale-105'
          )}
        >
          <div className="flex items-center gap-2 p-2">
            <div
              {...provided.dragHandleProps}
              className="cursor-grab text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted/50"
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{location.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Dates</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Start Date</h4>
                    <CalendarComponent
                      mode="single"
                      selected={location.startDate}
                      onSelect={(date) =>
                        onUpdateDates(location.id, date, location.endDate)
                      }
                    />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">End Date</h4>
                    <CalendarComponent
                      mode="single"
                      selected={location.endDate}
                      onSelect={(date) =>
                        onUpdateDates(location.id, location.startDate, date)
                      }
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
              onClick={() => onRemoveLocation(location.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

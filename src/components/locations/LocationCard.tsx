import React from 'react';
import { Location } from '@/types/location';
import { Button } from '@/components/ui/button';
import { Trash2, MapPin, Flag, Star, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface LocationCardProps {
  location: Location;
  isSelected?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  onUpdateDates?: (locationId: string, startDate?: Date, endDate?: Date) => void;
}

export const LocationCard = ({
  location,
  isSelected,
  isStart,
  isEnd,
  onSelect,
  onRemove,
  onUpdateDates,
}: LocationCardProps) => {
  return (
    <div 
      onClick={onSelect}
      className={cn(
        "group relative p-4 rounded-lg border transition-all duration-300",
        "hover:shadow-md hover:border-primary/20 cursor-pointer",
        "animate-in fade-in-50 slide-in-from-left-5",
        isSelected && "border-primary bg-primary/5 shadow-sm"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300",
          isStart ? "bg-success/10 text-success" : 
          isEnd ? "bg-secondary/10 text-secondary" : 
          "bg-primary/10 text-primary"
        )}>
          {isStart ? (
            <Flag className="h-5 w-5" />
          ) : isEnd ? (
            <Star className="h-5 w-5" />
          ) : (
            <MapPin className="h-5 w-5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-lg">{location.name}</div>
          {(location.startDate || location.endDate) && (
            <div className="text-sm text-muted-foreground mt-2 space-y-1">
              {location.startDate && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">From:</span>
                  <span>{format(new Date(location.startDate), 'MMM d, yyyy')}</span>
                </div>
              )}
              {location.endDate && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">To:</span>
                  <span>{format(new Date(location.endDate), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onUpdateDates && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 transition-colors duration-300 hover:bg-primary/10 hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Dates for {location.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Start Date</h4>
                    <CalendarComponent
                      mode="single"
                      selected={location.startDate}
                      onSelect={(date) =>
                        onUpdateDates(location.id, date, location.endDate)
                      }
                      className="rounded-md border shadow-sm"
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
                      className="rounded-md border shadow-sm"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 transition-colors duration-300 hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
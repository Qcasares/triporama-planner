import React from 'react';
import { Location } from '../../types/location';
import { Button } from '../../components/ui/button';
import { Trash2, MapPin, Flag, Star, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Calendar as CalendarComponent } from '../../components/ui/calendar';

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
        "group relative p-4 rounded-lg border transition-smooth",
        "hover:shadow-lg hover:border-primary/30 cursor-pointer",
        "hover:scale-[1.01] active:scale-[0.99]",
        "motion-safe:animate-slide-up",
        isSelected && "border-primary bg-primary/5 shadow-md"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full",
          "transition-all duration-300 group-hover:scale-110",
          "transform-gpu floating-animation",
          isStart ? "bg-success/10 text-success hover:bg-success/20" : 
          isEnd ? "bg-secondary/10 text-secondary hover:bg-secondary/20" : 
          "bg-primary/10 text-primary hover:bg-primary/20"
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
          <div className="font-medium text-lg group-hover:text-primary transition-colors duration-300">
            {location.name}
          </div>
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
                  className={cn(
                    "h-9 w-9 transition-smooth",
                    "hover:bg-primary/10 hover:text-primary hover:scale-110",
                    "active:scale-95 focus:ring-2 focus:ring-primary/30"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="transition-smooth animate-in fade-in-0 zoom-in-95">
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
                      className="rounded-md border shadow-sm transition-smooth hover:shadow-md"
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
                      className="rounded-md border shadow-sm transition-smooth hover:shadow-md"
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
              className={cn(
                "h-9 w-9 transition-smooth",
                "hover:bg-destructive/10 hover:text-destructive hover:scale-110",
                "active:scale-95 focus:ring-2 focus:ring-destructive/30"
              )}
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

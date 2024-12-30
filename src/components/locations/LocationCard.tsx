import React from 'react';
import { Location } from '../../types/location';
import { LocationCardSkeleton } from './LocationCardSkeleton';
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
  isLoading?: boolean;
  showMapPreview?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  onUpdateDates?: (locationId: string, startDate?: Date, endDate?: Date) => void;
}

export const LocationCard = ({
  location,
  isSelected,
  isStart,
  isEnd,
  isLoading = false,
  showMapPreview = false,
  onSelect,
  onRemove,
  onUpdateDates,
}: LocationCardProps) => {
  if (isLoading) {
    return (
      <LocationCardSkeleton 
        variant="initial"
        showMap={showMapPreview}
      />
    );
  }

  return (
    <div 
      onClick={onSelect}
      className={cn(
        "group relative px-3 py-2.5 rounded-lg border transition-smooth",
        "hover:shadow-md hover:border-primary/20 cursor-pointer",
        "hover:scale-[1.005] active:scale-[0.995]",
        "motion-safe:animate-slide-up",
        isSelected && "border-primary/30 bg-primary/[0.03] shadow-sm"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          "transition-all duration-300 group-hover:scale-105",
          "transform-gpu",
          isStart ? "bg-success/5 text-success/70 group-hover:text-success group-hover:bg-success/10" : 
          isEnd ? "bg-secondary/5 text-secondary/70 group-hover:text-secondary group-hover:bg-secondary/10" : 
          "bg-primary/5 text-primary/70 group-hover:text-primary group-hover:bg-primary/10"
        )}>
          {isStart ? (
            <Flag className="h-4 w-4" />
          ) : isEnd ? (
            <Star className="h-4 w-4" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-base group-hover:text-primary transition-colors duration-300">
            {location.name}
          </div>
          {(location.startDate || location.endDate) && (
            <div className="text-xs text-muted-foreground mt-1.5 space-y-0.5">
              {location.startDate && (
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-[11px] uppercase tracking-wide text-muted-foreground/70">From</span>
                  <span>{format(new Date(location.startDate), 'MMM d, yyyy')}</span>
                </div>
              )}
              {location.endDate && (
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-[11px] uppercase tracking-wide text-muted-foreground/70">To</span>
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
                    "h-8 w-8 transition-smooth",
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
                    <h4 className="text-sm font-medium mb-2">Start Date</h4>
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
                    <h4 className="text-sm font-medium mb-2">End Date</h4>
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
                    "h-8 w-8 transition-smooth",
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

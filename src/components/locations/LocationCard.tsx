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
        "hover:shadow-md hover:border-[#0EA5E9]/20 cursor-pointer",
        "animate-in fade-in-50 slide-in-from-left-5",
        isSelected && "border-[#0EA5E9] bg-[#F1F0FB]"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          isStart ? "bg-green-100" : isEnd ? "bg-purple-100" : "bg-blue-100"
        )}>
          {isStart ? (
            <Flag className="h-4 w-4 text-green-600" />
          ) : isEnd ? (
            <Star className="h-4 w-4 text-purple-600" />
          ) : (
            <MapPin className="h-4 w-4 text-blue-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{location.name}</div>
          {(location.startDate || location.endDate) && (
            <div className="text-sm text-muted-foreground mt-1 space-y-1">
              {location.startDate && (
                <div className="flex items-center gap-2">
                  <span>From:</span>
                  <span>{format(new Date(location.startDate), 'MMM d, yyyy')}</span>
                </div>
              )}
              {location.endDate && (
                <div className="flex items-center gap-2">
                  <span>To:</span>
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
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
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
          )}
          
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
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
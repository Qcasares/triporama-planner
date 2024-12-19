import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Location } from '@/types/location';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface LocationPreviewProps {
  location: Location;
}

export const LocationPreview = ({ location }: LocationPreviewProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="location-card group cursor-pointer">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {location.name}
            </h3>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {typeof location.lat === 'number' && typeof location.lng === 'number' ? 
              `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 
              'Coordinates not available'}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 animate-in zoom-in-50">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <h4 className="text-sm font-semibold">{location.name}</h4>
              <p className="text-xs text-muted-foreground">
                {typeof location.lat === 'number' && typeof location.lng === 'number' ? 
                  `Coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 
                  'Coordinates not available'}
              </p>
            </div>
          </div>
          
          {(location.startDate || location.endDate) && (
            <div className="flex items-start gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <div className="text-sm">
                {location.startDate && (
                  <div>
                    Start: {format(new Date(location.startDate), 'PPP')}
                  </div>
                )}
                {location.endDate && (
                  <div>
                    End: {format(new Date(location.endDate), 'PPP')}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Click to view details</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
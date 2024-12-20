import React from 'react';
import { Location } from '@/types/location';
import { format } from 'date-fns';

interface LocationDateDisplayProps {
  location: Location;
}

export const LocationDateDisplay = ({ location }: LocationDateDisplayProps) => {
  if (!location.startDate && !location.endDate) {
    return null;
  }

  return (
    <div className="text-sm text-muted-foreground mt-1 space-y-1">
      {location.startDate && (
        <div className="flex items-center gap-1">
          <span className="text-xs">From:</span>
          <span>{format(new Date(location.startDate), 'MMM d, yyyy')}</span>
        </div>
      )}
      {location.endDate && (
        <div className="flex items-center gap-1">
          <span className="text-xs">To:</span>
          <span>{format(new Date(location.endDate), 'MMM d, yyyy')}</span>
        </div>
      )}
    </div>
  );
};

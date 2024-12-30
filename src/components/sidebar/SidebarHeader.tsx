import React from 'react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Plus } from 'lucide-react';
import { LocationMenu } from '../locations/LocationMenu';
import { cn } from '../../lib/utils';

interface SidebarHeaderProps {
  loading?: boolean;
  locationCount: number;
  onAddLocation?: () => void;
  onSort: () => void;
  onGroup: () => void;
  onDateFilter: () => void;
  onSettings: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  loading = false,
  locationCount,
  onAddLocation,
  onSort,
  onGroup,
  onDateFilter,
  onSettings,
}) => {
  return (
    <div className="flex flex-col px-4 py-3 md:px-5 md:py-4 border-b bg-gray-50/80">
      <div className="flex items-center justify-between">
        <div className="flex-1 motion-safe:animate-slide-up">
          {loading ? (
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-24 bg-gray-100/80" />
              <Skeleton className="h-3.5 w-32 bg-gray-100/80" />
            </div>
          ) : (
            <>
              <h2 className="text-base font-semibold text-foreground">Your Trip</h2>
              <p className="text-xs text-muted-foreground mt-1 transition-all">
                {locationCount} {locationCount === 1 ? 'destination' : 'destinations'}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LocationMenu
            onSort={onSort}
            onGroup={onGroup}
            onDateFilter={onDateFilter}
            onSettings={onSettings}
          />
          {onAddLocation && (
            <Button
              onClick={onAddLocation}
              className={cn(
                "transition-smooth motion-safe:animate-slide-up",
                "bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95",
                "shadow-sm hover:shadow-md"
              )}
            >
              <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
              Add Stop
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
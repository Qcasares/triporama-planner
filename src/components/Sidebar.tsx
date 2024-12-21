import React from 'react';
import { LocationCard } from './locations/LocationCard';
import { LocationCardSkeleton } from './locations/LocationCardSkeleton';
import { ScrollArea } from './ui/scroll-area';
import { MapPin } from 'lucide-react';
import { LocationSearch } from './LocationSearch';
import useTrip from '../hooks/useTrip';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const {
    trip,
    selectedLocation,
    addLocation,
    removeLocation,
    selectLocation,
    updateLocationDates,
    reorderLocations,
    loading,
  } = useTrip();
  const locations = trip?.locations || [];
  const locationCount = locations.length;

  return (
    <div className={`w-full h-full flex flex-col bg-white ${className || ''}`}>
      <div className="flex flex-col gap-4 p-4 md:p-6 border-b">
        <div>
          <h2 className="text-lg font-semibold">Your Trip</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {locationCount} {locationCount === 1 ? 'destination' : 'destinations'}
          </p>
        </div>
        <LocationSearch onLocationSelect={addLocation} />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <LocationCardSkeleton key={i} />
            ))
          ) : locationCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium mb-2">No destinations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start planning your trip by adding your first destination
              </p>
            </div>
          ) : (
            locations.map((location, index) => (
              <LocationCard
                key={location.id}
                location={location}
                isSelected={selectedLocation?.id === location.id}
                isStart={index === 0}
                isEnd={index === locations.length - 1}
                onSelect={() => selectLocation?.(location)}
                onRemove={() => removeLocation?.(location.id)}
                onUpdateDates={(startDate, endDate) =>
                  updateLocationDates?.(
                    location.id,
                    startDate ? new Date(startDate) : undefined,
                    endDate ? new Date(endDate) : undefined
                  )
                }
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
updateConfirm
import React from 'react';
import { Location } from '@/types/location';
import { LocationCard } from './locations/LocationCard';
import { LocationCardSkeleton } from './locations/LocationCardSkeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin } from 'lucide-react';
import { LocationSearch } from './LocationSearch';

interface SidebarProps {
  locations?: Location[];
  selectedLocation?: Location;
  loading?: boolean;
  onAddLocation?: (location: Location) => void;
  onRemoveLocation?: (id: string) => void;
  onSelectLocation?: (location: Location) => void;
  onReorderLocations?: (startIndex: number, endIndex: number) => void;
  onUpdateDates?: (locationId: string, startDate?: Date, endDate?: Date) => void;
  isSummaryOpen?: boolean;
  toggleSummary?: () => void;
  className?: string;
}

export const Sidebar = ({
  locations = [],
  selectedLocation,
  loading = false,
  onAddLocation,
  onRemoveLocation,
  onSelectLocation,
  onReorderLocations,
  onUpdateDates,
  isSummaryOpen,
  toggleSummary,
  className,
}: SidebarProps) => {
  const locationCount = locations?.length || 0;

  return (
    <div className={`w-full h-full flex flex-col bg-white ${className || ''}`}>
      <div className="flex flex-col gap-4 p-4 md:p-6 border-b">
        <div>
          <h2 className="text-lg font-semibold">Your Trip</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {locationCount} {locationCount === 1 ? 'destination' : 'destinations'}
          </p>
        </div>
        <LocationSearch onLocationSelect={onAddLocation || (() => {})} />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <LocationCardSkeleton key={i} />
            ))
          ) : locationCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium mb-2">No destinations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start planning your trip by adding your first destination
              </p>
            </div>
          ) : (
            locations.map((location, index) => (
              <LocationCard
                key={location.id}
                location={location}
                isSelected={selectedLocation?.id === location.id}
                isStart={index === 0}
                isEnd={index === locations.length - 1}
                onSelect={() => onSelectLocation?.(location)}
                onRemove={() => onRemoveLocation?.(location.id)}
                onUpdateDates={onUpdateDates}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

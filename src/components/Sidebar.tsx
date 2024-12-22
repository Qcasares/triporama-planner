import React from 'react';
import { Location } from '@/types/location';
import { LocationCard } from './locations/LocationCard';
import { LocationCardSkeleton } from './locations/LocationCardSkeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';

interface SidebarProps {
  locations?: Location[];
  selectedLocation?: Location;
  loading?: boolean;
  onAddLocation?: () => void;
  onRemoveLocation?: (id: string) => void;
  onSelectLocation?: (location: Location) => void;
  onReorderLocations?: (startIndex: number, endIndex: number) => void;
  onUpdateDates?: (locationId: string, startDate?: Date, endDate?: Date) => void;
  isSummaryOpen?: boolean;
  toggleSummary?: () => void;
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
}: SidebarProps) => {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 md:p-6 border-b">
        <div>
          <h2 className="text-lg font-semibold">Your Trip</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {locations.length} {locations.length === 1 ? 'destination' : 'destinations'}
          </p>
        </div>
        {onAddLocation && (
          <Button
            onClick={onAddLocation}
            className="animate-in fade-in-50 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Stop
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <LocationCardSkeleton key={i} />
            ))
          ) : locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium mb-2">No destinations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start planning your trip by adding your first destination
              </p>
              {onAddLocation && (
                <Button
                  onClick={onAddLocation}
                  variant="outline"
                  className="animate-in fade-in-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Stop
                </Button>
              )}
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
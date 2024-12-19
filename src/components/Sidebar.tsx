import React from 'react';
import { Location } from '@/types/location';
import { LocationCard } from './locations/LocationCard';
import { LocationCardSkeleton } from './locations/LocationCardSkeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SidebarProps {
  locations: Location[];
  selectedLocation?: Location;
  loading?: boolean;
  onAddLocation?: () => void;
  onRemoveLocation?: (id: string) => void;
  onSelectLocation?: (location: Location) => void;
}

export const Sidebar = ({
  locations,
  selectedLocation,
  loading = false,
  onAddLocation,
  onRemoveLocation,
  onSelectLocation,
}: SidebarProps) => {
  return (
    <div className="w-80 border-r bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Locations</h2>
        {onAddLocation && (
          <Button
            size="sm"
            onClick={onAddLocation}
            className="animate-in fade-in-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-4 pr-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <LocationCardSkeleton key={i} />
            ))
          ) : (
            locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                isSelected={selectedLocation?.id === location.id}
                onSelect={() => onSelectLocation?.(location)}
                onRemove={() => onRemoveLocation?.(location.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
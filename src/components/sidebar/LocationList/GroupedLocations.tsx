import React from 'react';
import { Location } from '../../../types/location';
import { LocationGroup } from '../../locations/LocationGroup';
import { LocationCard } from '../../locations/LocationCard';
import { startOfDay } from 'date-fns';

interface GroupedLocationsProps {
  locations: Location[];
  selectedLocation?: Location;
  onSelectLocation?: (location: Location) => void;
  onRemoveLocation?: (id: string) => void;
  onUpdateDates?: (locationId: string, startDate?: Date, endDate?: Date) => void;
}

export const GroupedLocations = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onRemoveLocation,
  onUpdateDates
}: GroupedLocationsProps) => {
  const groupedLocations = React.useMemo(() => {
    const groups = new Map<string, Location[]>();
    locations.forEach(location => {
      if (!location?.startDate) return;
      const day = startOfDay(new Date(location.startDate)).toISOString();
      const group = groups.get(day) || [];
      groups.set(day, [...group, location]);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, locs]) => ({
        date: new Date(day),
        locations: locs
      }));
  }, [locations]);

  const ungroupedLocations = React.useMemo(() => {
    return locations.filter(location => !location?.startDate);
  }, [locations]);

  return (
    <>
      {groupedLocations.map((group) => (
        <LocationGroup
          key={group.date.toISOString()}
          date={group.date}
          locations={group.locations}
          selectedLocation={selectedLocation}
          onSelectLocation={onSelectLocation}
          onRemoveLocation={onRemoveLocation}
          onUpdateDates={onUpdateDates}
        />
      ))}
      {ungroupedLocations.length > 0 && (
        <div className="mt-4">
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
            Unscheduled
          </div>
          <div className="mt-1 space-y-1">
            {ungroupedLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                isSelected={selectedLocation?.id === location.id}
                onSelect={() => onSelectLocation?.(location)}
                onRemove={() => onRemoveLocation?.(location.id)}
                onUpdateDates={onUpdateDates}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
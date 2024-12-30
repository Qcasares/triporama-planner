import React, { useCallback, useState } from 'react';
import { Location, LocationType } from '../types/location';
import { LocationCardSkeleton } from './locations/LocationCardSkeleton';
import { ScrollArea } from './ui/scroll-area';
import { MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SearchBar } from './sidebar/SearchBar';
import { Button } from './ui/button';
import { LocationFilters } from './locations/LocationFilters';
import { TripContext } from '../contexts/TripContext';
import type { TripContextProps } from '../contexts/trip-context-types';
import { useContext } from 'react';
import { LocationList } from './sidebar/LocationList';

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

export const Sidebar: React.FC<SidebarProps> = ({
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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [sortByDate, setSortByDate] = useState(false);
  const [groupByDay, setGroupByDay] = useState(false);
  const context = useContext(TripContext) as TripContextProps;
  const { filters, updateFilters } = context;
  const filteredLocations = context?.filteredLocations || [];

  const handleSort = () => setSortByDate(!sortByDate);
  const handleGroup = () => setGroupByDay(!groupByDay);
  const handleDateFilter = () => setShowDateFilter(!showDateFilter);
  const handleSettings = () => {/* TODO: Implement settings */};
  
  const handleFilterChange = useCallback((newFilters: {
    types: LocationType[];
    minRating: number;
    maxDistance: number;
  }) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  // Ensure locations array exists
  const locationCount = filteredLocations?.length || 0;

  return (
    <div className="w-full h-full flex flex-col bg-white transition-smooth">
      <SidebarHeader
        loading={loading}
        locationCount={locationCount}
        onAddLocation={onAddLocation}
        onSort={handleSort}
        onGroup={handleGroup}
        onDateFilter={handleDateFilter}
        onSettings={handleSettings}
      />
      
      <SearchBar
        searchQuery={searchQuery}
        showDateFilter={showDateFilter}
        onSearchChange={setSearchQuery}
        onToggleDateFilter={() => setShowDateFilter(!showDateFilter)}
      />

      <LocationFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      <ScrollArea className="flex-1 p-3 space-y-3">
        {loading ? (
          <div className="space-y-1.5 p-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <LocationCardSkeleton
                key={i}
                variant="initial"
                className="animate-pulse"
                style={{
                  animationDelay: `${i * 150}ms`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        ) : filteredLocations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center motion-safe:animate-fade-in">
            <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4 floating-animation" />
            <h3 className="text-sm font-medium mb-2 motion-safe:animate-slide-up">
              {searchQuery ? 'No matching destinations' : 'No destinations yet'}
            </h3>
            <p className="text-xs text-muted-foreground mb-4 motion-safe:animate-slide-up">
              {searchQuery
                ? 'Try a different search term'
                : 'Start planning your trip by adding your first destination'}
            </p>
            {onAddLocation && !searchQuery && (
              <Button
                onClick={onAddLocation}
                variant="outline"
                className={cn(
                  'transition-smooth motion-safe:animate-slide-up',
                  'hover:bg-primary hover:text-primary-foreground',
                  'hover:scale-105 active:scale-95',
                  'shadow-sm hover:shadow-md'
                )}
              >
                <MapPin className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                Add First Stop
              </Button>
            )}
          </div>
        ) : (
          <LocationList
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            groupByDay={groupByDay}
            onSelectLocation={onSelectLocation}
            onRemoveLocation={onRemoveLocation}
            onReorderLocations={onReorderLocations}
            onUpdateDates={onUpdateDates}
          />
        )}
      </ScrollArea>
    </div>
  );
};
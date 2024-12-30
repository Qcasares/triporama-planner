<<<<<<< HEAD
import React, { useCallback, useState } from 'react';
import { Location } from '../types/location';
import { LocationCard } from './locations/LocationCard';
=======
import React, { useState, useCallback } from 'react';
import { Location, LocationType } from '../types/location';
>>>>>>> 625d877dec4b9e3659ef64f65eb173881b50e96a
import { LocationCardSkeleton } from './locations/LocationCardSkeleton';
import { ScrollArea } from './ui/scroll-area';
import { MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SearchBar } from './sidebar/SearchBar';
import { Button } from './ui/button';
import { LocationFilters } from './locations/LocationFilters';
import { TripContext, TripContextProps } from '../contexts/TripContext';
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
  const { filters, filteredLocations = [], updateFilters } = useContext(TripContext) as TripContextProps;

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

  return (
    <div className="w-full h-full flex flex-col bg-white transition-smooth">
      <SidebarHeader
        loading={loading}
        locationCount={locations.length}
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
              />
            ))}
          </div>
        ) : filteredLocations.length === 0 ? (
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
<<<<<<< HEAD
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="locations">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-1.5 p-3 min-h-[50px]"
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                      const currentIndex = filteredLocations.findIndex(
                        (loc) => loc.id === selectedLocation?.id
                      );
                      if (currentIndex === -1) return;

                      const nextIndex =
                        e.key === 'ArrowUp'
                          ? Math.max(0, currentIndex - 1)
                          : Math.min(filteredLocations.length - 1, currentIndex + 1);

                      onSelectLocation?.(filteredLocations[nextIndex]);
                    }
                  }}
                  tabIndex={0}
                >
                  {groupByDay ? (
                    <>
                      {groupedLocations?.map((group) => (
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
                            {ungroupedLocations.map((location, index) => (
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
                  ) : (
                    filteredLocations.map((location, index) => (
                      <Draggable key={location.id} draggableId={location.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              'transition-all duration-300',
                              'hover:z-10',
                              snapshot.isDragging && 'scale-105 shadow-lg rotate-1'
                            )}
                            style={{
                              ...provided.draggableProps.style,
                              animationDelay: `${index * 50}ms`,
                            }}
                          >
                            <LocationCard
                              location={location}
                              isSelected={selectedLocation?.id === location.id}
                              isStart={index === 0}
                              isEnd={index === filteredLocations.length - 1}
                              onSelect={() => onSelectLocation?.(location)}
                              onRemove={() => onRemoveLocation?.(location.id)}
                              onUpdateDates={onUpdateDates}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
=======
          <LocationList
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            groupByDay={groupByDay}
            onSelectLocation={onSelectLocation}
            onRemoveLocation={onRemoveLocation}
            onReorderLocations={onReorderLocations}
            onUpdateDates={onUpdateDates}
          />
>>>>>>> 625d877dec4b9e3659ef64f65eb173881b50e96a
        )}
      </ScrollArea>
    </div>
  );
};

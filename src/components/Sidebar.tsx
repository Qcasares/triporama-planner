import React, { useState } from 'react';
import { Location } from '../types/location';
import { LocationCard } from './locations/LocationCard';
import { LocationCardSkeleton } from './locations/LocationCardSkeleton';
import { ScrollArea } from './ui/scroll-area';
import { MapPin } from 'lucide-react';
import { LocationGroup } from './locations/LocationGroup';
import { startOfDay } from 'date-fns';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '../lib/utils';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SearchBar } from './sidebar/SearchBar';
import { Button } from './ui/button';

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
  locations = [], // Set default empty array
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [sortByDate, setSortByDate] = useState(false);
  const [groupByDay, setGroupByDay] = useState(false);

  // Ensure locations is always an array
  const safeLocations = Array.isArray(locations) ? locations : [];

  const handleSort = () => setSortByDate(!sortByDate);
  const handleGroup = () => setGroupByDay(!groupByDay);
  const handleDateFilter = () => setShowDateFilter(!showDateFilter);
  const handleSettings = () => {/* TODO: Implement settings */};

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorderLocations) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;
    onReorderLocations(sourceIndex, destinationIndex);
  };

  let filteredLocations = safeLocations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortByDate) {
    filteredLocations = [...filteredLocations].sort((a, b) => {
      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }

  const groupedLocations = React.useMemo(() => {
    if (!groupByDay) return null;
    
    const groups = new Map<string, Location[]>();
    filteredLocations.forEach(location => {
      if (!location.startDate) return;
      const day = startOfDay(new Date(location.startDate)).toISOString();
      const group = groups.get(day) || [];
      groups.set(day, [...group, location]);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, locations]) => ({
        date: new Date(day),
        locations
      }));
  }, [filteredLocations, groupByDay]);

  const ungroupedLocations = React.useMemo(() => {
    if (!groupByDay) return [];
    return filteredLocations.filter(location => !location.startDate);
  }, [filteredLocations, groupByDay]);

  return (
    <div className="w-full h-full flex flex-col bg-white transition-smooth">
      <SidebarHeader
        loading={loading}
        locationCount={safeLocations.length}
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

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="space-y-1.5 p-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className="animate-in fade-in-50 slide-in-from-left-3" 
                style={{ 
                  animationDelay: `${i * 50}ms`,
                  animationDuration: '200ms'
                }}
              >
                <LocationCardSkeleton />
              </div>
            ))}
          </div>
        ) : filteredLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center motion-safe:animate-fade-in">
            <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4 floating-animation" />
            <h3 className="text-sm font-medium mb-2 motion-safe:animate-slide-up" style={{ animationDelay: '100ms' }}>
              {searchQuery ? 'No matching destinations' : 'No destinations yet'}
            </h3>
            <p className="text-xs text-muted-foreground mb-4 motion-safe:animate-slide-up" style={{ animationDelay: '200ms' }}>
              {searchQuery ? 'Try a different search term' : 'Start planning your trip by adding your first destination'}
            </p>
            {onAddLocation && !searchQuery && (
              <Button
                onClick={onAddLocation}
                variant="outline"
                className={cn(
                  "transition-smooth motion-safe:animate-slide-up",
                  "hover:bg-primary hover:text-primary-foreground",
                  "hover:scale-105 active:scale-95",
                  "shadow-sm hover:shadow-md"
                )}
                style={{ animationDelay: '300ms' }}
              >
                <MapPin className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                Add First Stop
              </Button>
            )}
          </div>
        ) : (
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
                        loc => loc.id === selectedLocation?.id
                      );
                      if (currentIndex === -1) return;
                      
                      const nextIndex = e.key === 'ArrowUp' 
                        ? Math.max(0, currentIndex - 1)
                        : Math.min(filteredLocations.length - 1, currentIndex + 1);
                      
                      onSelectLocation?.(filteredLocations[nextIndex]);
                    }
                  }}
                  tabIndex={0}
                >
                  {groupByDay ? (
                    <>
                      {groupedLocations?.map(group => (
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
                      <Draggable
                        key={location.id}
                        draggableId={location.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "transition-all duration-300",
                              "hover:z-10",
                              snapshot.isDragging && "scale-105 shadow-lg rotate-1"
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
        )}
      </ScrollArea>
    </div>
  );
};

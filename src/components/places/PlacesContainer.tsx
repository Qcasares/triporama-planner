import React, { useState, useEffect, memo } from 'react';
import { Location } from '@/types/location';
import { PlacesList } from './PlacesList';
import { PlacesFilters } from './PlacesFilters';
import { usePlaces } from '@/hooks/use-places';
import { usePlaceFilters } from '@/hooks/use-place-filters';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlacesContainerProps {
  selectedLocation: Location;
  onAddLocation?: (location: Location) => void;
}

export const PlacesContainer = memo(({ 
  selectedLocation,
  onAddLocation 
}: PlacesContainerProps) => {
  const { theme, setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { filterOptions, updateMinRating, updateSortBy } = usePlaceFilters();

  const {
    places,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usePlaces(selectedLocation, {
    category: filterOptions.sortBy,
    searchTerm: debouncedSearchTerm
  });

  const handleFilterChange = (newFilters: {
    minRating: number;
    sortBy: 'rating' | 'distance';
  }) => {
    updateMinRating(newFilters.minRating);
    updateSortBy(newFilters.sortBy);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-4 space-y-4">
        <p className="text-destructive">Error loading places: {error?.message || 'Unknown error'}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Input
            type="text"
            placeholder="Search places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 mr-2"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        <PlacesFilters
          filters={filterOptions}
          onFiltersChange={handleFilterChange}
        />
      </div>

      <div className="flex-1 overflow-auto" onScroll={handleScroll}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading places...</p>
          </div>
        ) : (
          <PlacesList
            places={places}
            onAddLocation={onAddLocation}
          />
        )}
        
        {isFetchingNextPage && (
          <div className="p-4 flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
});

PlacesContainer.displayName = 'PlacesContainer';
import React, { useState, useEffect } from 'react';
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

export const PlacesContainer = ({ 
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

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <Input
          type="search"
          placeholder="Search places..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm transition-all duration-200 focus:ring-2"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="ml-2"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="transition-all duration-300 ease-in-out">
        <PlacesFilters
          filters={filterOptions}
          onFiltersChange={handleFilterChange}
        />
      </div>

      <div 
        className="space-y-4 max-h-[600px] overflow-y-auto pr-2"
        onScroll={handleScroll}
      >
        <PlacesList 
          places={places} 
          isLoading={isLoading}
          error={isError ? error : null}
          onAddToItinerary={onAddLocation}
          isFetchingNext={isFetchingNextPage}
        />
      </div>
    </div>
  );
};

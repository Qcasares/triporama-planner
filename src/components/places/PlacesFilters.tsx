import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export interface FiltersProps {
  filters: {
    minRating: number;
    sortBy: 'rating' | 'distance';
  };
  onFiltersChange: (filters: {
    minRating: number;
    sortBy: 'rating' | 'distance';
  }) => void;
}

export const PlacesFilters = ({ filters, onFiltersChange }: FiltersProps) => {
  const handleRatingChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      minRating: value[0],
    });
  };

  const handleSortChange = (value: 'rating' | 'distance') => {
    onFiltersChange({
      ...filters,
      sortBy: value,
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Minimum Rating: {filters.minRating}
        </label>
        <Slider
          defaultValue={[filters.minRating]}
          max={5}
          step={0.5}
          onValueChange={handleRatingChange}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Sort By</label>
        <Select
          value={filters.sortBy}
          onValueChange={handleSortChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="distance">Distance</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface FiltersProps {
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
  const handleSortByChange = (value: string) => {
    // Validate that the value is one of the allowed options
    if (value === 'rating' || value === 'distance') {
      onFiltersChange({ ...filters, sortBy: value });
    }
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={handleSortByChange}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating" className="text-sm">Rating</SelectItem>
              <SelectItem value="distance" className="text-sm">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Minimum Rating ({filters.minRating.toFixed(1)} stars)</Label>
          <Slider
            value={[filters.minRating]}
            min={0}
            max={5}
            step={0.5}
            onValueChange={([value]) =>
              onFiltersChange({ ...filters, minRating: value })
            }
          />
        </div>
      </div>
    </Card>
  );
};
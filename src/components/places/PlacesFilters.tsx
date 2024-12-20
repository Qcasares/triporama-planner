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
  onFiltersChange: (filters: any) => void;
}

export const PlacesFilters = ({ filters, onFiltersChange }: FiltersProps) => {
  const categories = [
    { value: 'tourist_attraction', label: 'Tourist Attractions' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'lodging', label: 'Hotels' },
    { value: 'shopping_mall', label: 'Shopping' },
  ];

  return (
    <Card className="p-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, sortBy: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Minimum Rating ({filters.minRating.toFixed(1)} stars)</Label>
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
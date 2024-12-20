import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface FiltersProps {
  filters: {
    category: string;
    rating: number;
    distance: number;
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

  // Convert meters to miles for display
  const distanceInMiles = (filters.distance / 1609.34).toFixed(1);

  return (
    <Card className="p-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Minimum Rating ({filters.rating.toFixed(1)} stars)</Label>
          <Slider
            value={[filters.rating]}
            min={0}
            max={5}
            step={0.5}
            onValueChange={([value]) =>
              onFiltersChange({ ...filters, rating: value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Distance ({distanceInMiles} miles)</Label>
          <Slider
            value={[filters.distance / 1000]}
            min={1}
            max={50}
            step={1}
            onValueChange={([value]) =>
              onFiltersChange({ ...filters, distance: value * 1000 })
            }
          />
        </div>
      </div>
    </Card>
  );
};
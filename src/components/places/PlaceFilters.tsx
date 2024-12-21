import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter } from 'lucide-react';

interface FilterOptions {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: 'rating' | 'distance' | 'price';
}

interface PlaceFiltersProps {
  filterOptions: FilterOptions;
  onFilterChange: (newOptions: Partial<FilterOptions>) => void;
}

export const PlaceFilters = ({ filterOptions, onFilterChange }: PlaceFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Sort
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select
              value={filterOptions.sortBy}
              onValueChange={(value) =>
                onFilterChange({ sortBy: value as 'rating' | 'distance' | 'price' })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range</label>
            <div className="pt-2">
              <Slider
                min={1}
                max={4}
                step={1}
                value={[filterOptions.minPrice, filterOptions.maxPrice]}
                onValueChange={([min, max]) =>
                  onFilterChange({ minPrice: min, maxPrice: max })
                }
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-muted-foreground">Budget</span>
                <span className="text-sm text-muted-foreground">Luxury</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Minimum Rating</label>
            <div className="pt-2">
              <Slider
                min={0}
                max={5}
                step={0.5}
                value={[filterOptions.minRating]}
                onValueChange={([value]) =>
                  onFilterChange({ minRating: value })
                }
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-muted-foreground">Any</span>
                <span className="text-sm text-muted-foreground">5 Stars</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
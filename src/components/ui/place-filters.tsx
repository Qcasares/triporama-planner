import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter } from 'lucide-react';

interface PlaceFiltersProps {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: 'rating' | 'distance' | 'price';
  onPriceRangeChange: (min: number, max: number) => void;
  onMinRatingChange: (rating: number) => void;
  onSortByChange: (sortBy: 'rating' | 'distance' | 'price') => void;
}

export const PlaceFilters = ({
  minPrice,
  maxPrice,
  minRating,
  sortBy,
  onPriceRangeChange,
  onMinRatingChange,
  onSortByChange,
}: PlaceFiltersProps) => {
  return (
    <Card className="mb-6 border-sage-100">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-sage-700">
          <Filter className="h-5 w-5" />
          Filters & Sort
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-sage-700" htmlFor="sort-by">
              Sort By
            </label>
            <Select
              value={sortBy}
              onValueChange={(value) => onSortByChange(value as 'rating' | 'distance' | 'price')}
            >
              <SelectTrigger id="sort-by" className="border-sage-200 hover:border-sage-300">
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
            <label className="text-sm font-medium text-sage-700" htmlFor="price-range">
              Price Range
            </label>
            <div className="pt-2">
              <Slider
                id="price-range"
                min={1}
                max={4}
                step={1}
                value={[minPrice, maxPrice]}
                onValueChange={([min, max]) => onPriceRangeChange(min, max)}
                className="w-full"
                aria-label="Price range"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-sage-500">Budget</span>
                <span className="text-sm text-sage-500">Luxury</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-sage-700" htmlFor="min-rating">
              Minimum Rating
            </label>
            <div className="pt-2">
              <Slider
                id="min-rating"
                min={0}
                max={5}
                step={0.5}
                value={[minRating]}
                onValueChange={([value]) => onMinRatingChange(value)}
                className="w-full"
                aria-label="Minimum rating"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-sage-500">Any</span>
                <span className="text-sm text-sage-500">5 Stars</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

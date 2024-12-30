import React from 'react';
import { LocationType } from '../../types/location';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { cn } from '../../lib/utils';

interface LocationFiltersProps {
  filters: {
    types: LocationType[];
    minRating: number;
    maxDistance: number;
  };
  onFilterChange: (filters: {
    types: LocationType[];
    minRating: number;
    maxDistance: number;
  }) => void;
}

const locationTypes = [
  { value: LocationType.ATTRACTION, label: 'Attractions' },
  { value: LocationType.RESTAURANT, label: 'Restaurants' },
  { value: LocationType.HOTEL, label: 'Hotels' },
  { value: LocationType.SHOPPING, label: 'Shopping' },
  { value: LocationType.NATURE, label: 'Nature' },
  { value: LocationType.OTHER, label: 'Other' }
];

export const LocationFilters = ({ filters, onFilterChange }: LocationFiltersProps) => {
  const handleTypeChange = (type: LocationType, checked: boolean) => {
    const newTypes = checked
      ? [...filters.types, type]
      : filters.types.filter(t => t !== type);
    onFilterChange({ ...filters, types: newTypes });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Location Types</h3>
        <div className="space-y-2">
          {locationTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={type.value}
                checked={filters.types.includes(type.value)}
                onCheckedChange={(checked) => 
                  handleTypeChange(type.value, checked === true)
                }
              />
              <label
                htmlFor={type.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Minimum Rating</h3>
        <Slider
          value={[filters.minRating]}
          min={0}
          max={5}
          step={0.5}
          onValueChange={([value]) => 
            onFilterChange({ ...filters, minRating: value })
          }
        />
        <div className="text-sm text-muted-foreground mt-2">
          {filters.minRating} stars and above
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Maximum Distance</h3>
        <Slider
          value={[filters.maxDistance]}
          min={0}
          max={100}
          step={5}
          onValueChange={([value]) => 
            onFilterChange({ ...filters, maxDistance: value })
          }
        />
        <div className="text-sm text-muted-foreground mt-2">
          Within {filters.maxDistance} km
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => onFilterChange({
          types: [],
          minRating: 0,
          maxDistance: 100
        })}
      >
        Clear Filters
      </Button>
    </div>
  );
};

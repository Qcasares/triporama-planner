import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Place } from '@/types/place';
import { FilterOptions } from '@/types/filters';
import { PlacesList } from './PlacesList';

interface PlacesSectionProps {
  loading: boolean;
  categoryPlaces: Place[];
  categoryId: string;
  favorites: Set<string>;
  filterOptions: FilterOptions;
  onToggleFavorite: (placeId: string) => void;
  onFilterChange: (newOptions: Partial<FilterOptions>) => void;
}

export const PlacesSection = ({
  loading,
  categoryPlaces,
  categoryId,
  favorites,
  filterOptions,
  onToggleFavorite,
  onFilterChange,
}: PlacesSectionProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <Skeleton className="h-48 md:h-full" />
              </div>
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <PlacesList
      places={categoryPlaces}
      categoryId={categoryId}
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      filterOptions={filterOptions}
      onFilterChange={onFilterChange}
    />
  );
};
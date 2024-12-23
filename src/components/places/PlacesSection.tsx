import React from 'react';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Place } from '../../types/place';
import { FilterOptions } from '../../types/filters';
import { PlacesList } from './PlacesList';
import { cn } from '../../lib/utils';

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
          <Card 
            key={i}
            className={cn(
              "transition-all duration-500",
              "hover:shadow-lg",
              "motion-safe:animate-slide-up",
              "motion-safe:animate-fade-in"
            )}
            style={{ 
              animationDelay: `${i * 150}ms`,
              opacity: 0,
              animation: `slide-up 0.5s ease-out ${i * 150}ms forwards`
            }}
          >
            <div className="flex flex-col md:flex-row overflow-hidden">
              <div className="md:w-1/3 relative">
                <Skeleton className={cn(
                  "h-48 md:h-full",
                  "loading-shimmer",
                  "animate-pulse"
                )} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent loading-shimmer" />
              </div>
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  <Skeleton className={cn(
                    "h-6 w-2/3",
                    "loading-shimmer",
                    "animate-pulse"
                  )} />
                  <Skeleton className={cn(
                    "h-4 w-1/2",
                    "loading-shimmer",
                    "animate-pulse"
                  )} />
                  <Skeleton className={cn(
                    "h-4 w-3/4",
                    "loading-shimmer",
                    "animate-pulse"
                  )} />
                  <div className="space-y-2">
                    {[1, 2, 3].map((line) => (
                      <Skeleton 
                        key={line}
                        className={cn(
                          "h-4",
                          "loading-shimmer",
                          "animate-pulse"
                        )}
                        style={{ 
                          width: `${Math.random() * 40 + 60}%`,
                          animationDelay: `${line * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      "transition-all duration-300",
      "animate-in fade-in-0 slide-in-from-bottom-5"
    )}>
      <PlacesList
        places={categoryPlaces}
        categoryId={categoryId}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
      />
    </div>
  );
};

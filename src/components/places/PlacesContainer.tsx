import React, { memo } from 'react';
import { Building2, UtensilsCrossed, Landmark, ShoppingBag, Theater } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { PlacesSection } from './PlacesSection';
import { CustomPlaceDialog } from './CustomPlaceDialog';
import { FilterOptions } from '../../types/filters';
import { Location } from '../../types/location';
import { Place } from '../../types/place';
import { cn } from '../../lib/utils';

interface PlacesContainerProps {
  location: Location;
  places: Record<string, Place[]>;
  loading: boolean;
  favorites: Set<string>;
  filterOptions: FilterOptions;
  isCustomPlaceDialogOpen: boolean;
  customPlace: { name: string; type: string; notes: string };
  placeTypes: Record<string, string>;
  onToggleFavorite: (placeId: string) => void;
  onFilterChange: (newOptions: Partial<FilterOptions>) => void;
  onCustomPlaceDialogOpenChange: (open: boolean) => void;
  onCustomPlaceChange: (field: string, value: string) => void;
  onAddCustomPlace: () => void;
  onDragEnd: (result: DropResult) => void;
}

const PlacesContainer = ({
  location,
  places,
  loading,
  favorites,
  filterOptions,
  isCustomPlaceDialogOpen,
  customPlace,
  placeTypes,
  onToggleFavorite,
  onFilterChange,
  onCustomPlaceDialogOpenChange,
  onCustomPlaceChange,
  onAddCustomPlace,
  onDragEnd,
}: PlacesContainerProps) => {
  return (
    <div className="min-h-screen w-full bg-background motion-safe:animate-fade-in">
      <div className="container mx-auto px-4 py-6">
        <div className={cn(
          "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8",
          "motion-safe:animate-slide-up"
        )}>
          <div>
            <h2 className="text-2xl font-bold tracking-tight group">
              Places Near{' '}
              <span className="text-primary transition-colors duration-300">
                {location.name}
              </span>
            </h2>
            <p className="text-muted-foreground mt-1 transition-opacity duration-300">
              Discover the best local spots and attractions
            </p>
          </div>
          <Button 
            className={cn(
              "shrink-0 transition-all duration-300",
              "hover:scale-105 active:scale-95",
              "shadow-sm hover:shadow-md",
              "motion-safe:animate-slide-up"
            )}
            onClick={() => onCustomPlaceDialogOpenChange(true)}
          >
            <Building2 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            Add Custom Place
          </Button>
        </div>

        <CustomPlaceDialog
          open={isCustomPlaceDialogOpen}
          onOpenChange={onCustomPlaceDialogOpenChange}
          customPlace={customPlace}
          onCustomPlaceChange={onCustomPlaceChange}
          onAddCustomPlace={onAddCustomPlace}
          placeTypes={placeTypes}
        />

        <DragDropContext onDragEnd={onDragEnd}>
          <Tabs defaultValue="hotels" className="w-full">
            <TabsList className={cn(
              "w-full inline-flex h-14 items-center justify-center",
              "rounded-lg bg-muted p-1 text-muted-foreground mb-6",
              "shadow-sm transition-all duration-300",
              "motion-safe:animate-slide-up"
            )}>
              {[
                { value: 'hotels', icon: Building2, label: 'Hotels' },
                { value: 'restaurants', icon: UtensilsCrossed, label: 'Restaurants' },
                { value: 'attractions', icon: Landmark, label: 'Attractions' },
                { value: 'shopping', icon: ShoppingBag, label: 'Shopping' },
                { value: 'entertainment', icon: Theater, label: 'Entertainment' }
              ].map(({ value, icon: Icon, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className={cn(
                    "inline-flex items-center justify-center",
                    "whitespace-nowrap rounded-md px-6 py-3",
                    "text-sm font-medium ring-offset-background",
                    "transition-all duration-300",
                    "hover:bg-background/50",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "data-[state=active]:bg-background",
                    "data-[state=active]:text-foreground",
                    "data-[state=active]:shadow-sm",
                    "data-[state=active]:scale-105"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 mr-2",
                    "transition-transform duration-300",
                    "group-hover:scale-110"
                  )} />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(places).map(([category, categoryPlaces], index) => (
              <TabsContent 
                key={category} 
                value={category} 
                className={cn(
                  "mt-6 transition-all duration-300",
                  "data-[state=active]:animate-in",
                  "data-[state=active]:fade-in-0",
                  "data-[state=active]:zoom-in-95"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PlacesSection
                  loading={loading}
                  categoryPlaces={categoryPlaces}
                  categoryId={category}
                  favorites={favorites}
                  filterOptions={filterOptions}
                  onToggleFavorite={onToggleFavorite}
                  onFilterChange={onFilterChange}
                />
              </TabsContent>
            ))}
          </Tabs>
        </DragDropContext>
      </div>
    </div>
  );
};

export default memo(PlacesContainer, (prevProps, nextProps) => {
  if (prevProps.loading !== nextProps.loading) return false;
  if (prevProps.location.id !== nextProps.location.id) return false;
  if (prevProps.isCustomPlaceDialogOpen !== nextProps.isCustomPlaceDialogOpen) return false;
  if (prevProps.favorites.size !== nextProps.favorites.size) return false;
  
  // Compare places
  const prevCategories = Object.keys(prevProps.places);
  const nextCategories = Object.keys(nextProps.places);
  if (prevCategories.length !== nextCategories.length) return false;
  
  return prevCategories.every(category => {
    const prevPlaces = prevProps.places[category];
    const nextPlaces = nextProps.places[category];
    if (prevPlaces.length !== nextPlaces.length) return false;
    return prevPlaces.every((place, index) => place.id === nextPlaces[index].id);
  });
});

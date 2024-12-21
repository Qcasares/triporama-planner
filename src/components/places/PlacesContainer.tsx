import React from 'react';
import { Building2, UtensilsCrossed, Landmark, ShoppingBag, Theater } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DragDropContext } from '@hello-pangea/dnd';
import { PlacesSection } from './PlacesSection';
import { CustomPlaceDialog } from './CustomPlaceDialog';
import { FilterOptions } from '@/types/filters';
import { Location } from '@/types/location';
import { Place } from '@/types/place';

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
  onDragEnd: (result: any) => void;
}

export const PlacesContainer = ({
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
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Places Near {location.name}</h2>
            <p className="text-muted-foreground mt-1">Discover the best local spots and attractions</p>
          </div>
          <Button 
            className="shrink-0"
            onClick={() => onCustomPlaceDialogOpenChange(true)}
          >
            <Building2 className="h-4 w-4 mr-2" />
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
            <TabsList className="w-full inline-flex h-14 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground mb-6">
              <TabsTrigger value="hotels" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                <Building2 className="h-4 w-4 mr-2" />
                Hotels
              </TabsTrigger>
              <TabsTrigger value="restaurants">
                <UtensilsCrossed className="h-4 w-4 mr-2" />
                Restaurants
              </TabsTrigger>
              <TabsTrigger value="attractions">
                <Landmark className="h-4 w-4 mr-2" />
                Attractions
              </TabsTrigger>
              <TabsTrigger value="shopping">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shopping
              </TabsTrigger>
              <TabsTrigger value="entertainment">
                <Theater className="h-4 w-4 mr-2" />
                Entertainment
              </TabsTrigger>
            </TabsList>

            {Object.entries(places).map(([category, categoryPlaces]) => (
              <TabsContent key={category} value={category} className="mt-6">
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
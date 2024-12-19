import React from 'react';
import { MapContainer } from '@/components/MapContainer';
import { Sidebar } from '@/components/Sidebar';
import { TravelRecommendations } from '@/components/TravelRecommendations';
import { CommandMenu } from '@/components/CommandMenu';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useTripPlanner } from '@/hooks/use-trip-planner';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export const TripPlanner = () => {
  const { currentLocation, error: geoError } = useGeolocation();
  const {
    locations,
    selectedLocation,
    isSummaryOpen,
    addLocation,
    removeLocation,
    selectLocation,
    reorderLocations,
    updateDates,
    toggleSummary,
  } = useTripPlanner();

  const { toast } = useToast();

  // Add current location when available
  React.useEffect(() => {
    if (currentLocation && locations.length === 0) {
      addLocation(currentLocation);
    }
  }, [currentLocation, locations.length, addLocation]);

  // Show geolocation errors
  React.useEffect(() => {
    if (geoError) {
      toast({
        title: "Location error",
        description: geoError,
        variant: "destructive",
      });
    }
  }, [geoError, toast]);

  return (
    <div className="flex min-h-screen bg-background">
      <CommandMenu
        locations={locations}
        onAddLocation={addLocation}
        isSummaryOpen={isSummaryOpen}
        toggleSummary={toggleSummary}
      />
      <SidebarProvider>
        <div className="flex w-full">
          <Sidebar
            locations={locations}
            onAddLocation={addLocation}
            onRemoveLocation={removeLocation}
            onReorderLocations={reorderLocations}
            onUpdateDates={updateDates}
            isSummaryOpen={isSummaryOpen}
            toggleSummary={toggleSummary}
          />
          <main className="flex-1 space-y-6 p-8 bg-gray-50/50">
            <div className="rounded-xl overflow-hidden shadow-lg border border-purple-100 bg-white">
              <MapContainer 
                locations={locations} 
                className="h-[400px] w-full transition-all duration-300 hover:shadow-xl"
              />
            </div>
            
            <ScrollArea className="h-[calc(100vh-520px)]">
              <div className="rounded-xl overflow-hidden shadow-lg border border-purple-100 bg-white">
                {selectedLocation ? (
                  <TravelRecommendations location={selectedLocation} />
                ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground bg-white/50 backdrop-blur-sm">
                    Select a location to see travel recommendations
                  </div>
                )}
              </div>
            </ScrollArea>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};
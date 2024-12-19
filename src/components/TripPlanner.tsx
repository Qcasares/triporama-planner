import React from 'react';
import { MapContainer } from '@/components/MapContainer';
import { Sidebar } from '@/components/Sidebar';
import { TravelRecommendations } from '@/components/TravelRecommendations';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useTripPlanner } from '@/hooks/use-trip-planner';
import { useToast } from '@/hooks/use-toast';

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
    <div className="flex min-h-screen bg-sage-50">
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
          <main className="flex-1 p-6">
            <div className="grid grid-rows-[1fr,auto] gap-6 h-[calc(100vh-3rem)]">
              <div className="rounded-xl overflow-hidden shadow-lg border border-sage-100">
                <MapContainer locations={locations} />
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-lg border border-sage-100">
                {selectedLocation ? (
                  <TravelRecommendations location={selectedLocation} />
                ) : (
                  <div className="flex items-center justify-center h-full text-sage-500">
                    Select a location to see travel recommendations
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};
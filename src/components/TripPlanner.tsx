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
import { Location } from '@/types/location';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (currentLocation && locations.length === 0) {
      addLocation(currentLocation);
    }
  }, [currentLocation, locations.length, addLocation]);

  React.useEffect(() => {
    if (geoError) {
      toast({
        title: "Location error",
        description: geoError,
        variant: "destructive",
      });
    }
  }, [geoError, toast]);

  const handleAddLocation = (location: Location) => {
    addLocation(location);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const SidebarContent = () => (
    <Sidebar
      locations={locations}
      selectedLocation={selectedLocation}
      onAddLocation={handleAddLocation}
      onRemoveLocation={removeLocation}
      onSelectLocation={selectLocation}
      onReorderLocations={reorderLocations}
      onUpdateDates={updateDates}
      isSummaryOpen={isSummaryOpen}
      toggleSummary={toggleSummary}
    />
  );

  return (
    <div className="flex min-h-screen bg-background">
      <CommandMenu
        locations={locations}
        onAddLocation={handleAddLocation}
        isSummaryOpen={isSummaryOpen}
        toggleSummary={toggleSummary}
      />
      <SidebarProvider>
        <div className="flex w-full">
          {isMobile ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="fixed left-4 top-4 z-50 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          ) : (
            <SidebarContent />
          )}
          
          <main className="flex-1 space-y-6 p-4 md:p-8 bg-gray-50/50">
            <div className="rounded-xl overflow-hidden shadow-lg border border-purple-100 bg-white">
              <MapContainer 
                locations={locations} 
                className="h-[300px] md:h-[400px] w-full transition-all duration-300 hover:shadow-xl"
              />
            </div>
            
            <ScrollArea className="h-[calc(100vh-450px)] md:h-[calc(100vh-520px)]">
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
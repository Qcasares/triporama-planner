import React from 'react';
import { MapContainer } from '../components/MapContainer';
import { Sidebar } from '../components/Sidebar';
import { TravelRecommendations } from '../components/TravelRecommendations';
import { CommandMenu } from '../components/CommandMenu';
import { NavigationBreadcrumb } from '../components/NavigationBreadcrumb';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { SidebarProvider } from '../components/ui/sidebar';
import { useGeolocation } from '../hooks/use-geolocation';
import { useTripPlanner } from '../hooks/use-trip-planner';
import { useToast } from '../hooks/use-toast';
import { ScrollArea } from '../components/ui/scroll-area';
import { Location } from '../types/location';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Menu, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import { Progress } from '../components/ui/progress';

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
  const [loading, setLoading] = React.useState(true);

  // Initialize with current location
  React.useEffect(() => {
    if (currentLocation && locations.length === 0) {
      addLocation(currentLocation);
      toast({
        title: "Location detected",
        description: "Your current location has been added as the starting point.",
        className: "animate-in fade-in-50",
      });
    }
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [currentLocation, locations.length, addLocation, toast]);

  // Handle geolocation errors
  React.useEffect(() => {
    if (geoError) {
      toast({
        title: "Location access error",
        description: geoError,
        variant: "destructive",
      });
    }
  }, [geoError, toast]);

  const handleAddLocation = React.useCallback((location: Location) => {
    addLocation(location);
    toast({
      title: "Location added",
      description: `${location.name} has been added to your trip.`,
      className: "animate-in fade-in-50 slide-in-from-bottom-5",
    });
    if (isMobile) {
      setIsOpen(false);
    }
  }, [addLocation, isMobile, toast]);

  const SidebarContent = () => (
    <Sidebar
      locations={locations}
      selectedLocation={selectedLocation}
      onAddLocation={() => handleAddLocation({
        id: String(Date.now()),
        name: 'New Location',
        lat: 0,
        lng: 0,
      })}
      onRemoveLocation={removeLocation}
      onSelectLocation={selectLocation}
      onReorderLocations={reorderLocations}
      onUpdateDates={updateDates}
      isSummaryOpen={isSummaryOpen}
      toggleSummary={toggleSummary}
    />
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F1F0FB] p-4">
        <div className="w-full max-w-md space-y-6 animate-in fade-in-50">
          <Progress value={33} className="animate-pulse" />
          <h2 className="text-center text-xl font-semibold tracking-tight text-primary">Loading your trip planner...</h2>
          <p className="text-center text-sm text-muted-foreground">We're getting everything ready for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F1F0FB] animate-in fade-in-50">
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
                  className="fixed left-4 top-4 z-50 md:hidden animate-in fade-in-50 bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 bg-white">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          ) : (
            <div className="w-80 bg-white border-r border-gray-100 shadow-lg">
              <SidebarContent />
            </div>
          )}
          
          <main className="flex-1 space-y-8 p-4 md:p-8">
            <NavigationBreadcrumb />
            
            <div className="rounded-xl overflow-hidden shadow-lg border border-purple-100/50 bg-white transition-all duration-300 hover:shadow-xl animate-in fade-in-50 slide-in-from-bottom-5">
              <MapContainer 
                locations={locations} 
                className="h-[400px] md:h-[500px] lg:h-[600px] w-full transition-all duration-300"
              />
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-lg border border-purple-100/50 bg-white transition-all duration-300 hover:shadow-xl animate-in fade-in-50 slide-in-from-bottom-5">
              {selectedLocation ? (
                <TravelRecommendations location={selectedLocation} />
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center p-6 bg-white/50 backdrop-blur-sm animate-in fade-in-50">
                  <MapPin className="h-8 w-8 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Location</h3>
                  <p className="text-muted-foreground max-w-md">
                    Choose a location from your trip to see personalized travel recommendations
                  </p>
                </div>
              )}
            </div>
          </main>
          
          {!isMobile && (
            <FloatingActionButton 
              onAddLocation={handleAddLocation} 
            />
          )}
        </div>
      </SidebarProvider>
    </div>
  );
};

import { useContext, useState, useEffect, useCallback } from 'react';
import MapContainer from './MapContainer';
import { Sidebar } from './Sidebar';
import { TravelRecommendations } from './TravelRecommendations';
import { CommandMenu } from './CommandMenu';
import { NavigationBreadcrumb } from './NavigationBreadcrumb';
import { FloatingActionButton } from './FloatingActionButton';
import { SidebarProvider } from './ui/sidebar';
import { useGeolocation } from '../hooks/use-geolocation';
import { TripContext } from '../contexts/trip-context';
import type { TripContextProps } from '../contexts/trip-context-types';
import { useToast } from '../hooks/use-toast';
import { useOffline } from '../hooks/use-offline';
import { ScrollArea } from './ui/scroll-area';
import { Location, LocationType } from '../types/location';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, MapPin, Loader2, WifiOff } from 'lucide-react';
import { Button } from './ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';
import { OfflineBanner } from './OfflineBanner';

export const TripPlanner = () => {
  const { currentLocation, error: geoError } = useGeolocation();
  const {
    trip,
    selectedLocation,
    loading: contextLoading,
    error,
    addLocation,
    removeLocation,
    selectLocation,
    reorderLocations,
    updateLocationDates,
  } = useContext(TripContext) as TripContextProps;
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isOffline = useOffline();
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animated loading progress
  useEffect(() => {
    if (contextLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [contextLoading]);

  // Initialize with current location if no locations exist
  useEffect(() => {
    if (currentLocation && trip.locations.length === 0) {
      addLocation(currentLocation);
      toast({
        title: "Location detected",
        description: "Your current location has been added as the starting point.",
        className: "animate-in fade-in-50 slide-in-from-bottom-5",
      });
    }
  }, [currentLocation, trip.locations.length, addLocation, toast]);

  // Handle geolocation errors
  useEffect(() => {
    if (geoError) {
      toast({
        title: "Location access error",
        description: geoError,
        variant: "destructive",
        className: "animate-in fade-in-50 slide-in-from-bottom-5",
      });
    }
  }, [geoError, toast]);

  const handleAddLocation = useCallback((location: Location) => {
    if (isOffline) {
      toast({
        title: "Offline Mode",
        description: "Adding locations is not available while offline.",
        variant: "destructive",
      });
      return;
    }

    const newLocation = {
      ...location,
      type: LocationType.OTHER
    };

    addLocation(newLocation);
    toast({
      title: "Location added",
      description: `${newLocation.name} has been added to your trip.`,
      className: "animate-in fade-in-50 slide-in-from-bottom-5",
    });
    if (isMobile) {
      setIsOpen(false);
    }
  }, [addLocation, isMobile, toast, isOffline]);

  const SidebarContent = () => (
    <Sidebar
      locations={trip.locations}
      selectedLocation={selectedLocation}
      onAddLocation={() => handleAddLocation({
        id: String(Date.now()),
        name: 'New Location',
        lat: 0,
        lng: 0,
        type: LocationType.OTHER
      })}
      onRemoveLocation={removeLocation}
      onSelectLocation={selectLocation}
      onReorderLocations={reorderLocations}
      onUpdateDates={updateLocationDates}
      isSummaryOpen={isSummaryOpen}
      toggleSummary={() => setIsSummaryOpen(prev => !prev)}
    />
  );

  if (contextLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F1F0FB] p-4">
        <div className="w-full max-w-md space-y-6 motion-safe:animate-fade-in">
          <div className="space-y-4">
            <Progress value={progress} className="transition-all duration-300" />
            <div className="h-2 w-full bg-primary/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary/10 transition-all duration-300 animate-pulse"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <h2 className="text-xl font-semibold tracking-tight text-primary">
                Loading your trip planner...
              </h2>
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">
              We're getting everything ready for you
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F1F0FB] motion-safe:animate-fade-in">
      <CommandMenu
        locations={trip.locations}
        onAddLocation={handleAddLocation}
        isSummaryOpen={isSummaryOpen}
        toggleSummary={() => setIsSummaryOpen(prev => !prev)}
      />
      <SidebarProvider>
        <div className="flex w-full">
          {isMobile ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "fixed left-4 top-4 z-50 md:hidden",
                    "motion-safe:animate-slide-up",
                    "bg-white/80 backdrop-blur-sm",
                    "hover:bg-white/90 hover:scale-105",
                    "active:scale-95",
                    "shadow-lg hover:shadow-xl",
                    "transition-all duration-300"
                  )}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 bg-white">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          ) : (
            <div className="w-80 bg-white border-r border-gray-100 shadow-lg motion-safe:animate-slide-in-from-left">
              <SidebarContent />
            </div>
          )}
          
          <main className="flex-1 space-y-8 p-4 md:p-8">
            <div className="motion-safe:animate-slide-up" style={{ animationDelay: '100ms' }}>
              <NavigationBreadcrumb />
            </div>
            
            <div className={cn(
              "rounded-xl overflow-hidden",
              "shadow-lg hover:shadow-xl",
              "border border-purple-100/50 bg-white",
              "transition-all duration-300",
              "motion-safe:animate-slide-up",
              "relative"
            )} style={{ animationDelay: '200ms' }}>
              {isOffline && (
                <div className="absolute inset-0 z-10 bg-black/5 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                    <WifiOff className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-sm text-muted-foreground">
                      Map view is limited in offline mode
                    </p>
                  </div>
                </div>
              )}
              <MapContainer 
                locations={trip.locations} 
                className="h-[400px] md:h-[500px] lg:h-[600px] w-full transition-all duration-300"
              />
            </div>
            
            <div className={cn(
              "rounded-xl overflow-hidden",
              "shadow-lg hover:shadow-xl",
              "border border-purple-100/50 bg-white",
              "transition-all duration-300",
              "motion-safe:animate-slide-up"
            )} style={{ animationDelay: '300ms' }}>
              {selectedLocation ? (
                <TravelRecommendations location={selectedLocation} />
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center p-6 bg-white/50 backdrop-blur-sm motion-safe:animate-fade-in">
                  <MapPin className="h-8 w-8 text-muted-foreground/50 mb-4 floating-animation" />
                  <h3 className="text-xl font-semibold mb-2 motion-safe:animate-slide-up" style={{ animationDelay: '100ms' }}>
                    Select a Location
                  </h3>
                  <p className="text-muted-foreground max-w-md motion-safe:animate-slide-up" style={{ animationDelay: '200ms' }}>
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
      <OfflineBanner />
    </div>
  );
};

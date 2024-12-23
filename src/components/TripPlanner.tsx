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
import { Menu, MapPin, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';

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
  const [progress, setProgress] = React.useState(0);

  // Animated loading progress
  React.useEffect(() => {
    if (loading) {
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
  }, [loading]);

  // Initialize with current location
  React.useEffect(() => {
    if (currentLocation && locations.length === 0) {
      addLocation(currentLocation);
      toast({
        title: "Location detected",
        description: "Your current location has been added as the starting point.",
        className: "animate-in fade-in-50 slide-in-from-bottom-5",
      });
    }
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [currentLocation, locations.length, addLocation, toast]);

  // Handle geolocation errors
  React.useEffect(() => {
    if (geoError) {
      toast({
        title: "Location access error",
        description: geoError,
        variant: "destructive",
        className: "animate-in fade-in-50 slide-in-from-bottom-5",
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
              "motion-safe:animate-slide-up"
            )} style={{ animationDelay: '200ms' }}>
              <MapContainer 
                locations={locations} 
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
    </div>
  );
};

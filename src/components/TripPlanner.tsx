import React from 'react';
import { CommandMenu } from '@/components/CommandMenu';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useTripPlanner } from '@/hooks/use-trip-planner';
import { useToast } from '@/hooks/use-toast';
import { Location } from '@/types/location';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';
import { Sidebar } from '@/components/Sidebar';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { TripHeader } from './trip/TripHeader';
import { TripMap } from './trip/TripMap';
import { TripRecommendations } from './trip/TripRecommendations';
import { MobileSidebar } from './trip/MobileSidebar';
import { ErrorBoundary } from './ErrorBoundary';

export const TripPlanner = () => {
  const { currentLocation, error: geoError } = useGeolocation();
  const {
    locations = [],
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

  React.useEffect(() => {
    if (currentLocation && (!locations || locations.length === 0)) {
      addLocation(currentLocation);
    }
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [currentLocation, locations, addLocation]);

  React.useEffect(() => {
    if (geoError) {
      toast({
        title: "Location error",
        description: geoError,
        variant: "destructive",
      });
    }
  }, [geoError, toast]);

  const handleAddLocation = React.useCallback((location: Location) => {
    if (!location) return;
    
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
    <ErrorBoundary>
      <div className="flex min-h-screen bg-[#F1F0FB] animate-in fade-in-50">
        <CommandMenu
          locations={locations || []}
          onAddLocation={handleAddLocation}
          isSummaryOpen={isSummaryOpen}
          toggleSummary={toggleSummary}
        />
        <SidebarProvider>
          <div className="flex w-full">
            {isMobile ? (
              <MobileSidebar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                locations={locations || []}
                selectedLocation={selectedLocation}
                loading={loading}
                onAddLocation={handleAddLocation}
                onRemoveLocation={removeLocation}
                onSelectLocation={selectLocation}
                onReorderLocations={reorderLocations}
                onUpdateDates={updateDates}
                isSummaryOpen={isSummaryOpen}
                toggleSummary={toggleSummary}
              />
            ) : (
              <div className="w-80 bg-white border-r border-gray-100 shadow-lg">
                <Sidebar
                  locations={locations || []}
                  selectedLocation={selectedLocation}
                  loading={loading}
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
              </div>
            )}
            
            <main className="flex-1 space-y-8 p-4 md:p-8">
              <TripHeader />
              <TripMap locations={locations || []} />
              <TripRecommendations selectedLocation={selectedLocation} />
            </main>
            
            {!isMobile && (
              <FloatingActionButton 
                onAddLocation={handleAddLocation} 
              />
            )}
          </div>
        </SidebarProvider>
      </div>
    </ErrorBoundary>
  );
};
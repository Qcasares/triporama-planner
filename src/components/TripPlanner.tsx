import { useContext, useEffect } from 'react';
import { SidebarProvider } from './ui/sidebar';
import { useGeolocation } from '../hooks/use-geolocation';
import { TripContext } from '../contexts/trip-context';
import type { TripContextProps } from '../contexts/trip-context-types';
import { useIsMobile } from '../hooks/use-mobile';
import { FloatingActionButton } from './FloatingActionButton';
import { Sidebar } from './Sidebar';
import { CommandMenu } from './CommandMenu';
import { OfflineBanner } from './OfflineBanner';
import { LoadingState } from './TripPlanner/LoadingState';
import { MainContent } from './TripPlanner/MainContent';
import { MobileSidebar } from './TripPlanner/MobileSidebar';
import { useTripPlanner } from './TripPlanner/useTripPlanner';

export const TripPlanner = () => {
  const { currentLocation } = useGeolocation();
  const {
    trip,
    selectedLocation,
    loading: contextLoading,
    addLocation,
    removeLocation,
    selectLocation,
    reorderLocations,
    updateLocationDates,
  } = useContext(TripContext) as TripContextProps;

  const isMobile = useIsMobile();
  const {
    isSummaryOpen,
    setIsSummaryOpen,
    isOpen,
    setIsOpen,
    progress,
    setProgress,
    isOffline,
    handleAddLocation
  } = useTripPlanner(currentLocation, addLocation, trip);

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

  if (contextLoading) {
    return <LoadingState progress={progress} />;
  }

  const SidebarContent = () => (
    <Sidebar
      locations={trip.locations}
      selectedLocation={selectedLocation}
      onAddLocation={() => handleAddLocation(currentLocation)}
      onRemoveLocation={removeLocation}
      onSelectLocation={selectLocation}
      onReorderLocations={reorderLocations}
      onUpdateDates={updateLocationDates}
      isSummaryOpen={isSummaryOpen}
      toggleSummary={() => setIsSummaryOpen(prev => !prev)}
    />
  );

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
            <MobileSidebar 
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              SidebarContent={SidebarContent}
            />
          ) : (
            <div className="w-80 bg-white border-r border-gray-100 shadow-lg motion-safe:animate-slide-in-from-left">
              <SidebarContent />
            </div>
          )}
          
          <MainContent 
            locations={trip.locations}
            selectedLocation={selectedLocation}
            isOffline={isOffline}
          />
          
          {!isMobile && (
            <FloatingActionButton 
              onAddLocation={() => handleAddLocation(currentLocation)} 
            />
          )}
        </div>
      </SidebarProvider>
      <OfflineBanner />
    </div>
  );
};
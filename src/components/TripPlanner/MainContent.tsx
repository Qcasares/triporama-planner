import { MapContainer } from '../MapContainer';
import { TravelRecommendations } from '../TravelRecommendations';
import { NavigationBreadcrumb } from '../NavigationBreadcrumb';
import { Location } from '../../types/location';
import { MapPin, WifiOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MainContentProps {
  locations: Location[];
  selectedLocation?: Location;
  isOffline: boolean;
}

export const MainContent = ({ locations, selectedLocation, isOffline }: MainContentProps) => (
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
);
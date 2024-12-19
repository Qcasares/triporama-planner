import React, { useState, useEffect } from 'react';
import { MapContainer } from './MapContainer';
import { Sidebar } from './Sidebar';
import { TravelRecommendations } from './TravelRecommendations';
import { TripSummary } from './TripSummary';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  startDate?: Date;
  endDate?: Date;
}

export const TripPlanner = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${localStorage.getItem('googleMapsApiKey')}`
            );
            const data = await response.json();
            
            if (data.results && data.results[0]) {
              const currentLocation: Location = {
                id: 'current-location',
                name: data.results[0].formatted_address,
                lat: latitude,
                lng: longitude,
              };
              
              setLocations([currentLocation]);
              setSelectedLocation(currentLocation);
              
              toast({
                title: "Location detected",
                description: "Your current location has been added as the starting point.",
              });
            }
          } catch (error) {
            console.error('Error getting location details:', error);
            toast({
              title: "Location error",
              description: "Could not determine your current location.",
              variant: "destructive",
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location access denied",
            description: "Please enable location access to use your current position.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleAddLocation = (location: Location) => {
    setLocations([...locations, location]);
    setSelectedLocation(location);
    toast({
      title: "Location added",
      description: `${location.name} has been added to your trip.`,
    });
  };

  const handleRemoveLocation = (locationId: string) => {
    setLocations(locations.filter((loc) => loc.id !== locationId));
    if (selectedLocation?.id === locationId) {
      setSelectedLocation(null);
    }
  };

  const handleReorderLocations = (startIndex: number, endIndex: number) => {
    const result = Array.from(locations);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setLocations(result);
  };

  const handleUpdateDates = (locationId: string, startDate?: Date, endDate?: Date) => {
    setLocations(locations.map(loc => 
      loc.id === locationId 
        ? { ...loc, startDate, endDate }
        : loc
    ));
  };

  return (
    <div className="flex min-h-screen bg-sage-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        locations={locations}
        onAddLocation={handleAddLocation}
        onRemoveLocation={handleRemoveLocation}
        onReorderLocations={handleReorderLocations}
        onUpdateDates={handleUpdateDates}
      />
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-96' : 'ml-0'}`}>
        <div className="grid grid-rows-[1fr,auto,1fr] gap-6 p-6 h-[calc(100vh-3rem)]">
          <div className="rounded-xl overflow-hidden shadow-lg border border-sage-100">
            <MapContainer locations={locations} />
          </div>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsSummaryOpen(!isSummaryOpen)}
          >
            {isSummaryOpen ? (
              <>Hide Trip Summary <ChevronUp className="ml-2 h-4 w-4" /></>
            ) : (
              <>Show Trip Summary <ChevronDown className="ml-2 h-4 w-4" /></>
            )}
          </Button>

          <div className="rounded-xl overflow-hidden shadow-lg border border-sage-100 bg-white">
            {isSummaryOpen ? (
              <TripSummary locations={locations} />
            ) : (
              selectedLocation ? (
                <TravelRecommendations location={selectedLocation} />
              ) : (
                <div className="flex items-center justify-center h-full text-sage-500">
                  Select a location to see travel recommendations
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
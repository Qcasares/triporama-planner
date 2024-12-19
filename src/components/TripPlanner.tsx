import React, { useState } from 'react';
import { MapContainer } from './MapContainer';
import { Sidebar } from './Sidebar';
import { TravelRecommendations } from './TravelRecommendations';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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

  return (
    <div className="flex min-h-screen bg-sage-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        locations={locations}
        onAddLocation={handleAddLocation}
        onRemoveLocation={handleRemoveLocation}
        onReorderLocations={handleReorderLocations}
      />
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-96' : 'ml-0'}`}>
        <div className="grid grid-rows-2 gap-6 p-6 h-[calc(100vh-3rem)]">
          <div className="rounded-xl overflow-hidden shadow-lg border border-sage-100">
            <MapContainer locations={locations} />
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg border border-sage-100 bg-white">
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
  );
};
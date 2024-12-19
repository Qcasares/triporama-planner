import React, { useState } from 'react';
import { MapContainer } from './MapContainer';
import { Sidebar } from './Sidebar';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toast } = useToast();

  const handleAddLocation = (location: Location) => {
    setLocations([...locations, location]);
    toast({
      title: "Location added",
      description: `${location.name} has been added to your trip.`,
    });
  };

  const handleRemoveLocation = (locationId: string) => {
    setLocations(locations.filter((loc) => loc.id !== locationId));
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
      <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-96' : 'ml-0'}`}>
        <div className="h-[calc(100vh-3rem)] rounded-xl overflow-hidden shadow-lg border border-sage-100">
          <MapContainer locations={locations} />
        </div>
      </main>
    </div>
  );
};
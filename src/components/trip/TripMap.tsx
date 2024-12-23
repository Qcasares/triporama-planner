import React from 'react';
import { MapContainer } from '@/components/MapContainer';
import { Location } from '@/types/location';

interface TripMapProps {
  locations: Location[];
}

export const TripMap = ({ locations }: TripMapProps) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-purple-100/50 bg-white transition-all duration-300 hover:shadow-xl animate-in fade-in-50 slide-in-from-bottom-5">
      <MapContainer 
        locations={locations} 
        className="h-[400px] md:h-[500px] lg:h-[600px] w-full transition-all duration-300"
      />
    </div>
  );
};
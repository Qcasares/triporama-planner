import React from 'react';
import { Location } from './TripPlanner';
import { MapPin } from 'lucide-react';

interface MapContainerProps {
  locations: Location[];
}

export const MapContainer = ({ locations }: MapContainerProps) => {
  return (
    <div className="map-container relative">
      <div className="absolute inset-0 bg-gradient-to-br from-sage-50 to-sage-100 rounded-xl flex items-center justify-center">
        <div className="text-center space-y-4">
          <MapPin className="w-12 h-12 text-sage-500 mx-auto animate-bounce" />
          <div className="space-y-2">
            <p className="text-xl font-semibold text-sage-700">Map Integration Coming Soon</p>
            <p className="text-sage-500 max-w-md mx-auto">
              Add locations from the sidebar to start planning your journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
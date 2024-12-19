import React from 'react';
import { Location } from './TripPlanner';

interface MapContainerProps {
  locations: Location[];
}

export const MapContainer = ({ locations }: MapContainerProps) => {
  return (
    <div className="map-container">
      <div className="absolute inset-0 bg-sage-50 rounded-lg flex items-center justify-center">
        <p className="text-sage-500">Map will be integrated here</p>
      </div>
    </div>
  );
};
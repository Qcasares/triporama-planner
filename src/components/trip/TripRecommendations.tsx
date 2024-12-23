import React from 'react';
import { TravelRecommendations } from '@/components/TravelRecommendations';
import { Location } from '@/types/location';

interface TripRecommendationsProps {
  selectedLocation: Location | null;
}

export const TripRecommendations = ({ selectedLocation }: TripRecommendationsProps) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-purple-100/50 bg-white transition-all duration-300 hover:shadow-xl animate-in fade-in-50 slide-in-from-bottom-5">
      {selectedLocation ? (
        <TravelRecommendations location={selectedLocation} />
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-center p-6 bg-white/50 backdrop-blur-sm animate-in fade-in-50">
          <h3 className="text-xl font-semibold mb-2">Select a Location</h3>
          <p className="text-muted-foreground max-w-md">
            Choose a location from your trip to see personalized travel recommendations
          </p>
        </div>
      )}
    </div>
  );
};
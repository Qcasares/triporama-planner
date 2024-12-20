import React, { useEffect, useState } from 'react';
import { Location } from '@/types/location';
import { ScrollArea } from './ui/scroll-area';
import { TripOverview } from './trip-summary/TripOverview';
import { DetailedDirections } from './trip-summary/DetailedDirections';

interface TripSummaryProps {
  locations: Location[];
}

interface SummaryData {
  totalDistance: string;
  totalDuration: string;
  legs: Array<{
    distance: string;
    duration: string;
    startLocation: string;
    endLocation: string;
    steps: Array<{
      instructions: string;
      distance: string;
      duration: string;
    }>;
  }>;
}

export const TripSummary = ({ locations }: TripSummaryProps) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  useEffect(() => {
    if (locations.length < 2) {
      setSummaryData(null);
      return;
    }

    const calculateRoute = async () => {
      const directionsService = new google.maps.DirectionsService();

      try {
        const waypoints = locations.slice(1, -1).map(location => ({
          location: { lat: location.lat, lng: location.lng },
          stopover: true
        }));

        const result = await directionsService.route({
          origin: { lat: locations[0].lat, lng: locations[0].lng },
          destination: {
            lat: locations[locations.length - 1].lat,
            lng: locations[locations.length - 1].lng
          },
          waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false,
        });

        const legs = result.routes[0].legs;
        const totalDistance = legs.reduce((acc, leg) => acc + leg.distance!.value, 0);
        const totalDuration = legs.reduce((acc, leg) => acc + leg.duration!.value, 0);

        setSummaryData({
          totalDistance: `${(totalDistance / 1000).toFixed(1)} km`,
          totalDuration: formatDuration(totalDuration),
          legs: legs.map(leg => ({
            distance: leg.distance!.text,
            duration: leg.duration!.text,
            startLocation: leg.start_address,
            endLocation: leg.end_address,
            steps: leg.steps.map(step => ({
              instructions: step.instructions.replace(/<[^>]*>/g, ''),
              distance: step.distance!.text,
              duration: step.duration!.text,
            })),
          })),
        });
      } catch (error) {
        console.error('Error calculating route:', error);
      }
    };

    calculateRoute();
  }, [locations]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (!summaryData) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Add at least two locations to see trip summary
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="grid gap-6">
          <TripOverview
            totalDistance={summaryData.totalDistance}
            totalDuration={summaryData.totalDuration}
          />
          <DetailedDirections legs={summaryData.legs} />
        </div>
      </div>
    </ScrollArea>
  );
};
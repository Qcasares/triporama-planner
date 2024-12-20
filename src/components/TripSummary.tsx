import React, { useEffect, useState } from 'react';
import { Location } from '@/types/location';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { MapPin, Clock, Navigation } from 'lucide-react';

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
          <Card>
            <CardHeader>
              <CardTitle>Trip Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Distance</p>
                    <p className="text-2xl font-bold">{summaryData.totalDistance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
                    <p className="text-2xl font-bold">{summaryData.totalDuration}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Directions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {summaryData.legs.map((leg, legIndex) => (
                  <div key={legIndex} className="space-y-4">
                    <div className="flex items-start gap-3 pb-2 border-b">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <h4 className="font-medium">Leg {legIndex + 1}</h4>
                        <p className="text-sm text-muted-foreground">{leg.startLocation}</p>
                        <p className="text-sm text-muted-foreground">to {leg.endLocation}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-muted-foreground">{leg.distance}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{leg.duration}</span>
                        </div>
                      </div>
                    </div>
                    <ol className="space-y-3 list-decimal list-inside ml-4">
                      {leg.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm">
                          <span dangerouslySetInnerHTML={{ __html: step.instructions }} />
                          <div className="text-xs text-muted-foreground ml-6 mt-1">
                            {step.distance} • {step.duration}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};
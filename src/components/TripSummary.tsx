import React, { useEffect, useState } from 'react';
import { Location } from './TripPlanner';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

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
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Distance</p>
                  <p className="text-2xl font-bold">{summaryData.totalDistance}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
                  <p className="text-2xl font-bold">{summaryData.totalDuration}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Day-by-Day Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locations.map((location, index) => (
                  <div key={location.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <h3 className="font-medium">{location.name}</h3>
                    {location.startDate && (
                      <p className="text-sm text-muted-foreground">
                        {format(location.startDate, 'MMM d, yyyy')}
                        {location.endDate && ` - ${format(location.endDate, 'MMM d, yyyy')}`}
                      </p>
                    )}
                    {summaryData.legs[index] && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>Next leg: {summaryData.legs[index].distance} ({summaryData.legs[index].duration})</p>
                      </div>
                    )}
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
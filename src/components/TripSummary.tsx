import React, { useEffect, useState, useCallback } from 'react';
import { Location } from '../types/location';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { useDebouncedEffect } from '../hooks/useDebounce';
import { useDirections } from '../hooks/useDirections';

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
  const [error, setError] = useState<string | null>(null);
  const { getRoute } = useDirections();

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  useDebouncedEffect(() => {
    if (locations.length < 2) {
      setSummaryData(null);
      return;
    }

    const calculateRoute = async () => {
      try {
        const result = await getRoute(locations);
        
        if (!result) {
          throw new Error('No route data received');
        }

        const { totalDistance, totalDuration, legs } = result;
        
        setSummaryData({
          totalDistance: `${(totalDistance / 1000).toFixed(1)} km`,
          totalDuration: formatDuration(totalDuration),
          legs: legs.map(leg => ({
            distance: leg.distance.text,
            duration: leg.duration.text,
            startLocation: leg.start_address,
            endLocation: leg.end_address,
          })),
        });
        setError(null);
      } catch (error) {
        setError('Failed to calculate route. Please try again.');
        console.error('Route calculation error:', error);
        setSummaryData(null);
      }
    };

    calculateRoute();
  }, [locations, getRoute, formatDuration], 500);

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

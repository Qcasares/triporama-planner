import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { useDebouncedEffect } from '../hooks/useDebounce';
import { useDirections } from '../hooks/useDirections';
import { useTrip } from '../hooks/useTrip';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { MapIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { Badge } from './ui/badge';

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

const TripSummarySkeleton = () => (
  <div className="p-6 space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.join(' ');
};

export const TripSummary = () => {
  const { trip } = useTrip();
  const [summaryData, setSummaryData] = React.useState<SummaryData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);
  const { getRoute } = useDirections();

  const locations = useMemo(() => trip.locations, [trip.locations]);

  useDebouncedEffect(() => {
    if (locations.length < 2) {
      setSummaryData(null);
      setError(null);
      return;
    }

    const calculateRoute = async () => {
      setIsCalculating(true);
      try {
        const result = await getRoute(locations);
        
        if (!result) {
          throw new Error('No route data received');
        }

        const { routes, totalDistance, totalDuration } = result;
        const legs = routes[0].legs;
        
        setSummaryData({
          totalDistance: `${(totalDistance / 1000).toFixed(1)} km`,
          totalDuration: formatDuration(totalDuration),
          legs: legs.map(leg => ({
            distance: `${(leg.distance / 1000).toFixed(1)} km`,
            duration: formatDuration(leg.duration),
            startLocation: leg.start_address,
            endLocation: leg.end_address,
          })),
        });
        setError(null);
      } catch (err) {
        setError('Failed to calculate route. Please try again.');
        console.error('Route calculation error:', err);
        setSummaryData(null);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateRoute();
  }, [locations, getRoute], 500);

  if (locations.length < 2) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <MapIcon className="mx-auto h-12 w-12 opacity-50" />
          <p>Add at least two locations to see trip summary</p>
        </div>
      </div>
    );
  }

  if (isCalculating) {
    return <TripSummarySkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!summaryData) {
    return null;
  }

  const totalDays = locations.reduce((total, location) => {
    if (location.startDate && location.endDate) {
      const days = Math.ceil(
        (location.endDate.getTime() - location.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return total + days;
    }
    return total;
  }, 0);

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-5 w-5" />
                Trip Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Distance</p>
                  <p className="text-2xl font-bold">{summaryData.totalDistance}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
                  <p className="text-2xl font-bold">{summaryData.totalDuration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Destinations</p>
                  <p className="text-2xl font-bold">{locations.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Days</p>
                  <p className="text-2xl font-bold">{totalDays || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Itinerary Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {locations.map((location, index) => (
                  <div
                    key={location.id}
                    className="relative border-b last:border-0 pb-6 last:pb-0"
                  >
                    {index > 0 && (
                      <div className="absolute -top-3 left-0">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          {summaryData.legs[index - 1].duration}
                        </Badge>
                      </div>
                    )}
                    <div className="mt-2">
                      <h3 className="font-medium text-lg">{location.name}</h3>
                      {location.startDate && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <CalendarIcon className="h-4 w-4" />
                          {format(location.startDate, 'MMM d, yyyy')}
                          {location.endDate && ` - ${format(location.endDate, 'MMM d, yyyy')}`}
                        </p>
                      )}
                      {location.type && (
                        <Badge variant="outline" className="mt-2">
                          {location.type}
                        </Badge>
                      )}
                    </div>
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

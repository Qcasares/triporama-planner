import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, Clock } from 'lucide-react';

interface TripOverviewProps {
  totalDistance: string;
  totalDuration: string;
}

export const TripOverview = ({ totalDistance, totalDuration }: TripOverviewProps) => {
  return (
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
              <p className="text-2xl font-bold">{totalDistance}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
              <p className="text-2xl font-bold">{totalDuration}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
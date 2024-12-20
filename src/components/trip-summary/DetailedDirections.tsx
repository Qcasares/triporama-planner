import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RouteLeg } from './RouteLeg';

interface DetailedDirectionsProps {
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

export const DetailedDirections = ({ legs }: DetailedDirectionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Directions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {legs.map((leg, index) => (
            <RouteLeg key={index} legIndex={index} {...leg} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

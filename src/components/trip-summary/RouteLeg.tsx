import React from 'react';
import { MapPin } from 'lucide-react';
import { DirectionStep } from './DirectionStep';

interface RouteLegProps {
  legIndex: number;
  startLocation: string;
  endLocation: string;
  distance: string;
  duration: string;
  steps: Array<{
    instructions: string;
    distance: string;
    duration: string;
  }>;
}

export const RouteLeg = ({
  legIndex,
  startLocation,
  endLocation,
  distance,
  duration,
  steps,
}: RouteLegProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 pb-2 border-b">
        <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
        <div>
          <h4 className="font-medium">Leg {legIndex + 1}</h4>
          <p className="text-sm text-muted-foreground">{startLocation}</p>
          <p className="text-sm text-muted-foreground">to {endLocation}</p>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <span className="text-muted-foreground">{distance}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{duration}</span>
          </div>
        </div>
      </div>
      <ol className="space-y-3 list-decimal list-inside ml-4">
        {steps.map((step, stepIndex) => (
          <DirectionStep key={stepIndex} {...step} />
        ))}
      </ol>
    </div>
  );
};
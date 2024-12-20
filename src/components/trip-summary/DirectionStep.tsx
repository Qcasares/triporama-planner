import React from 'react';

interface DirectionStepProps {
  instructions: string;
  distance: string;
  duration: string;
}

export const DirectionStep = ({ instructions, distance, duration }: DirectionStepProps) => {
  return (
    <li className="text-sm">
      <span dangerouslySetInnerHTML={{ __html: instructions }} />
      <div className="text-xs text-muted-foreground ml-6 mt-1">
        {distance} • {duration}
      </div>
    </li>
  );
};

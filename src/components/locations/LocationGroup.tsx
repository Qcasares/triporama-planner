import React from 'react';
import { Location } from '../../types/location';
import { LocationCard } from './LocationCard';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';

interface LocationGroupProps {
  date: Date;
  locations: Location[];
  selectedLocation?: Location;
  onSelectLocation?: (location: Location) => void;
  onRemoveLocation?: (id: string) => void;
  onUpdateDates?: (locationId: string, startDate?: Date, endDate?: Date) => void;
}

export const LocationGroup = ({
  date,
  locations,
  selectedLocation,
  onSelectLocation,
  onRemoveLocation,
  onUpdateDates,
}: LocationGroupProps) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-1"
    >
      <CollapsibleTrigger className={cn(
        "flex items-center w-full px-2 py-1 rounded-md",
        "text-xs font-medium text-muted-foreground",
        "hover:bg-accent/50 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary/10"
      )}>
        <ChevronDown className={cn(
          "h-3 w-3 mr-1 transition-transform",
          !isOpen && "-rotate-90"
        )} />
        <span className="uppercase tracking-wider">
          {format(date, 'EEEE, MMMM d')}
        </span>
        <span className="ml-auto text-muted-foreground/50">
          {locations.length} {locations.length === 1 ? 'stop' : 'stops'}
        </span>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-1">
        {locations.map((location, index) => (
          <LocationCard
            key={location.id}
            location={location}
            isSelected={selectedLocation?.id === location.id}
            isStart={index === 0}
            isEnd={index === locations.length - 1}
            onSelect={() => onSelectLocation?.(location)}
            onRemove={() => onRemoveLocation?.(location.id)}
            onUpdateDates={onUpdateDates}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

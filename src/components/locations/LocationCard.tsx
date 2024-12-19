import React from 'react';
import { Location } from '@/types/location';
import { LocationPreview } from './LocationPreview';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationCardProps {
  location: Location;
  isSelected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
}

export const LocationCard = ({
  location,
  isSelected,
  onSelect,
  onRemove
}: LocationCardProps) => {
  return (
    <div 
      className={cn(
        "group relative transition-all duration-300",
        "hover:translate-y-[-2px]",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={onSelect}
    >
      <LocationPreview location={location} />
      
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -right-2 -top-2 h-6 w-6",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-200",
            "bg-destructive text-destructive-foreground",
            "hover:bg-destructive/90"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
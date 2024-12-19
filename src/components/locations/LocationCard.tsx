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
        "animate-in fade-in-50 slide-in-from-left-5",
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
            "transition-all duration-200",
            "bg-destructive text-destructive-foreground",
            "hover:bg-destructive/90",
            "animate-in zoom-in-50"
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
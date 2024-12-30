import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Location, LocationType } from '@/types/location';

interface FloatingActionButtonProps {
  onAddLocation: (location: Location) => void;
}

export const FloatingActionButton = ({ onAddLocation }: FloatingActionButtonProps) => {
  return (
    <Button
      size="icon"
      className="fixed right-4 bottom-4 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-5 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
      onClick={() => {
        onAddLocation({
          id: String(Date.now()),
          name: 'New Location',
          lat: 0,
          lng: 0,
          type: LocationType.OTHER,
        });
      }}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};
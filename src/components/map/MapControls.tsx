import React from 'react';
import { Button } from '@/components/ui/button';
import { Locate, ZoomIn, ZoomOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapControlsProps {
  onLocate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const MapControls = ({ onLocate, onZoomIn, onZoomOut }: MapControlsProps) => {
  const { toast } = useToast();

  const handleLocate = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }
    onLocate();
  };

  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={handleLocate}
        className="bg-white/90 hover:bg-white shadow-md"
      >
        <Locate className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={onZoomIn}
        className="bg-white/90 hover:bg-white shadow-md"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={onZoomOut}
        className="bg-white/90 hover:bg-white shadow-md"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
};
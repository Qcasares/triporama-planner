import React from 'react';
import { Button } from '@/components/ui/button';
import { Locate, ZoomIn, ZoomOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MAP_CONSTANTS } from '@/config/map-config';

interface MapControlsProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

export const MapControls = ({ mapRef }: MapControlsProps) => {
  const { toast } = useToast();
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);

  React.useEffect(() => {
    if (mapRef.current) {
      setIsMapLoaded(true);
    } else {
      setIsMapLoaded(false);
    }
  }, [mapRef]);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        mapRef.current?.panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        mapRef.current?.setZoom(MAP_CONSTANTS.DEFAULT_ZOOM);
      },
      (error) => {
        toast({
          title: "Error",
          description: "Could not get your current location",
          variant: "destructive",
        });
      }
    );
  };

  const handleZoomIn = () => {
    const currentZoom = mapRef.current?.getZoom() || 0;
    mapRef.current?.setZoom(currentZoom + 1);
  };

  const handleZoomOut = () => {
    const currentZoom = mapRef.current?.getZoom() || 0;
    mapRef.current?.setZoom(currentZoom - 1);
  };

  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={handleLocate}
        className="bg-white/90 hover:bg-white shadow-md"
        disabled={!isMapLoaded}
      >
        <Locate className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={handleZoomIn}
        className="bg-white/90 hover:bg-white shadow-md"
        disabled={!isMapLoaded}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={handleZoomOut}
        className="bg-white/90 hover:bg-white shadow-md"
        disabled={!isMapLoaded}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

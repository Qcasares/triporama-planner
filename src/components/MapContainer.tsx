import React, { useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { useMap } from '@/hooks/use-map';
import { Location } from '@/types/location';
import { cn } from '@/lib/utils';
import { LocationMarkers } from './map/LocationMarkers';
import { DirectionsLayer } from './map/DirectionsLayer';
import { MapClickInfoWindow } from './map/MapClickInfoWindow';
import { MapControls } from './map/MapControls';
import { NoApiKeyWarning } from './map/NoApiKeyWarning';
import { useMapDirections } from '@/hooks/use-map-directions';
import { useMapClick } from '@/hooks/use-map-click';
import { MapErrorBoundary } from './MapErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  defaultMapOptions, 
  defaultCenter, 
  GOOGLE_MAPS_LIBRARIES,
  MAP_CONSTANTS 
} from '@/config/map-config';

interface MapContainerProps {
  locations: Location[];
  className?: string;
  onAddLocation?: (location: Location) => void;
}

const MapSkeleton = () => (
  <div className="relative w-full h-full rounded-xl overflow-hidden">
    <Skeleton className="absolute inset-0" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  </div>
);

export const MapContainer = React.memo(({ 
  locations, 
  className, 
  onAddLocation 
}: MapContainerProps) => {
  const [apiKey] = React.useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const [isLoading, setIsLoading] = useState(true);
  const { mapRef, onMapLoad } = useMap(locations);
  const { directions } = useMapDirections(locations);
  const { clickedLocation, handleMapClick, handleAddLocation, setClickedLocation } = useMapClick(onAddLocation);

  const handleMapLoaded = (map: google.maps.Map) => {
    setIsLoading(false);
    onMapLoad(map);
  };

  if (!apiKey) {
    return <NoApiKeyWarning />;
  }

  return (
    <MapErrorBoundary>
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              <MapSkeleton />
            </motion.div>
          )}
        </AnimatePresence>

        <LoadScript googleMapsApiKey={apiKey} libraries={GOOGLE_MAPS_LIBRARIES}>
          <GoogleMap
            mapContainerClassName={cn(
              "w-full h-full transition-all duration-300",
              isLoading && "opacity-0",
              className
            )}
            center={locations[0] || defaultCenter}
            zoom={MAP_CONSTANTS.DEFAULT_ZOOM}
            options={{
              ...defaultMapOptions,
              styles: [
                {
                  featureType: "all",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#6c7293" }],
                },
                {
                  featureType: "landscape",
                  elementType: "all",
                  stylers: [{ color: "#f2f2f2" }],
                },
                {
                  featureType: "poi",
                  elementType: "all",
                  stylers: [{ visibility: "off" }],
                },
                {
                  featureType: "road",
                  elementType: "all",
                  stylers: [{ saturation: -100 }, { lightness: 45 }],
                },
                {
                  featureType: "road.highway",
                  elementType: "all",
                  stylers: [{ visibility: "simplified" }],
                },
                {
                  featureType: "water",
                  elementType: "all",
                  stylers: [{ color: "#b3d4fc" }, { visibility: "on" }],
                },
              ],
            }}
            onLoad={handleMapLoaded}
            onClick={handleMapClick}
          >
            <LocationMarkers 
              locations={locations} 
              onClick={setClickedLocation} 
            />
            {directions && <DirectionsLayer directions={directions} />}
            {clickedLocation && (
              <MapClickInfoWindow
                location={clickedLocation}
                onClose={() => setClickedLocation(null)}
                onAdd={handleAddLocation}
              />
            )}
            <MapControls mapRef={mapRef} locations={locations} />
          </GoogleMap>
        </LoadScript>
      </div>
    </MapErrorBoundary>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.locations === nextProps.locations &&
    prevProps.onAddLocation === nextProps.onAddLocation &&
    prevProps.className === nextProps.className
  );
});

MapContainer.displayName = 'MapContainer';
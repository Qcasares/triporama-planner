import React, { useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import { useMap } from "@/hooks/use-map";
import { Location } from "@/types/location";
import { cn } from "@/lib/utils";
import { NoApiKeyWarning } from "./map/NoApiKeyWarning";
import { useMapDirections } from "@/hooks/use-map-directions";
import { useMapClick } from "@/hooks/use-map-click";
import { MapErrorBoundary } from "./MapErrorBoundary";
import { motion, AnimatePresence } from "framer-motion";
import { MapSkeleton } from "./map/MapSkeleton";
import { MapContent } from "./map/MapContent";
import { GOOGLE_MAPS_LIBRARIES, defaultCenter } from "@/config/map-config";

interface MapContainerProps {
  locations?: Location[];
  className?: string;
  onAddLocation?: (location: Location) => void;
}

export const MapContainer = React.memo(
  ({ locations = [], className, onAddLocation }: MapContainerProps) => {
    const [apiKey] = React.useState(() => localStorage.getItem("googleMapsApiKey") || "");
    const [isLoading, setIsLoading] = useState(true);
    const { mapRef, onMapLoad } = useMap(locations);
    const { directions } = useMapDirections(locations);
    const { clickedLocation, handleMapClick, handleAddLocation, setClickedLocation } =
      useMapClick(onAddLocation);

    const handleMapLoaded = (map: google.maps.Map) => {
      setIsLoading(false);
      onMapLoad(map);
    };

    if (!apiKey) {
      return <NoApiKeyWarning />;
    }

    // Safely determine initial center
    const initialCenter = locations && locations.length > 0
      ? { lat: locations[0].lat, lng: locations[0].lng }
      : defaultCenter;

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
            <MapContent
              isLoading={isLoading}
              className={className}
              initialCenter={initialCenter}
              locations={locations}
              directions={directions}
              mapRef={mapRef}
              clickedLocation={clickedLocation}
              onMapLoad={handleMapLoaded}
              onMapClick={handleMapClick}
              onLocationClick={setClickedLocation}
              onAddLocation={handleAddLocation}
              onCloseInfoWindow={() => setClickedLocation(null)}
            />
          </LoadScript>
        </div>
      </MapErrorBoundary>
    );
  }
);

MapContainer.displayName = "MapContainer";
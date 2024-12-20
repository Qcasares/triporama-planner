import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { useMap } from '@/hooks/use-map';
import { Location } from '@/types/location';
import { cn } from '@/lib/utils';
import { LocationMarkers } from './LocationMarkers';
import { DirectionsLayer } from './DirectionsLayer';
import { MapClickInfoWindow } from './MapClickInfoWindow';
import { MapControls } from './MapControls';
import { NoApiKeyWarning } from './NoApiKeyWarning';
import { useMapDirections } from '@/hooks/use-map-directions';
import { useMapClick } from '@/hooks/use-map-click';
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

export const MapContainer = ({ locations, className, onAddLocation }: MapContainerProps) => {
  const [apiKey] = React.useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const { mapRef, onMapLoad } = useMap(locations);
  const { directions } = useMapDirections(locations);
  const { clickedLocation, handleMapClick, handleAddLocation, setClickedLocation } = useMapClick(onAddLocation);

  if (!apiKey) {
    return <NoApiKeyWarning />;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={GOOGLE_MAPS_LIBRARIES}>
      <div className="relative">
        <GoogleMap
          mapContainerClassName={cn(
            "w-full rounded-xl overflow-hidden",
            "transition-all duration-300",
            "shadow-lg border border-purple-100/50",
            "h-[500px]",
            "md:h-[600px]",
            className
          )}
          center={locations[0] || defaultCenter}
          zoom={MAP_CONSTANTS.DEFAULT_ZOOM}
          options={defaultMapOptions}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          <MapControls mapRef={mapRef} />

          {directions ? (
            <DirectionsLayer directions={directions} />
          ) : (
            <LocationMarkers locations={locations} />
          )}

          {clickedLocation && (
            <MapClickInfoWindow
              position={{ lat: clickedLocation.lat, lng: clickedLocation.lng }}
              name={clickedLocation.name}
              onClose={() => setClickedLocation(null)}
              onAdd={handleAddLocation}
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};
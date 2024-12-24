import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Location } from '../types/location';
import { useMap } from '../hooks/use-map';
import { useApiKey } from '../hooks/use-api-key';
import { cn } from '../lib/utils';
import { mapStyles } from '../config/map-styles';

interface MapContainerProps {
  locations?: Location[];
  className?: string;
}

const mapOptions: google.maps.MapOptions = {
  styles: mapStyles,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
  mapTypeId: "terrain",
};

const DEFAULT_CENTER = { lat: 0, lng: 0 };
const DEFAULT_ZOOM = 2;

export const MapContainer = ({ locations = [], className }: MapContainerProps) => {
  const { apiKey } = useApiKey();
  const { mapRef } = useMap(locations);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [trafficLayer, setTrafficLayer] = React.useState(false);
  const [transitLayer, setTransitLayer] = React.useState(false);
  const [bicyclingLayer, setBicyclingLayer] = React.useState(false);

  const mapCenter = React.useMemo(() => {
    if (!locations || locations.length === 0) return DEFAULT_CENTER;
    return {
      lat: locations[0].lat,
      lng: locations[0].lng
    };
  }, [locations]);

  if (!apiKey) {
    return (
      <div className={cn(
        "flex items-center justify-center",
        "bg-gray-50/50 rounded-lg border border-gray-200",
        className
      )}>
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold mb-2">API Key Required</h3>
          <p className="text-sm text-gray-600">
            Please set your Google Maps API key to use the map functionality.
          </p>
        </div>
      </div>
    );
  }

  const handleMapLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <LoadScript
        googleMapsApiKey={apiKey}
        loadingElement={
          <div className={cn(
            "flex items-center justify-center",
            "bg-gray-50/50 rounded-lg border border-gray-200",
            "w-full h-full"
          )}>
            <div className="text-center p-4">
              <h3 className="text-lg font-semibold mb-2">Loading Map</h3>
              <p className="text-sm text-gray-600">
                Please wait while we load the map...
              </p>
            </div>
          </div>
        }
      >
        <div className="relative w-full h-full">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={DEFAULT_ZOOM}
            options={mapOptions}
            onLoad={handleMapLoad}
          >
            {/* Map layers */}
            {map && (
              <>
                {trafficLayer && new google.maps.TrafficLayer().setMap(map)}
                {transitLayer && new google.maps.TransitLayer().setMap(map)}
                {bicyclingLayer && new google.maps.BicyclingLayer().setMap(map)}
              </>
            )}
          </GoogleMap>
        </div>
      </LoadScript>
    </div>
  );
};
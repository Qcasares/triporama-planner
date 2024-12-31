import React, { memo, useMemo, useState, useCallback, useEffect } from 'react';
import { Location } from '../types/location';
import { POI, MapMarker, OSRMRoute } from '../types/maps';
import { useMap } from '../hooks/use-map';
import { cn } from '../lib/utils';
import { getTileLayerConfig } from '../services/maps';
import { LocationMarkers } from './map/LocationMarkers';
import DirectionsLayer from './map/DirectionsLayer';

interface MapContainerProps {
  locations?: Location[];
  pois?: POI[];
  customMarkers?: MapMarker[];
  className?: string;
  onMarkerClick?: (location: Location | POI | MapMarker) => void;
  onDirectionsRequest?: (origin: Location, destination: Location) => Promise<OSRMRoute>;
  theme?: 'light' | 'dark';
  centerOnLocation?: Location;
}

const MapContainer = ({ 
  locations = [], 
  pois = [], 
  customMarkers = [],
  className,
  onMarkerClick,
  onDirectionsRequest,
  theme = 'light',
  centerOnLocation
}: MapContainerProps) => {
  const [route, setRoute] = useState<OSRMRoute | undefined>();
  const safeLocations = useMemo(() => 
    Array.isArray(locations) 
      ? locations.filter(loc => loc && typeof loc.lat === 'number' && typeof loc.lng === 'number')
      : [],
    [locations]
  );

  const { mapRef, getDirections, setMapTheme, centerMap } = useMap(safeLocations, getTileLayerConfig());

  useEffect(() => {
    if (theme) {
      setMapTheme(theme);
    }
  }, [theme, setMapTheme]);

  useEffect(() => {
    if (centerOnLocation) {
      centerMap(centerOnLocation);
    }
  }, [centerOnLocation, centerMap]);

  useEffect(() => {
    const handleDirections = async () => {
      if (onDirectionsRequest && safeLocations.length >= 2) {
        const newRoute = await onDirectionsRequest(safeLocations[0], safeLocations[1]);
        setRoute(newRoute);
      }
    };
    handleDirections();
  }, [onDirectionsRequest, safeLocations]);

  return (
    <div className={cn("relative", className)}>
      <div 
        ref={mapRef}
        className="w-full h-full bg-gray-100 rounded-lg"
      >
        <LocationMarkers 
          locations={safeLocations}
          pois={pois}
          customMarkers={customMarkers}
          onMarkerClick={onMarkerClick}
        />
        {route && <DirectionsLayer route={route} />}
      </div>
    </div>
  );
};

export default memo(MapContainer);

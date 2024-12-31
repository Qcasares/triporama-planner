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
  onGetUserLocation?: () => Promise<Location | null>;
}

const MapContainer = ({ 
  locations = [], 
  pois = [], 
  customMarkers = [],
  className,
  onMarkerClick,
  onDirectionsRequest,
  theme = 'light',
  centerOnLocation,
  onGetUserLocation
}: MapContainerProps) => {
  const [route, setRoute] = useState<OSRMRoute | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const safeLocations = useMemo(() => 
    Array.isArray(locations) 
      ? locations.filter(loc => loc && typeof loc.lat === 'number' && typeof loc.lng === 'number')
      : [],
    [locations]
  );

  const { 
    mapRef, 
    mapInstance, 
    getDirections, 
    setMapTheme, 
    centerMap, 
    getUserLocation 
  } = useMap(safeLocations, getTileLayerConfig());

  // Handle map initialization errors
  useEffect(() => {
    if (!mapInstance) {
      setError('Failed to initialize map. Please try again.');
    }
  }, [mapInstance]);

  // Handle theme changes with error handling
  useEffect(() => {
    try {
      if (theme && mapInstance) {
        setMapTheme(theme);
      }
    } catch (error) {
      console.error('Error setting map theme:', error);
      setError('Failed to set map theme.');
    }
  }, [theme, setMapTheme, mapInstance]);

  // Handle center location changes with error handling
  useEffect(() => {
    try {
      if (centerOnLocation && mapInstance) {
        centerMap(centerOnLocation);
      }
    } catch (error) {
      console.error('Error centering map:', error);
      setError('Failed to center map on location.');
    }
  }, [centerOnLocation, centerMap, mapInstance]);

  // Handle directions with loading and error states
  useEffect(() => {
    const handleDirections = async () => {
      if (onDirectionsRequest && safeLocations.length >= 2) {
        try {
          setIsLoading(true);
          setError(null);
          const newRoute = await onDirectionsRequest(safeLocations[0], safeLocations[1]);
          setRoute(newRoute);
        } catch (error) {
          console.error('Error getting directions:', error);
          setError('Failed to get directions. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    handleDirections();
  }, [onDirectionsRequest, safeLocations]);

  // Handle user location with loading and error states
  const handleGetUserLocation = useCallback(async () => {
    if (onGetUserLocation) {
      try {
        setIsLoading(true);
        setError(null);
        const location = await getUserLocation();
        if (location) {
          onGetUserLocation();
        }
      } catch (error) {
        console.error('Error getting user location:', error);
        setError('Failed to get your location. Please ensure location services are enabled.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [getUserLocation, onGetUserLocation]);

  return (
    <div className={cn("relative", className)}>
      {error && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-50">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded z-50">
          Loading...
        </div>
      )}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gray-100 rounded-lg"
      >
        <LocationMarkers 
          locations={safeLocations}
          pois={pois}
          customMarkers={customMarkers}
          onMarkerClick={onMarkerClick}
          map={mapInstance}
        />
        {route && <DirectionsLayer route={route} />}
      </div>
    </div>
  );
};

export default memo(MapContainer);

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
  const [trafficLayer, setTrafficLayer] = React.useState<google.maps.TrafficLayer | null>(null);
  const [transitLayer, setTransitLayer] = React.useState<google.maps.TransitLayer | null>(null);
  const [bicyclingLayer, setBicyclingLayer] = React.useState<google.maps.BicyclingLayer | null>(null);

  const [showTraffic, setShowTraffic] = React.useState(false);
  const [showTransit, setShowTransit] = React.useState(false);
  const [showBicycling, setShowBicycling] = React.useState(false);

  // Handle traffic layer
  React.useEffect(() => {
    if (!map) return;
    
    if (showTraffic) {
      const layer = new google.maps.TrafficLayer();
      layer.setMap(map);
      setTrafficLayer(layer);
    } else {
      if (trafficLayer) {
        trafficLayer.setMap(null);
        setTrafficLayer(null);
      }
    }
  }, [map, showTraffic]);

  // Handle transit layer
  React.useEffect(() => {
    if (!map) return;
    
    if (showTransit) {
      const layer = new google.maps.TransitLayer();
      layer.setMap(map);
      setTransitLayer(layer);
    } else {
      if (transitLayer) {
        transitLayer.setMap(null);
        setTransitLayer(null);
      }
    }
  }, [map, showTransit]);

  // Handle bicycling layer
  React.useEffect(() => {
    if (!map) return;
    
    if (showBicycling) {
      const layer = new google.maps.BicyclingLayer();
      layer.setMap(map);
      setBicyclingLayer(layer);
    } else {
      if (bicyclingLayer) {
        bicyclingLayer.setMap(null);
        setBicyclingLayer(null);
      }
    }
  }, [map, showBicycling]);

  // Ensure locations is always an array
  const safeLocations = Array.isArray(locations) ? locations : [];

  const mapCenter = React.useMemo(() => {
    if (safeLocations.length === 0) return DEFAULT_CENTER;
    
    try {
      const bounds = new google.maps.LatLngBounds();
      safeLocations.forEach(location => {
        if (typeof location.lat === 'number' && typeof location.lng === 'number') {
          bounds.extend({ lat: location.lat, lng: location.lng });
        }
      });
      
      return {
        lat: bounds.getCenter().lat(),
        lng: bounds.getCenter().lng()
      };
    } catch (error) {
      console.error('Error calculating map center:', error);
      return DEFAULT_CENTER;
    }
  }, [safeLocations]);

  const handleMapLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map);
    
    try {
      if (safeLocations.length > 0) {
        const validLocations = safeLocations.filter(
          location => location && 
            typeof location.lat === 'number' && !isNaN(location.lat) &&
            typeof location.lng === 'number' && !isNaN(location.lng)
        );

        if (validLocations.length === 0) {
          map.setCenter(DEFAULT_CENTER);
          map.setZoom(DEFAULT_ZOOM);
          return;
        }

        const bounds = new google.maps.LatLngBounds();
        validLocations.forEach(location => {
          bounds.extend({ lat: location.lat, lng: location.lng });
        });

        map.fitBounds(bounds, 50); // 50px padding
      } else {
        map.setCenter(DEFAULT_CENTER);
        map.setZoom(DEFAULT_ZOOM);
      }
    } catch (error) {
      console.error('Error fitting map bounds:', error);
      // Set default view if bounds fitting fails
      map.setCenter(DEFAULT_CENTER);
      map.setZoom(DEFAULT_ZOOM);
    }
  }, [safeLocations]);

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
            zoom={safeLocations.length === 0 ? DEFAULT_ZOOM : undefined}
            options={mapOptions}
            onLoad={handleMapLoad}
          >
            {/* Map layers are managed by useEffect hooks */}
          </GoogleMap>
        </div>
      </LoadScript>
    </div>
  );
};

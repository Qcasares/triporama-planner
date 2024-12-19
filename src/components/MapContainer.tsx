import React, { useCallback, useMemo, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Location } from './TripPlanner';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { ApiKeyInput } from './ApiKeyInput';

interface MapContainerProps {
  locations: Location[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

export const MapContainer = ({ locations }: MapContainerProps) => {
  const [apiKey] = useState(() => localStorage.getItem('googleMapsApiKey') || '');
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });

  const center = useMemo(() => {
    if (locations.length === 0) return defaultCenter;
    
    const bounds = new google.maps.LatLngBounds();
    locations.forEach(location => {
      bounds.extend({ lat: location.lat, lng: location.lng });
    });
    
    return bounds.getCenter().toJSON();
  }, [locations]);

  const onLoad = useCallback((map: google.maps.Map) => {
    if (locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
    }
  }, [locations]);

  if (!apiKey) {
    return <ApiKeyInput />;
  }

  if (loadError) {
    return (
      <div className="map-container flex items-center justify-center bg-destructive/10">
        <p className="text-destructive">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-container">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className={cn("map-container relative")}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={locations.length === 0 ? 12 : undefined}
        center={center}
        onLoad={onLoad}
        options={{
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#c8d7d4" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }],
            },
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
        }}
      >
        {locations.map((location, index) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            label={{
              text: (index + 1).toString(),
              color: '#ffffff',
              fontWeight: 'bold',
            }}
            title={location.name}
          />
        ))}
      </GoogleMap>
    </div>
  );
};
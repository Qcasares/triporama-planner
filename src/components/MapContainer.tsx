import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
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

// Define libraries array outside component to prevent unnecessary reloads
const libraries: ("places")[] = ["places"];

export const MapContainer = ({ locations }: MapContainerProps) => {
  const [apiKey] = useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const center = useMemo(() => {
    if (locations.length === 0) return defaultCenter;
    
    const bounds = new google.maps.LatLngBounds();
    locations.forEach(location => {
      bounds.extend({ lat: location.lat, lng: location.lng });
    });
    
    return bounds.getCenter().toJSON();
  }, [locations]);

  useEffect(() => {
    if (!isLoaded || locations.length < 2) {
      setDirections(null);
      return;
    }

    const fetchDirections = async () => {
      const directionsService = new google.maps.DirectionsService();
      
      try {
        const waypoints = locations.slice(1, -1).map(location => ({
          location: { lat: location.lat, lng: location.lng },
          stopover: true
        }));

        const result = await directionsService.route({
          origin: { lat: locations[0].lat, lng: locations[0].lng },
          destination: { 
            lat: locations[locations.length - 1].lat, 
            lng: locations[locations.length - 1].lng 
          },
          waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false,
        });
        
        setDirections(result);
      } catch (error) {
        console.error('Error fetching directions:', error);
        setDirections(null);
      }
    };

    fetchDirections();
  }, [locations, isLoaded]);

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
        {!directions && locations.map((location, index) => (
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
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: '#4A90E2',
                strokeWeight: 4,
              },
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};
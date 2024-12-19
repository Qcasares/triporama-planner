import { useEffect, useRef, useState } from 'react';
import { Location } from '@/types/location';

const mapOptions: google.maps.MapOptions = {
  zoom: 12,
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
};

export const useMap = (locations: Location[]) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<{
    map: google.maps.Map | null;
    markers: google.maps.Marker[];
    directionsRenderer: google.maps.DirectionsRenderer | null;
  }>({
    map: null,
    markers: [],
    directionsRenderer: null,
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      ...mapOptions,
      center: locations[0] ? { lat: locations[0].lat, lng: locations[0].lng } : { lat: 0, lng: 0 },
    });

    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#8b5cf6',
        strokeOpacity: 0.8,
        strokeWeight: 4
      }
    });

    directionsRenderer.setMap(map);

    setMapState({
      map,
      markers: [],
      directionsRenderer
    });
  }, [locations]);

  // Update markers and bounds when locations change
  useEffect(() => {
    if (!mapState.map || !window.google) return;

    // Clear existing markers
    mapState.markers.forEach(marker => marker.setMap(null));

    if (locations.length === 0) return;

    // Create bounds object
    const bounds = new google.maps.LatLngBounds();

    // Create new markers and extend bounds
    const newMarkers = locations.map((location, index) => {
      if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
        console.error('Invalid coordinates for location:', location);
        return null;
      }

      const position = new google.maps.LatLng(location.lat, location.lng);
      bounds.extend(position);

      const isFirst = index === 0;
      const isLast = index === locations.length - 1;

      return new google.maps.Marker({
        position,
        map: mapState.map,
        title: location.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#8b5cf6',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        },
        label: isFirst ? 'Start' : isLast ? 'End' : `${index + 1}`,
      });
    }).filter((marker): marker is google.maps.Marker => marker !== null);

    setMapState(prev => ({
      ...prev,
      markers: newMarkers
    }));

    // Fit bounds with padding
    if (newMarkers.length > 0) {
      mapState.map.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      });
    }
  }, [locations, mapState.map]);

  // Update directions when multiple locations exist
  useEffect(() => {
    if (!mapState.map || !mapState.directionsRenderer || !window.google || locations.length < 2) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    const origin = locations[0];
    const destination = locations[locations.length - 1];
    const waypoints = locations.slice(1, -1).map(location => ({
      location: { lat: location.lat, lng: location.lng },
      stopover: true
    }));

    if (!origin || !destination) return;

    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          mapState.directionsRenderer?.setDirections(result);
        }
      }
    );
  }, [locations, mapState.map, mapState.directionsRenderer]);

  return {
    mapRef,
    map: mapState.map,
    markers: mapState.markers
  };
};
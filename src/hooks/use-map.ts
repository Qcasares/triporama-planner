import { useEffect, useRef, useState } from 'react';
import { Location } from '@/types/location';

const mapOptions: google.maps.MapOptions = {
  zoom: 12,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
  gestureHandling: "cooperative",
};

export const useMap = (locations: Location[]) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<{
    map: google.maps.Map | null;
    markers: google.maps.Marker[];
    directionsRenderer: google.maps.DirectionsRenderer | null;
    distanceMatrix: google.maps.DistanceMatrixService | null;
  }>({
    map: null,
    markers: [],
    directionsRenderer: null,
    distanceMatrix: null,
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
        strokeWeight: 4,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
          },
          offset: '100%',
          repeat: '20px'
        }]
      }
    });

    directionsRenderer.setMap(map);

    const distanceMatrix = new google.maps.DistanceMatrixService();

    setMapState({
      map,
      markers: [],
      directionsRenderer,
      distanceMatrix
    });
  }, [locations]);

  // Update markers and calculate routes
  useEffect(() => {
    if (!mapState.map || !window.google || locations.length < 2) return;

    // Clear existing markers
    mapState.markers.forEach(marker => marker.setMap(null));

    // Create new markers with custom icons and animations
    const newMarkers = locations.map((location, index) => {
      const isFirst = index === 0;
      const isLast = index === locations.length - 1;

      return new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapState.map,
        title: location.name,
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: isFirst ? '#22c55e' : isLast ? '#ef4444' : '#8b5cf6',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        },
        label: {
          text: (index + 1).toString(),
          color: '#ffffff',
          fontWeight: 'bold',
        },
      });
    });

    // Calculate and display route
    const directionsService = new google.maps.DirectionsService();
    const origin = locations[0];
    const destination = locations[locations.length - 1];
    const waypoints = locations.slice(1, -1).map(location => ({
      location: { lat: location.lat, lng: location.lng },
      stopover: true
    }));

    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          mapState.directionsRenderer?.setDirections(result);
          
          // Fit bounds to show all markers
          const bounds = new google.maps.LatLngBounds();
          locations.forEach(location => {
            bounds.extend({ lat: location.lat, lng: location.lng });
          });
          mapState.map?.fitBounds(bounds, 50);
        }
      }
    );

    setMapState(prev => ({
      ...prev,
      markers: newMarkers
    }));
  }, [locations, mapState.map, mapState.directionsRenderer]);

  return {
    mapRef,
    map: mapState.map,
    markers: mapState.markers,
    distanceMatrix: mapState.distanceMatrix
  };
};
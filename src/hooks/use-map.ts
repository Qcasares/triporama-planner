import { useEffect, useRef, useState } from 'react';
import { Location } from '@/types/location';

const mapOptions: google.maps.MapOptions = {
  zoom: 12,
<<<<<<< HEAD
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
=======
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
  gestureHandling: "cooperative",
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)
};

export const useMap = (locations: Location[]) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<{
    map: google.maps.Map | null;
    markers: google.maps.Marker[];
    directionsRenderer: google.maps.DirectionsRenderer | null;
<<<<<<< HEAD
=======
    distanceMatrix: google.maps.DistanceMatrixService | null;
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)
  }>({
    map: null,
    markers: [],
    directionsRenderer: null,
<<<<<<< HEAD
=======
    distanceMatrix: null,
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)
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
<<<<<<< HEAD
        strokeWeight: 4
=======
        strokeWeight: 4,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
          },
          offset: '100%',
          repeat: '20px'
        }]
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)
      }
    });

    directionsRenderer.setMap(map);

<<<<<<< HEAD
    setMapState({
      map,
      markers: [],
      directionsRenderer
    });
  }, [locations]);

  // Update markers when locations change
  useEffect(() => {
    if (!mapState.map || !window.google) return;
=======
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
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)

    // Clear existing markers
    mapState.markers.forEach(marker => marker.setMap(null));

<<<<<<< HEAD
    // Create new markers
    const newMarkers = locations.map((location, index) => {
      if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
        console.error('Invalid coordinates for location:', location);
        return null;
      }

=======
    // Create new markers with custom icons and animations
    const newMarkers = locations.map((location, index) => {
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)
      const isFirst = index === 0;
      const isLast = index === locations.length - 1;

      return new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapState.map,
        title: location.name,
<<<<<<< HEAD
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#8b5cf6',
=======
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: isFirst ? '#22c55e' : isLast ? '#ef4444' : '#8b5cf6',
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        },
<<<<<<< HEAD
        label: isFirst ? 'Start' : isLast ? 'End' : `${index + 1}`,
      });
    }).filter((marker): marker is google.maps.Marker => marker !== null);

    setMapState(prev => ({
      ...prev,
      markers: newMarkers
    }));

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const position = marker.getPosition();
        if (position) {
          bounds.extend(position);
        }
      });
      mapState.map.fitBounds(bounds, 50);
    }
  }, [locations, mapState.map]);

  // Update directions when multiple locations exist
  useEffect(() => {
    if (!mapState.map || !mapState.directionsRenderer || !window.google || locations.length < 2) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();

=======
        label: {
          text: (index + 1).toString(),
          color: '#ffffff',
          fontWeight: 'bold',
        },
      });
    });

    // Calculate and display route
    const directionsService = new google.maps.DirectionsService();
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)
    const origin = locations[0];
    const destination = locations[locations.length - 1];
    const waypoints = locations.slice(1, -1).map(location => ({
      location: { lat: location.lat, lng: location.lng },
      stopover: true
    }));

<<<<<<< HEAD
    if (!origin || !destination) return;

=======
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)
    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
<<<<<<< HEAD
=======
        provideRouteAlternatives: true,
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          mapState.directionsRenderer?.setDirections(result);
<<<<<<< HEAD
        }
      }
    );
=======
          
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
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)
  }, [locations, mapState.map, mapState.directionsRenderer]);

  return {
    mapRef,
    map: mapState.map,
<<<<<<< HEAD
    markers: mapState.markers
=======
    markers: mapState.markers,
    distanceMatrix: mapState.distanceMatrix
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)
  };
};
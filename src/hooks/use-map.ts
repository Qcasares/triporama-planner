import { useEffect, useRef, useState } from 'react';
import { mapOptions } from '@/config/map-styles';
import { Location } from '@/types/location';

interface MapState {
  map: google.maps.Map | null;
  markers: google.maps.Marker[];
  directionsRenderer: google.maps.DirectionsRenderer | null;
}

export const useMap = (locations: Location[]) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<MapState>({
    map: null,
    markers: [],
    directionsRenderer: null
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      ...mapOptions,
      center: locations[0] 
        ? { lat: locations[0].lat, lng: locations[0].lng }
        : { lat: 0, lng: 0 },
      zoom: locations[0] ? 12 : 2
    });

    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#84cc16',
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

  // Update markers when locations change
  useEffect(() => {
    if (!mapState.map || !window.google) return;

    // Clear existing markers
    mapState.markers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = locations.map((location, index) => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapState.map,
        title: location.name,
        label: {
          text: (index + 1).toString(),
          color: '#ffffff',
          fontWeight: 'bold'
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#84cc16',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 12
        },
        animation: google.maps.Animation.DROP
      });

      // Add hover effect
      marker.addListener('mouseover', () => {
        marker.setIcon({
          ...marker.getIcon() as google.maps.Symbol,
          fillColor: '#65a30d',
          scale: 14
        });
      });

      marker.addListener('mouseout', () => {
        marker.setIcon({
          ...marker.getIcon() as google.maps.Symbol,
          fillColor: '#84cc16',
          scale: 12
        });
      });

      return marker;
    });

    setMapState(prev => ({
      ...prev,
      markers: newMarkers
    }));

    // Update map bounds to fit all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => bounds.extend(marker.getPosition()!));
      mapState.map.fitBounds(bounds, 50);
    }
  }, [locations, mapState.map]);

  // Update directions when multiple locations exist
  useEffect(() => {
    if (!mapState.map || !mapState.directionsRenderer || !window.google || locations.length < 2) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const waypoints = locations.slice(1, -1).map(location => ({
      location: { lat: location.lat, lng: location.lng },
      stopover: true
    }));

    directionsService.route(
      {
        origin: { lat: locations[0].lat, lng: locations[0].lng },
        destination: { 
          lat: locations[locations.length - 1].lat, 
          lng: locations[locations.length - 1].lng 
        },
        waypoints,
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.DRIVING
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
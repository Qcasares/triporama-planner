import { useEffect, useRef } from 'react';
import { Location } from '@/types/location';

const DEFAULT_CENTER = { lat: 0, lng: 0 };
const DEFAULT_ZOOM = 2;

export const useMap = (locations: Location[] = []) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      center: locations[0] 
        ? { lat: locations[0].lat, lng: locations[0].lng }
        : DEFAULT_CENTER,
      zoom: locations.length > 0 ? 8 : DEFAULT_ZOOM,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true,
    });

    // Only add markers and calculate routes if we have locations
    if (locations.length > 0) {
      // Add markers
      const bounds = new google.maps.LatLngBounds();
      const markers = locations.map((location, index) => {
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
          title: location.name,
          label: {
            text: (index + 1).toString(),
            color: '#ffffff',
            fontWeight: 'bold',
          },
        });
        bounds.extend(marker.getPosition()!);
        return marker;
      });

      // Fit bounds to show all markers
      map.fitBounds(bounds);

      // Calculate and display route if we have at least 2 locations
      if (locations.length >= 2) {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
        });

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
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              directionsRenderer.setDirections(result);
            }
          }
        );

        return () => {
          directionsRenderer.setMap(null);
          markers.forEach(marker => marker.setMap(null));
        };
      }

      return () => {
        markers.forEach(marker => marker.setMap(null));
      };
    }

    return () => {};
  }, [locations]);

  return { mapRef };
};
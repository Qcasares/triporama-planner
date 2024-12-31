import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { OSRMRoute } from '../../types/maps';
import polyline from '@mapbox/polyline';

interface DirectionsLayerProps {
  route?: OSRMRoute;
  color?: string;
  weight?: number;
  opacity?: number;
}

const DirectionsLayer = ({ 
  route,
  color = '#3b82f6',
  weight = 5,
  opacity = 0.7
}: DirectionsLayerProps) => {
  const layerRef = useRef<L.Polyline | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Get the map instance from the parent container
    const map = (document.querySelector('[class*="leaflet-container"]') as HTMLElement)?._leaflet_map;
    if (!map) return;
    mapRef.current = map as L.Map;

    return () => {
      if (layerRef.current) {
        layerRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !route?.geometry) return;

    // Remove existing layer
    if (layerRef.current) {
      layerRef.current.remove();
    }

    try {
      // Decode the polyline geometry
      const coordinates = polyline.decode(route.geometry).map(([lat, lng]) => [lat, lng]);

      // Create and add the polyline layer
      layerRef.current = L.polyline(coordinates, {
        color,
        weight,
        opacity,
        lineJoin: 'round'
      }).addTo(mapRef.current);

      // Fit bounds to show the entire route
      mapRef.current.fitBounds(layerRef.current.getBounds(), {
        padding: [50, 50]
      });
    } catch (error) {
      console.error('Error rendering directions:', error);
    }
  }, [route, color, weight, opacity]);

  return null;
};

export default DirectionsLayer;

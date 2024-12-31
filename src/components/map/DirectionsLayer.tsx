import { useEffect, useRef, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the map instance from the parent container
    const container = document.querySelector('[class*="leaflet-container"]');
    if (!container) return;
    
    // Type-safe way to get the map instance
    const map = (container as any)._leaflet_map as L.Map | undefined;
    if (!map) return;
    mapRef.current = map;

    return () => {
      if (layerRef.current) {
        layerRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !route?.routes?.[0]?.geometry) return;

    const renderRoute = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Remove existing layer
        if (layerRef.current) {
          layerRef.current.remove();
        }

        // Decode the polyline geometry
        const coordinates = polyline.decode(route.routes[0].geometry).map(([lat, lng]) => [lat, lng]);

        // Create and add the polyline layer
        layerRef.current = L.polyline(coordinates, {
          color,
          weight,
          opacity,
          lineJoin: 'round',
          dashArray: '5, 5'
        }).addTo(mapRef.current);

        // Fit bounds to show the entire route
        mapRef.current.fitBounds(layerRef.current.getBounds(), {
          padding: [50, 50]
        });
      } catch (error) {
        console.error('Error rendering directions:', error);
        setError('Failed to render directions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    renderRoute();
  }, [route, color, weight, opacity]);

  if (error) {
    return (
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-50">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded z-50">
        Loading directions...
      </div>
    );
  }

  return null;
};

export default DirectionsLayer;

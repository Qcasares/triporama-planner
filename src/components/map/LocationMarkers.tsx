import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { Location, LocationType } from '../../types/location';
import { POI, MapMarker } from '../../types/maps';

interface LocationMarkersProps {
  locations: Location[];
  pois?: POI[];
  customMarkers?: MapMarker[];
  onMarkerClick?: (location: Location | POI | MapMarker) => void;
  map?: L.Map;
}

const getMarkerIcon = (type: LocationType | string) => {
  const iconBase = '/icons/';
  const icons: { [key: string]: string } = {
    [LocationType.ATTRACTION]: `${iconBase}attraction.svg`,
    [LocationType.RESTAURANT]: `${iconBase}restaurant.svg`,
    [LocationType.HOTEL]: `${iconBase}hotel.svg`,
    [LocationType.SHOPPING]: `${iconBase}shopping.svg`,
    [LocationType.NATURE]: `${iconBase}nature.svg`,
    'poi': `${iconBase}poi.svg`,
    'custom': `${iconBase}custom.svg`,
  };
  
  return icons[type] || `${iconBase}default.svg`;
};

export const LocationMarkers = ({ 
  locations, 
  pois = [], 
  customMarkers = [],
  onMarkerClick,
  map
}: LocationMarkersProps) => {
  const [selectedMarker, setSelectedMarker] = useState<Location | POI | MapMarker | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const popupRef = useRef<L.Popup | null>(null);

  const handleMarkerClick = (marker: Location | POI | MapMarker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  // Create markers
  useEffect(() => {
    if (!map) return;

    // Get marker cluster group from map instance
    const markerClusterGroup = (map as any)._markerClusterGroup as L.MarkerClusterGroup;
    if (!markerClusterGroup) return;

    // Clear existing markers
    markersRef.current.forEach(marker => markerClusterGroup.removeLayer(marker));
    markersRef.current = [];

    // Add location markers
    locations.forEach((location, index) => {
      const marker = L.marker([location.lat, location.lng], {
        icon: L.icon({
          iconUrl: getMarkerIcon(location.type),
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        }),
        title: location.name
      });

      marker.bindTooltip((index + 1).toString(), {
        permanent: true,
        className: 'leaflet-marker-label',
        direction: 'center',
        offset: [0, 0]
      });

      marker.on('click', () => handleMarkerClick(location));
      markerClusterGroup.addLayer(marker);
      markersRef.current.push(marker);
    });

    // Add POI markers
    pois.forEach(poi => {
      const marker = L.marker([poi.lat, poi.lon], {
        icon: L.icon({
          iconUrl: getMarkerIcon('poi'),
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        }),
        title: poi.name
      });

      marker.on('click', () => handleMarkerClick(poi));
      markerClusterGroup.addLayer(marker);
      markersRef.current.push(marker);
    });

    // Add custom markers
    customMarkers.forEach(marker => {
      const leafletMarker = L.marker([marker.position[0], marker.position[1]], {
        icon: L.icon({
          iconUrl: marker.icon || getMarkerIcon('custom'),
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        }),
        title: marker.title
      });

      leafletMarker.on('click', () => handleMarkerClick(marker));
      markerClusterGroup.addLayer(leafletMarker);
      markersRef.current.push(leafletMarker);
    });

    return () => {
      markersRef.current.forEach(marker => markerClusterGroup.removeLayer(marker));
    };
  }, [locations, pois, customMarkers, map]);

  // Handle popup for selected marker
  useEffect(() => {
    if (!map || !selectedMarker) return;

    const position: L.LatLngExpression = 'lat' in selectedMarker
      ? [selectedMarker.lat, 'lng' in selectedMarker ? selectedMarker.lng : selectedMarker.lon] as L.LatLngTuple
      : [selectedMarker.position[0], selectedMarker.position[1]] as L.LatLngTuple;

    const content = `
      <div class="p-2">
        <h3 class="font-semibold">
          ${'name' in selectedMarker 
            ? selectedMarker.name 
            : ('title' in selectedMarker ? selectedMarker.title : '')}
        </h3>
        ${'type' in selectedMarker ? `<p class="text-sm text-gray-600">${selectedMarker.type}</p>` : ''}
        ${'rating' in selectedMarker && selectedMarker.rating ? `<p class="text-sm">Rating: ${selectedMarker.rating}⭐</p>` : ''}
        ${'description' in selectedMarker && selectedMarker.description ? `<p class="text-sm mt-1">${selectedMarker.description}</p>` : ''}
        ${'opening_hours' in selectedMarker && selectedMarker.opening_hours ? `<p class="text-sm mt-1">Hours: ${selectedMarker.opening_hours}</p>` : ''}
      </div>
    `;

    if (popupRef.current) {
      popupRef.current.remove();
    }

    popupRef.current = L.popup()
      .setLatLng(position)
      .setContent(content)
      .openOn(map);

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [selectedMarker, map]);

  return null;
};

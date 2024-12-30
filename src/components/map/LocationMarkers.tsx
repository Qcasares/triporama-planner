import { Marker, InfoWindow } from '@react-google-maps/api';
import { Location, LocationType } from '../../types/location';
import { POI, MapMarker } from '../../types/maps';
import { useState } from 'react';

interface LocationMarkersProps {
  locations: Location[];
  pois?: POI[];
  customMarkers?: MapMarker[];
  onMarkerClick?: (location: Location | POI | MapMarker) => void;
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
  onMarkerClick 
}: LocationMarkersProps) => {
  const [selectedMarker, setSelectedMarker] = useState<Location | POI | MapMarker | null>(null);

  const handleMarkerClick = (marker: Location | POI | MapMarker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  return (
    <>
      {/* Location Markers */}
      {locations.map((location, index) => (
        <Marker
          key={location.id}
          position={{ lat: location.lat, lng: location.lng }}
          icon={{
            url: getMarkerIcon(location.type),
            scaledSize: new google.maps.Size(32, 32)
          }}
          label={{
            text: (index + 1).toString(),
            color: '#ffffff',
            fontWeight: 'bold',
          }}
          title={location.name}
          onClick={() => handleMarkerClick(location)}
        />
      ))}

      {/* POI Markers */}
      {pois.map((poi) => (
        <Marker
          key={poi.id}
          position={{ lat: poi.lat, lng: poi.lon }}
          icon={{
            url: getMarkerIcon('poi'),
            scaledSize: new google.maps.Size(24, 24)
          }}
          title={poi.name}
          onClick={() => handleMarkerClick(poi)}
        />
      ))}

      {/* Custom Markers */}
      {customMarkers.map((marker) => (
        <Marker
          key={marker.id}
          position={{ lat: marker.position[0], lng: marker.position[1] }}
          icon={{
            url: marker.icon || getMarkerIcon('custom'),
            scaledSize: new google.maps.Size(24, 24)
          }}
          title={marker.title}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}

      {/* Info Window for selected marker */}
      {selectedMarker && (
        <InfoWindow
          position={
            'lat' in selectedMarker
              ? { lat: selectedMarker.lat, lng: 'lng' in selectedMarker ? selectedMarker.lng : selectedMarker.lon }
              : { lat: selectedMarker.position[0], lng: selectedMarker.position[1] }
          }
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className="p-2">
            <h3 className="font-semibold">
              {'name' in selectedMarker 
                ? selectedMarker.name 
                : ('title' in selectedMarker ? selectedMarker.title : '')}
            </h3>
            {'type' in selectedMarker && <p className="text-sm text-gray-600">{selectedMarker.type}</p>}
            {'rating' in selectedMarker && selectedMarker.rating && (
              <p className="text-sm">Rating: {selectedMarker.rating}⭐</p>
            )}
            {'description' in selectedMarker && selectedMarker.description && (
              <p className="text-sm mt-1">{selectedMarker.description}</p>
            )}
            {'opening_hours' in selectedMarker && selectedMarker.opening_hours && (
              <p className="text-sm mt-1">Hours: {selectedMarker.opening_hours}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

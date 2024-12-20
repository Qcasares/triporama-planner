import { Marker } from '@react-google-maps/api';
import { Location } from '@/types/location';

interface LocationMarkersProps {
  locations: Location[];
  onClick?: (location: Location) => void;
}

export const LocationMarkers = ({ locations, onClick }: LocationMarkersProps) => {
  return (
    <>
      {locations.map((location, index) => (
        <Marker
          key={location.id}
          position={{ lat: location.lat, lng: location.lng }}
          label={{
            text: (index + 1).toString(),
            color: '#ffffff',
            fontWeight: 'bold',
            className: 'marker-label'
          }}
          title={location.name}
          onClick={() => onClick?.(location)}
          options={{
            optimized: true,
            clickable: true,
            visible: true,
          }}
        />
      ))}
    </>
  );
};
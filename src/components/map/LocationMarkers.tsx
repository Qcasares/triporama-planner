import { Marker } from '@react-google-maps/api';
import { Location } from '../TripPlanner';

interface LocationMarkersProps {
  locations: Location[];
}

export const LocationMarkers = ({ locations }: LocationMarkersProps) => {
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
          }}
          title={location.name}
        />
      ))}
    </>
  );
};
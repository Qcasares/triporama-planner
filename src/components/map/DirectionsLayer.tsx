import { DirectionsRenderer } from '@react-google-maps/api';

interface DirectionsLayerProps {
  directions: google.maps.DirectionsResult;
}

export const DirectionsLayer = ({ directions }: DirectionsLayerProps) => {
  return (
    <DirectionsRenderer
      directions={directions}
      options={{
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#4A90E2',
          strokeWeight: 4,
        },
      }}
    />
  );
};
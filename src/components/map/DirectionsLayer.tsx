import React from 'react';
import { DirectionsRenderer } from '@react-google-maps/api';

interface DirectionsLayerProps {
  directions: google.maps.DirectionsResult;
}

export const DirectionsLayer = ({ directions }: DirectionsLayerProps) => {
  if (!directions) return null;
  
  return (
    <DirectionsRenderer
      directions={directions}
      options={{
        suppressMarkers: true, // We'll handle markers separately
        polylineOptions: {
          strokeColor: '#4A90E2',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
        markerOptions: {
          visible: false,
        },
      }}
    />
  );
};
import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Location } from '@/types/location';

export interface MapClickInfoWindowProps {
  position: google.maps.LatLngLiteral;
  name: string;
  onClose: () => void;
  onAdd: () => void;
  location?: Location;
}

export const MapClickInfoWindow = ({
  position,
  name,
  onClose,
  onAdd,
  location,
}: MapClickInfoWindowProps) => {
  return (
    <InfoWindow position={position} onCloseClick={onClose}>
      <div className="p-2">
        <h3 className="font-medium mb-2">{name}</h3>
        <Button onClick={onAdd} size="sm">Add to Trip</Button>
      </div>
    </InfoWindow>
  );
};
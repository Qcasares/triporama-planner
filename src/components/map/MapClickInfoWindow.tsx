import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface MapClickInfoWindowProps {
  position: { lat: number; lng: number };
  name: string;
  onClose: () => void;
  onAdd: () => void;
}

export const MapClickInfoWindow = ({ position, name, onClose, onAdd }: MapClickInfoWindowProps) => {
  return (
    <InfoWindow
      position={position}
      onCloseClick={onClose}
    >
      <div className="p-2">
        <p className="text-sm mb-2">{name}</p>
        <Button 
          size="sm" 
          onClick={onAdd}
          className="w-full flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add to Itinerary
        </Button>
      </div>
    </InfoWindow>
  );
};
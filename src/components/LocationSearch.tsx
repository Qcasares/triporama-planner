import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { Location } from '@/types/location';
import { useLoadScript } from '@react-google-maps/api';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

// Define libraries array outside component to prevent unnecessary reloads
const GOOGLE_MAPS_LIBRARIES: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

export const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [searchInput, setSearchInput] = useState('');
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Use state to store API key but don't update it
  const [apiKey] = useState(() => localStorage.getItem('googleMapsApiKey') || '');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    autoCompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
      fields: ['place_id', 'geometry', 'formatted_address', 'name'],
    });

    autoCompleteRef.current.addListener('place_changed', () => {
      if (!autoCompleteRef.current) return;

      const place = autoCompleteRef.current.getPlace();
      
      if (place.geometry?.location) {
        const newLocation: Location = {
          id: place.place_id || Math.random().toString(),
          name: place.formatted_address || place.name || 'Unknown location',
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        
        onLocationSelect(newLocation);
        setSearchInput('');
      }
    });

    return () => {
      if (autoCompleteRef.current) {
        google.maps.event.clearInstanceListeners(autoCompleteRef.current);
      }
    };
  }, [isLoaded, onLocationSelect]);

  if (!isLoaded) {
    return (
      <div className="relative">
        <Input
          type="text"
          placeholder="Loading places search..."
          disabled
          className="pr-10"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          disabled
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search for a location..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="pr-10"
      />
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        disabled
      >
        <Search className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
};
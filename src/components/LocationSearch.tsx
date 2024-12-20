import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Location } from '@/types/location';
import { useToast } from '@/hooks/use-toast';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

export const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [searchValue, setSearchValue] = useState('');
  const { toast } = useToast();
  const [apiKey] = useState(() => localStorage.getItem('googleMapsApiKey') || '');

  const handleSearch = useCallback(async () => {
    if (!searchValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "Error",
        description: "Google Maps API key is required",
        variant: "destructive",
      });
      return;
    }

    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ address: searchValue });
      if (response.results[0]) {
        const { lat, lng } = response.results[0].geometry.location;
        onLocationSelect({
          id: String(Date.now()),
          name: response.results[0].formatted_address,
          lat: lat(),
          lng: lng(),
        });
        setSearchValue('');
        toast({
          title: "Success",
          description: "Location added to your trip",
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: "Error",
        description: "Could not find location",
        variant: "destructive",
      });
    }
  }, [searchValue, apiKey, onLocationSelect, toast]);

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search for a location..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="w-full"
      />
    </div>
  );
};
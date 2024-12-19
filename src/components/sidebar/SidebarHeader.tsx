import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { LocationSearch } from '../LocationSearch';
import { Location } from '@/types/location';

interface SidebarHeaderProps {
  onAddLocation: (location: Location) => void;
}

export const SidebarHeader = ({ onAddLocation }: SidebarHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">Trip Itinerary</h2>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <ChevronLeft />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <div className="p-4">
        <LocationSearch onLocationSelect={onAddLocation} />
      </div>
    </>
  );
};
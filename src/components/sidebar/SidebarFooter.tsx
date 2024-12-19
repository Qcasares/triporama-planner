import React from 'react';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TripSummary } from '../TripSummary';
import { Location } from '@/types/location';

interface SidebarFooterProps {
  locations: Location[];
  isSummaryOpen: boolean;
  toggleSummary: () => void;
}

export const SidebarFooter = ({ locations, isSummaryOpen, toggleSummary }: SidebarFooterProps) => {
  return (
    <div className="border-t p-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={toggleSummary}
      >
        {isSummaryOpen ? (
          <>Hide Trip Summary <ChevronUp className="ml-2 h-4 w-4" /></>
        ) : (
          <>Show Trip Summary <ChevronDown className="ml-2 h-4 w-4" /></>
        )}
      </Button>
      {isSummaryOpen && (
        <div className="mt-4">
          <TripSummary locations={locations} />
        </div>
      )}
    </div>
  );
};
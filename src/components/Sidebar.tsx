import React from 'react';
import { Location } from '@/types/location';
import { Sidebar as ShadcnSidebar } from '@/components/ui/sidebar';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { LocationList } from './sidebar/LocationList';
import { SidebarFooter } from './sidebar/SidebarFooter';

interface SidebarProps {
  locations: Location[];
  onAddLocation: (location: Location) => void;
  onRemoveLocation: (locationId: string) => void;
  onReorderLocations: (startIndex: number, endIndex: number) => void;
  onUpdateDates: (locationId: string, startDate?: Date, endDate?: Date) => void;
  isSummaryOpen: boolean;
  toggleSummary: () => void;
}

export const Sidebar = ({
  locations,
  onAddLocation,
  onRemoveLocation,
  onReorderLocations,
  onUpdateDates,
  isSummaryOpen,
  toggleSummary,
}: SidebarProps) => {
  return (
    <ShadcnSidebar>
      <div className="flex flex-col h-full">
        <SidebarHeader onAddLocation={onAddLocation} />
        <LocationList
          locations={locations}
          onRemoveLocation={onRemoveLocation}
          onReorderLocations={onReorderLocations}
          onUpdateDates={onUpdateDates}
        />
        <SidebarFooter
          locations={locations}
          isSummaryOpen={isSummaryOpen}
          toggleSummary={toggleSummary}
        />
      </div>
    </ShadcnSidebar>
  );
};
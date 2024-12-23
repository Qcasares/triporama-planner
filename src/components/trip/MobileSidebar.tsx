import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Location } from '@/types/location';
import { Sidebar } from '@/components/Sidebar';

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  locations: Location[];
  selectedLocation: Location | null;
  loading: boolean;
  onAddLocation: (location: Location) => void;
  onRemoveLocation: (id: string) => void;
  onSelectLocation: (location: Location) => void;
  onReorderLocations: (startIndex: number, endIndex: number) => void;
  onUpdateDates: (locationId: string, startDate?: Date, endDate?: Date) => void;
  isSummaryOpen: boolean;
  toggleSummary: () => void;
}

export const MobileSidebar = ({
  isOpen,
  setIsOpen,
  locations,
  selectedLocation,
  loading,
  onAddLocation,
  onRemoveLocation,
  onSelectLocation,
  onReorderLocations,
  onUpdateDates,
  isSummaryOpen,
  toggleSummary,
}: MobileSidebarProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="fixed left-4 top-4 z-50 md:hidden animate-in fade-in-50 bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 bg-white">
        <Sidebar
          locations={locations}
          selectedLocation={selectedLocation}
          loading={loading}
          onAddLocation={() => onAddLocation({
            id: String(Date.now()),
            name: 'New Location',
            lat: 0,
            lng: 0,
          })}
          onRemoveLocation={onRemoveLocation}
          onSelectLocation={onSelectLocation}
          onReorderLocations={onReorderLocations}
          onUpdateDates={onUpdateDates}
          isSummaryOpen={isSummaryOpen}
          toggleSummary={toggleSummary}
        />
      </SheetContent>
    </Sheet>
  );
};
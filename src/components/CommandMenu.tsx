import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Location } from '@/types/location';
import { MapIcon, PlusCircleIcon, ListIcon, MapPinIcon } from 'lucide-react';

interface CommandMenuProps {
  locations: Location[];
  onAddLocation: (location: Location) => void;
  isSummaryOpen: boolean;
  toggleSummary: () => void;
}

export const CommandMenu = ({
  locations,
  onAddLocation,
  isSummaryOpen,
  toggleSummary,
}: CommandMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              // This is a placeholder - you'll need to implement the actual location adding logic
              onAddLocation({
                id: String(Date.now()),
                name: 'New Location',
                latitude: 0,
                longitude: 0,
              });
            }}
          >
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Add New Location
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setOpen(false);
              toggleSummary();
            }}
          >
            <ListIcon className="mr-2 h-4 w-4" />
            {isSummaryOpen ? 'Hide' : 'Show'} Trip Summary
          </CommandItem>
        </CommandGroup>

        {locations.length > 0 && (
          <CommandGroup heading="Locations">
            {locations.map((location) => (
              <CommandItem
                key={location.id}
                onSelect={() => {
                  setOpen(false);
                  // You can implement location selection/focus logic here
                }}
              >
                <MapPinIcon className="mr-2 h-4 w-4" />
                {location.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              navigate('/');
            }}
          >
            <MapIcon className="mr-2 h-4 w-4" />
            Map View
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
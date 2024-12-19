import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { PlusCircle } from 'lucide-react';
import { Location } from '@/types/location';

interface CommandMenuProps {
  locations: Location[];
  onAddLocation: (location: Location) => void;
  isSummaryOpen: boolean;
  toggleSummary: () => void;
}

export const CommandMenu = ({ locations, onAddLocation, isSummaryOpen, toggleSummary }: CommandMenuProps) => {
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
              onAddLocation({
                id: String(Date.now()),
                name: 'New Location',
                lat: 0,
                lng: 0,
              });
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Location
          </CommandItem>

          <CommandItem
            onSelect={() => {
              setOpen(false);
              toggleSummary();
            }}
          >
            Toggle Summary
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { PlusCircle, Map, List, Home, Settings, Key } from 'lucide-react';
import { Location } from '@/types/location';
import { useToast } from '@/hooks/use-toast';
import { ApiKeyInput } from './ApiKeyInput';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CommandMenuProps {
  locations: Location[];
  onAddLocation: (location: Location) => void;
  isSummaryOpen: boolean;
  toggleSummary: () => void;
}

export const CommandMenu = ({ locations, onAddLocation, isSummaryOpen, toggleSummary }: CommandMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = React.useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      // Add location shortcut
      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onAddLocation({
          id: String(Date.now()),
          name: 'New Location',
          lat: 0,
          lng: 0,
        });
        toast({
          title: "Shortcut activated",
          description: "New location added (Cmd/Ctrl + N)",
        });
      }
      // Toggle summary shortcut
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSummary();
        toast({
          title: "Shortcut activated",
          description: "Summary toggled (Cmd/Ctrl + S)",
        });
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onAddLocation, toggleSummary, toast]);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => {
              setOpen(false);
              navigate('/');
            }}>
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                setShowApiKeyDialog(true);
              }}
            >
              <Key className="mr-2 h-4 w-4" />
              Manage API Key
            </CommandItem>
          </CommandGroup>

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
              Add New Location (⌘/Ctrl + N)
            </CommandItem>

            <CommandItem
              onSelect={() => {
                setOpen(false);
                toggleSummary();
              }}
            >
              <List className="mr-2 h-4 w-4" />
              Toggle Summary (⌘/Ctrl + S)
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Google Maps API Key</DialogTitle>
          </DialogHeader>
          <ApiKeyInput onSave={() => setShowApiKeyDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
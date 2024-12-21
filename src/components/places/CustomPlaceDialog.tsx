import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

interface CustomPlaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customPlace: {
    name: string;
    type: string;
    notes: string;
  };
  onCustomPlaceChange: (field: string, value: string) => void;
  onAddCustomPlace: () => void;
  placeTypes: Record<string, string>;
}

export const CustomPlaceDialog = ({
  open,
  onOpenChange,
  customPlace,
  onCustomPlaceChange,
  onAddCustomPlace,
  placeTypes,
}: CustomPlaceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Place</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Place Name</label>
            <Input
              placeholder="Enter place name"
              value={customPlace.name}
              onChange={(e) => onCustomPlaceChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={customPlace.type}
              onValueChange={(value) => onCustomPlaceChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(placeTypes).map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Input
              placeholder="Add any notes about this place"
              value={customPlace.notes}
              onChange={(e) => onCustomPlaceChange('notes', e.target.value)}
            />
          </div>
          <Button onClick={onAddCustomPlace} className="w-full">
            Add Place
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
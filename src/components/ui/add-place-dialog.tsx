import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { placeTypes } from '@/hooks/use-places';

interface AddPlaceDialogProps {
  onAddPlace: (place: { name: string; type: string; notes: string }) => void;
}

export const AddPlaceDialog = ({ onAddPlace }: AddPlaceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    notes: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    type: ''
  });
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = {
      name: '',
      type: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Place name is required';
    }
    if (!formData.type) {
      newErrors.type = 'Category is required';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.type;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAddPlace(formData);
      setFormData({ name: '', type: '', notes: '' });
      setOpen(false);
      toast({
        title: "Place added",
        description: "Your custom place has been added successfully.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shrink-0 bg-sage-600 hover:bg-sage-700">
          <Building2 className="h-4 w-4 mr-2" />
          Add Custom Place
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Place</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-sage-700" htmlFor="place-name">
              Place Name
            </label>
            <Input
              id="place-name"
              placeholder="Enter place name"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              className={errors.name ? 'border-red-500' : 'border-sage-200'}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-sage-700" htmlFor="place-category">
              Category
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, type: value }));
                if (errors.type) setErrors(prev => ({ ...prev, type: '' }));
              }}
            >
              <SelectTrigger 
                id="place-category"
                className={errors.type ? 'border-red-500' : 'border-sage-200'}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(placeTypes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-sage-700" htmlFor="place-notes">
              Notes
            </label>
            <Input
              id="place-notes"
              placeholder="Add any notes about this place"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="border-sage-200"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-sage-600 hover:bg-sage-700"
          >
            Add Place
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

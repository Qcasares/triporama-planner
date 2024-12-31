import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../hooks/use-toast';
import { Location, LocationType } from '../../types/location';
import { useOffline } from '../../hooks/use-offline';

export const useTripPlanner = (
  currentLocation: Location | null,
  addLocation: (location: Location) => void,
  trip: { locations: Location[] }
) => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const isOffline = useOffline();

  useEffect(() => {
    if (currentLocation && trip.locations.length === 0) {
      addLocation(currentLocation);
      toast({
        title: "Location detected",
        description: "Your current location has been added as the starting point.",
        className: "animate-in fade-in-50 slide-in-from-bottom-5",
      });
    }
  }, [currentLocation, trip.locations.length, addLocation, toast]);

  const handleAddLocation = useCallback((location: Location) => {
    if (isOffline) {
      toast({
        title: "Offline Mode",
        description: "Adding locations is not available while offline.",
        variant: "destructive",
      });
      return;
    }

    // Validate location data
    if (!location.id || !location.name || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      toast({
        title: "Invalid Location Data",
        description: "Location data is incomplete or invalid. Please check the location details.",
        variant: "destructive",
      });
      throw new Error('Invalid location data');
    }

    const newLocation = {
      ...location,
      type: location.type || LocationType.OTHER
    };

    try {
      addLocation(newLocation);
    } catch (error) {
      toast({
        title: "Error Adding Location",
        description: "Failed to add location to trip. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
    toast({
      title: "Location added",
      description: `${newLocation.name} has been added to your trip.`,
      className: "animate-in fade-in-50 slide-in-from-bottom-5",
    });
    setIsOpen(false);
  }, [addLocation, toast, isOffline]);

  const handleGetUserLocation = useCallback(async () => {
    if (!currentLocation) {
      toast({
        title: "Location unavailable",
        description: "Unable to get your current location.",
        variant: "destructive",
      });
      throw new Error('Location unavailable');
    }

    handleAddLocation(currentLocation);
    toast({
      title: "Current location added",
      description: "Your current location has been added to the trip.",
      className: "animate-in fade-in-50 slide-in-from-bottom-5",
    });
    return currentLocation;
  }, [currentLocation, handleAddLocation, toast]);

  return {
    isSummaryOpen,
    setIsSummaryOpen,
    isOpen,
    setIsOpen,
    progress,
    setProgress,
    isOffline,
    handleAddLocation,
    handleGetUserLocation
  };
};
